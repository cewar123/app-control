import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  NativeModules, PermissionsAndroid, Alert, Platform, 
  ScrollView, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import SmsListener from 'react-native-android-sms-listener';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// TODO: Reemplaza con tus credenciales de la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDl0Er3GAAePfmCSu7erdgUddhB3cH1sqk",
  authDomain: "app-control-77886.firebaseapp.com",
  projectId: "app-control-77886",
  storageBucket: "app-control-77886.firebasestorage.app",
  messagingSenderId: "546194684037",
  appId: "1:546194684037:web:4105bbe5a642756e89d1ec",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [numPorton, setNumPorton] = useState(null);
  const [pin, setPin] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [historial, setHistorial] = useState([]);
  
  const router = useRouter();

  // 1. Cargar configuración e historial guardado al iniciar
  useEffect(() => {
    const inicializarApp = async () => {
      try {
        // Cargar Datos de Conexión
        const num = await AsyncStorage.getItem('@num_porton');
        const p = await AsyncStorage.getItem('@pin_porton');
        setNumPorton(num);
        setPin(p);

        // Cargar Historial Guardado
        const histGuardado = await AsyncStorage.getItem('@historial_sms');
        if (histGuardado) {
          setHistorial(JSON.parse(histGuardado));
        }
      } catch (e) {
        console.error("Error cargando memoria:", e);
      } finally {
        setCargando(false);
      }
    };

    inicializarApp();
  }, []);

  // 2. Escuchador de SMS y Permisos
  useEffect(() => {
  const pedirPermisos = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.SEND_SMS, // Añadimos SEND_SMS aquí también
        ]);

        if (
          granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.SEND_SMS'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permisos de SMS concedidos');
        } else {
          console.log('Permisos de SMS denegados');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  pedirPermisos();

    if (!numPorton) return;

    const subscription = SmsListener.addListener(async (message) => {
      if (message.originatingAddress.includes(numPorton)) {
        
        // Creamos el nuevo objeto de registro
        const nuevoRegistro = { 
          id: Date.now().toString(), 
          texto: message.body,
          accion: message.body,
          fecha: new Date().toLocaleTimeString(), 
          status: "Recibido" 
        };

        // Actualizamos el estado (la vista)
        setHistorial(prev => {
          const actualizado = [nuevoRegistro, ...prev].slice(0, 20); // Limitamos a los últimos 20
          
          // GUARDAR EN MEMORIA (AsyncStorage)
          // Lo hacemos aquí dentro para asegurar que tenemos el historial más reciente
          AsyncStorage.setItem('@historial_sms', JSON.stringify(actualizado));
          
          return actualizado;
        });

        // GUARDAR EN LA NUBE (Firebase Firestore)
        try {
          addDoc(collection(db, 'historial_portones'), {
            ...nuevoRegistro,
            numPorton: numPorton, // Identificador del equipo
            timestamp: new Date() // Fecha del servidor para ordenar luego
          });
        } catch (error) {
          console.error("Error guardando en la nube: ", error);
        }

        Alert.alert("Mensaje del Portón 🤖", message.body);
      }
    });

    return () => subscription.remove();
  }, [numPorton]);

  const verificarConfiguracion = async () => {
    try {
      const p = await AsyncStorage.getItem('@pin_porton');
      const n = await AsyncStorage.getItem('@num_porton');

      // Si no hay datos, lo mandamos a la pantalla de Setup
      if (!p || !n) {
        router.replace('/Setup');
      } else {
        // Si hay datos, los cargamos en el estado y mostramos el panel
        setPin(p);
        setNumPorton(n);
        setCargando(false);
      }
    } catch (e) {
      console.log("Error leyendo configuración", e);
      router.replace('/Setup');
    }
  };

  const enviarComando = async (tipoAccion) => {
    if (Platform.OS !== 'android') return;

    if (!telefono && (tipoAccion === 'GRABAR' || tipoAccion === 'BORRAR')) {
      Alert.alert("Faltan datos", "Escribe el teléfono del vecino");
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let mensajeSMS = "";
        let desc = "";

        switch (tipoAccion) {
          case 'GRABAR': mensajeSMS = `CLAVE ${pin} GRABAR ${telefono}`; desc = `Alta: ${nombre || 'Vecino'} (${telefono})`; break;
          case 'BORRAR': mensajeSMS = `CLAVE ${pin} BORRAR ${telefono}`; desc = `Baja: ${telefono}`; break;
          case 'ESTADO': mensajeSMS = `CLAVE ${pin}`; desc = `Consulta de estado solicitada`; break;
          case 'HISTORIAL': mensajeSMS = `CLAVE ${pin} HISTORIAL`; desc = `Solicitud de historial`; break;
        }

        if (NativeModules.DirectSms) {
          NativeModules.DirectSms.sendDirectSMS(numPorton, mensajeSMS, 
            async () => {
              const nuevo = { id: Date.now(), fecha: new Date().toLocaleTimeString(), accion: desc, status: 'Enviado' };
              setHistorial([nuevo, ...historial]);
              if (tipoAccion === 'GRABAR' || tipoAccion === 'BORRAR') { setNombre(''); setTelefono(''); }

              // GUARDAR COMANDO EN LA NUBE
              try {
                await addDoc(collection(db, 'historial_portones'), {
                  ...nuevo,
                  numPorton: numPorton,
                  timestamp: new Date()
                });
              } catch (error) {
                console.error("Error guardando comando en la nube: ", error);
              }
            }, 
            (err) => Alert.alert("Error Nativo", err)
          );
        }
      } else {
        Alert.alert("Permiso Denegado", "Se necesita acceso a SMS.");
      }
    } catch (err) {
      Alert.alert("Error Crítico", err.message);
    }
  };

  // Pantalla de carga mientras lee AsyncStorage (evita parpadeos raros)
  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D3557" />
        <Text style={{ marginTop: 10, color: '#666', fontFamily: 'LeagueSpartan' }}>Conectando con el equipo...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>
        <Text style={styles.subtitle}>Portón vinculado: {numPorton}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* GESTIÓN DE VECINOS */}
        <View style={styles.form}>
          <Text style={styles.label}>👤 Gestión de Usuarios</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Vecino"
            placeholderTextColor="#888"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono (Ej: 04141234567)"
            placeholderTextColor="#888"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={() => enviarComando('GRABAR')}>
              <Text style={styles.btnText}>REGISTRAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDel]} onPress={() => enviarComando('BORRAR')}>
              <Text style={styles.btnText}>ELIMINAR</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.row, { marginTop: 12 }]}>
            <TouchableOpacity style={[styles.btn, styles.btnStatus]} onPress={() => enviarComando('ESTADO')}>
              <Text style={styles.btnText}>VER ESTADO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnLog]} onPress={() => enviarComando('HISTORIAL')}>
              <Text style={styles.btnText}>HISTORIAL</Text>
            </TouchableOpacity>
          </View>

          {/* Botón extra para emergencias: Borrar configuración para desvincular */}
          <TouchableOpacity 
            style={{marginTop: 20, alignItems: 'center'}} 
            onPress={async () => {
              await AsyncStorage.clear();
              router.replace('/Setup');
            }}>
            <Text style={{color: '#E74C3C', fontFamily: 'LeagueSpartanBold', textDecorationLine: 'underline'}}>Desvincular Equipo</Text>
          </TouchableOpacity>
        </View>

        {/* HISTORIAL DE ACCIONES */}
        <View style={styles.logs}>
          <Text style={styles.label}>Actividad Reciente:</Text>
          
          {historial.map((item) => (
            <View key={item.id} style={styles.logItem}>
              <View style={{ flex: 1 }}> 
                {/* Mensaje del portón */}
                <Text style={styles.logText}>{item.texto || item.accion}</Text> 
                {/* Hora */}
                <Text style={styles.logTime}>{item.fecha}</Text>
              </View>
              <Text style={styles.statusBadge}>{item.status || "OK"}</Text>
            </View>
          ))}

          {/* Mensaje de lista vacía */}
          {historial.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 15, fontFamily: 'LeagueSpartan' }}>
              No hay actividad en esta sesión.
            </Text>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: 50, paddingHorizontal: 20 },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 26, color: '#1A1A1A', fontFamily: 'LeagueSpartanBold' },
  subtitle: { fontSize: 14, color: '#27AE60', marginTop: 2, fontFamily: 'LeagueSpartanBold' },
  
  form: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 15, elevation: 4 },
  label: { fontSize: 16, marginBottom: 15, color: '#333', fontFamily: 'LeagueSpartanBold' },
  input: { backgroundColor: '#F8F9FA', color: '#000000', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#EEE', fontFamily: 'LeagueSpartan' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btn: { padding: 14, borderRadius: 10, alignItems: 'center', flex: 1 },
  btnAdd: { backgroundColor: '#1D3557' }, // Usando el azul oscuro de tu diseño
  btnDel: { backgroundColor: '#E74C3C' }, // Rojo
  btnStatus: { backgroundColor: '#7F8C8D' }, // Gris
  btnLog: { backgroundColor: '#275AA4' }, // Azul claro de tu diseño
  btnText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'LeagueSpartanBold', letterSpacing: 1 },

  logs: { marginTop: 25, paddingBottom: 40 },
  logItem: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#275AA4' },
  logTime: { fontSize: 10, color: '#999', fontFamily: 'LeagueSpartan' },
  logText: { fontSize: 13, color: '#2C3E50', fontFamily: 'LeagueSpartanBold' },
  statusBadge: { fontSize: 9, color: '#27AE60', backgroundColor: '#D5F5E3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontFamily: 'LeagueSpartanBold' }
});