import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

// Mantiene la pantalla de carga visible mientras cargan las fuentes
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    'LeagueSpartan': require('../assets/fonts/LeagueSpartan.ttf'),
    'LeagueSpartanBold': require('../assets/fonts/LeagueSpartanBold.ttf'), 
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Oculta la pantalla de carga cuando las fuentes estén listas (o si hay error)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Si no han cargado y no hay error, sigue esperando
  if (!fontsLoaded && !fontError) {
    return null; 
  }

  // Si hay un error con la ruta de la fuente, muestra este mensaje en vez de pantalla negra
  if (fontError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error cargando las fuentes. Revisa la carpeta assets/fonts</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});