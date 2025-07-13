// app/add-card.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addCardToDeck } from '../src/services/database';
import PrimaryButton from '../src/components/PrimaryButton';
import { COLORS } from '../src/constants/colors';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (front.trim().length === 0 || back.trim().length === 0) {
      Alert.alert('Validation Error', 'Both front and back content are required.');
      return;
    }
    try {
      await addCardToDeck(deckId, front.trim(), back.trim());
      router.back();
    } catch (error) {
      console.error('Failed to save card:', error);
      Alert.alert('Error', 'Could not save the card. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.label}>Front of Card</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., What is React Native?"
          value={front}
          onChangeText={setFront}
          multiline
        />
        <Text style={styles.label}>Back of Card</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., A framework for building native apps."
          value={back}
          onChangeText={setBack}
          multiline
        />
      </ScrollView>
      <PrimaryButton title="Save Card" onPress={handleSave} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
});
