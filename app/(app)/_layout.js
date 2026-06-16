import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../AuthContext';
import { redirect } from 'expo-router';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D3557" />
      </View>
    );
  }

  if (!user) {
    redirect('/');
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="AddUser" />
      <Stack.Screen name="ManageUsers" />
      <Stack.Screen name="Setup" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});