// app/add-deck.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { addDeck } from '../src/services/database';
import PrimaryButton from '../src/components/PrimaryButton';
import { COLORS } from '../src/constants/colors';

export default function AddDeckScreen() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (title.trim().length === 0) {
      Alert.alert('Validation Error', 'Deck title cannot be empty.');
      return;
    }
    try {
      await addDeck(title.trim());
      router.back(); // Go back to the previous screen (the deck list)
    } catch (error) {
      console.error('Failed to save deck:', error);
      Alert.alert('Error', 'Could not save the deck. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Deck Title"
        value={title}
        onChangeText={setTitle}
        autoFocus={true}
      />
      <PrimaryButton title="Save Deck" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
});
