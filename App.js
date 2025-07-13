// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { Slot } from 'expo-router';
import { initDB } from './src/services/database';
import { COLORS } from './src/constants/colors';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDB()
      .then(() => {
        setDbInitialized(true);
        console.log('Database initialized successfully');
      })
      .catch(err => {
        console.error('Database initialization failed', err);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Slot will render the current active screen from the app/ directory
  return (
      <>
        <StatusBar barStyle="dark-content" />
        <Slot />
      </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
});
