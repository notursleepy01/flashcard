// app/index.js
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { getDecks } from '../src/services/database';
import DeckListItem from '../src/components/DeckListItem';
import { COLORS } from '../src/constants/colors';
import { FontAwesome } from '@expo/vector-icons'; // For the + button icon

export default function DeckListScreen() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {decks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No decks found.</Text>
          <Text style={styles.emptySubText}>Tap the '+' button to create your first deck!</Text>
        </View>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // The `Link` component is Expo Router's way of navigating.
            // We will create the page for this link in the next step.
            <Link href={`/deck/${item.id}?title=${item.title}`} asChild>
              <TouchableOpacity>
                <DeckListItem deck={item} />
              </TouchableOpacity>
            </Link>
          )}
          contentContainerStyle={{ paddingTop: 8 }}
        />
      )}

      {/* This is the floating action button to add a new deck */}
      <Link href="/add-deck" asChild>
        <TouchableOpacity style={styles.fab}>
          <FontAwesome name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
