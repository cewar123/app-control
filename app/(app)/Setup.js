import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  NativeModules, PermissionsAndroid, Alert, Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { sendSMS } from '../../utils/sms';

export default function Setup() {
  const [numPorton, setNumPorton] = useState('');
  const [pinActual, setPinActual] = useState('');
  const [nuevoPin, setNuevoPin] = useState('');
  
  const router = useRouter();

  const guardarYVincular = async () => {
    if (Platform.OS !== 'android') return;

    // Validación de campos obligatorios
    if (!numPorton || !pinActual) {
      Alert.alert("Faltan Datos", "Debes ingresar el número del equipo y el PIN actual.");
      return;
    }

    // 1. Armamos el comando SMS dependiendo de si el usuario quiere cambiar el PIN
    let mensajeSMS = '';

    if (nuevoPin !== '') {
      
      mensajeSMS = `CAMBIAR ${pinActual} ${nuevoPin}`; 
    } else {
      
      mensajeSMS = `CLAVE ${pinActual}`;
    }

    try {
      const result = await sendSMS(numPorton, mensajeSMS);
      
      // 2. LÓGICA DEL NUEVO PIN:
      // Si el usuario escribió un PIN nuevo, guardamos ese en la app.
      // Si lo dejó vacío, guardamos el PIN actual de fábrica.
      const pinParaGuardar = nuevoPin !== '' ? nuevoPin : pinActual;

      await AsyncStorage.setItem('@pin_porton', pinParaGuardar);
      await AsyncStorage.setItem('@num_porton', numPorton);
      
      let mensaje = "¡Equipo Vinculado! Se guardó la configuración correctamente.";
      if (result.method === 'intent') {
        mensaje += "\n\nSe abrió la app de SMS. Toca 'Enviar' para completar la vinculación.";
      }
      
      Alert.alert("¡Equipo Vinculado!", mensaje);
      router.replace('/Home');
    } catch (err) {
      Alert.alert("Error Crítico", err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      
      {/* SECCIÓN SUPERIOR DE DISEÑO */}
      <View style={styles.imgColorDiv}>
        <View style={styles.textContainer}>
          <Text style={styles.titleStyle}>VINCULAR EQUIPO</Text>
          <Text style={styles.subtitleStyle}>Configuración inicial del sistema</Text>
        </View>
        <View style={styles.blueShape} />
      </View>

      {/* FORMULARIO */}
      <View style={styles.formContainer}>
        <Text style={styles.instructions}>
          Ingresa los datos de la línea del portón. Si deseas mantener el PIN de fábrica, deja el tercer campo en blanco.
        </Text>

        <Text style={styles.label}>NÚMERO DEL PORTÓN *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 04121234567"
          placeholderTextColor="#999"
          value={numPorton}
          onChangeText={setNumPorton}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>PIN ACTUAL (Fábrica) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 0000"
          placeholderTextColor="#999"
          value={pinActual}
          onChangeText={setPinActual}
          keyboardType="numeric"
          secureTextEntry={true}
        />

        <Text style={styles.label}>NUEVO PIN (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 1234"
          placeholderTextColor="#999"
          value={nuevoPin}
          onChangeText={setNuevoPin}
          keyboardType="numeric"
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.buttonStyle} onPress={guardarYVincular}>
          <Text style={styles.textStyle}>GUARDAR Y VINCULAR</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imgColorDiv: { backgroundColor: '#275AA4', height: 230, justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  textContainer: { alignItems: 'center', zIndex: 3, paddingTop: 40 },
  titleStyle: { fontFamily: 'LeagueSpartanBold', color: '#fff', fontSize: 36, textAlign: 'center' },
  subtitleStyle: { fontFamily: 'LeagueSpartan', color: '#E0E0E0', fontSize: 16, marginTop: 5 },
  blueShape: { position: 'absolute', bottom: -50, height: 100, width: '120%', backgroundColor: '#1D3557', transform: [{ translateX: -10 }, { rotate: '-5deg' }], zIndex: 1 },
  
  formContainer: { paddingHorizontal: 35, paddingTop: 30, flex: 1 },
  instructions: { fontFamily: 'LeagueSpartan', fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center', lineHeight: 20 },
  label: { fontFamily: 'LeagueSpartanBold', fontSize: 13, color: '#1D3557', marginBottom: 6, marginLeft: 5 },
  
  input: { backgroundColor: '#F4F6F8', color: '#000', height: 50, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E1E5EB', fontFamily: 'LeagueSpartan' },
  
  buttonStyle: { backgroundColor: '#1D3557', height: 55, width: "100%", justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10, elevation: 3 },
  textStyle: { fontFamily: 'LeagueSpartanBold', fontSize: 18, color: '#fff', letterSpacing: 1 }
});