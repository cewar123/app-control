import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import backgroundImage from '../assets/background-image.jpg';
import LongInput from '../components/longInput.js';

export default function Login() {
  const router = useRouter();

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
          <LongInput type="email-address" security={false} text="CORREO" />
          <LongInput type="default" security={true} text="CONTRASEÑA" />
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => router.replace('/Home')}>
            <Text style={styles.textStyle}>INICIAR SESIÓN</Text>
          </TouchableOpacity>

          <Pressable style={({pressed}) => [{opacity: pressed ? 0.7 : 1}, styles.forgetButton]}>
            <Text style={styles.textButton}>OLVIDÉ MIS DATOS</Text>
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

  paragraphContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },

  sentenceStyle: {
    fontFamily: 'LeagueSpartanBold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: -8, // CORREGIDO AQUÍ
  },

  formContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35, // CORREGIDO AQUÍ
    zIndex: 4,
  },

  inputsContainer: {
    paddingTop: 30, // CORREGIDO AQUÍ
    paddingBottom: 50, // CORREGIDO AQUÍ
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
  }
});