import React, { useEffect } from 'react';
import { Slot, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { redirect } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'LeagueSpartan': require('../assets/fonts/LeagueSpartan.ttf'),
    'LeagueSpartanBold': require('../assets/fonts/LeagueSpartanBold.ttf'), 
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; 
  }

  if (fontError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error cargando las fuentes. Revisa la carpeta assets/fonts</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ presentation: 'modal' }} />
          <Stack.Screen name="Home" />
          <Stack.Screen name="AddUser" />
          <Stack.Screen name="ManageUsers" />
          <Stack.Screen name="Setup" />
        </Stack>
      </View>
    </AuthProvider>
  );
}

export default function Layout() {
  return <RootLayout />;
}