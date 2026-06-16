import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}