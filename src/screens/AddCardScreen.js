// src/screens/AddCardScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { addCardToDeck } from '../services/database';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';

export default function AddCardScreen({ route, navigation }) {
  const { deckId } = route.params;
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSave = async () => {
    if (front.trim().length === 0 || back.trim().length === 0) {
      Alert.alert('Validation Error', 'Both front and back content are required.');
      return;
    }
    try {
      await addCardToDeck(deckId, front.trim(), back.trim());
      navigation.goBack();
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
      <View>
        <TextInput
          style={styles.input}
          placeholder="Front of card (e.g., a question)"
          value={front}
          onChangeText={setFront}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Back of card (e.g., the answer)"
          value={back}
          onChangeText={setBack}
          multiline
        />
      </View>
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
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
});
