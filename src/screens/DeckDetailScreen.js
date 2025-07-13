// src/screens/DeckDetailScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCardsForDeck, deleteDeck } from '../services/database';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';

export default function DeckDetailScreen({ route, navigation }) {
  const { deckId, deckTitle } = route.params;
  const [cardCount, setCardCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchCardCount = async () => {
        const cards = await getCardsForDeck(deckId);
        setCardCount(cards.length);
      };
      fetchCardCount();
    }, [deckId])
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete the "${deckTitle}" deck and all its cards? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeck(deckId);
            navigation.goBack();
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{deckTitle}</Text>
        <Text style={styles.cardCount}>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          title="Add Card"
          onPress={() => navigation.navigate('AddCard', { deckId })}
        />
        <PrimaryButton
          title="Start Study Session"
          onPress={() => {
            if (cardCount > 0) {
              navigation.navigate('Study', { deckId });
            } else {
              Alert.alert('No Cards', 'Add some cards to this deck before you can study!');
            }
          }}
          color={COLORS.accent}
          disabled={cardCount === 0}
        />
         <PrimaryButton
          title="View Stats"
          onPress={() => navigation.navigate('Stats', { deckId, deckTitle })}
          color={COLORS.darkGray}
        />
        <View style={styles.deleteZone}>
          <PrimaryButton
            title="Delete Deck"
            onPress={handleDelete}
            color={COLORS.danger}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginTop: 8,
  },
  actions: {
    padding: 20,
  },
  deleteZone: {
    marginTop: 40,
  }
});
