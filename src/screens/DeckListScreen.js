// src/screens/DeckListScreen.js
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDecks } from '../services/database';
import DeckListItem from '../components/DeckListItem';
import { COLORS } from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton';

export default function DeckListScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add "Add" button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PrimaryButton
          title="Add"
          onPress={() => navigation.navigate('AddDeck')}
          style={{ marginRight: 10, paddingVertical: 5, paddingHorizontal: 15 }}
        />
      ),
    });
  }, [navigation]);

  // Fetch decks every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchDecks = async () => {
        try {
          setIsLoading(true);
          const fetchedDecks = await getDecks();
          if (isActive) {
            setDecks(fetchedDecks);
          }
        } catch (error) {
          console.error('Failed to fetch decks:', error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };
      fetchDecks();
      return () => { isActive = false; };
    }, [])
  );

  if (isLoading) {
    return <View style={styles.container} />; // Or a loading spinner
  }
  
  if (decks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No decks found.</Text>
        <Text style={styles.emptySubText}>Tap 'Add' to create your first deck!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DeckListItem
            deck={item}
            onPress={() => navigation.navigate('DeckDetail', {
              deckId: item.id,
              deckTitle: item.title,
            })}
          />
        )}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
  }
});
