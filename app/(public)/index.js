import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, Alert, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

import backgroundImage from '../../assets/background-image.jpg';
import LongInput from '../../components/longInput.js';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ scheme: 'my-app' }),
    scopes: ['profile', 'email'],
  }, { useProxy: true });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      handleGoogleSignIn(credential);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace('/Home');
    } catch (error) {
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') message = 'Usuario no encontrado';
      else if (error.code === 'auth/wrong-password') message = 'Contraseña incorrecta';
      else if (error.code === 'auth/email-already-in-use') message = 'El email ya está registrado';
      else if (error.code === 'auth/weak-password') message = 'Contraseña muy débil (mín 6 caracteres)';
      else if (error.code === 'auth/invalid-email') message = 'Email inválido';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (credential) => {
    setLoading(true);
    try {
      await signInWithCredential(auth, credential);
      router.replace('/Home');
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión con Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Error', 'Configuración de Google incompleta');
      return;
    }
    await promptAsync();
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.imgColorDiv}>
        <Image source={backgroundImage} style={styles.backImg} />
        <View style={styles.textContainer}>
          <Text style={styles.nameStyle}>NOMBRE DE LA APP</Text>
        </View>
        <View style={styles.blueShape} />
        <View style={styles.whiteShape1} />
        <View style={styles.whiteShape2} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputsContainer}>
          <LongInput 
            type="email-address" 
            security={false} 
            text="CORREO"
            value={email}
            onChangeText={setEmail}
          />

          <LongInput 
            type="default" 
            security={true} 
            text="CONTRASEÑA"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={styles.textStyle}>{isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleLogin} 
            disabled={loading}
          >
            <Image 
              source={{ uri: 'https://www.svgrepo.com/show/475656/google-color.svg' }} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <Pressable style={({pressed}) => [{opacity: pressed ? 0.7 : 1}, styles.forgetButton]}>
            <Text style={styles.textButton}>OLVIDÉ MIS DATOS</Text>
          </Pressable>

          <Pressable 
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },

  imgColorDiv: {
    backgroundColor: '#275AA4',
    height: 380,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  backImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },

  textContainer: {
    alignItems: 'center',
    zIndex: 3,
  },

  nameStyle: {
    fontFamily: 'LeagueSpartanBold',
    color: '#fff',
    fontSize: 40,
    textAlign: 'center',
  },

  blueShape: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 350,
    height: 150,
    backgroundColor: '#1D3557',
    transform: [{ rotate: '-10deg' }],
    zIndex: 1,
  },

  whiteShape1: {
    position: 'absolute',
    top: 250,
    left: -40,
    width: 250,
    height: 250,
    backgroundColor: '#fff',
    transform: [{ rotate: '28deg' }],
    zIndex: 2,
  },

  whiteShape2: {
    position: 'absolute',
    top: 275,
    left: -69,
    width: 350,
    height: 350,
    backgroundColor: '#fff',
    transform: [{ rotate: '56deg' }],
    zIndex: 2,
  },

  formContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    zIndex: 4,
  },

  inputsContainer: {
    paddingTop: 30,
    paddingBottom: 50,
  },

  buttonsContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },

  forgetButton: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: 'center',
  },

  buttonStyle: {
    backgroundColor: '#1D3557',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  googleButton: {
    backgroundColor: '#fff',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    gap: 10,
  },

  googleIcon: {
    width: 24,
    height: 24,
  },

  googleButtonText: {
    fontFamily: 'LeagueSpartanBold',
    fontSize: 16,
    color: '#1D3557',
  },

  textStyle: {
    fontFamily: 'LeagueSpartanBold',
    fontSize: 20,
    color: '#fff',
  },

  textButton: {
    fontFamily: 'LeagueSpartanBold',
    fontSize: 16,
    color: '#808080',
    marginTop: 10,
  },

  toggleButton: {
    alignItems: 'center',
    marginTop: 10,
  },

  toggleButtonText: {
    fontFamily: 'LeagueSpartan',
    fontSize: 14,
    color: '#1D3557',
  }
});