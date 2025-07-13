// app/deck/[deckId].js
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter, Link } from 'expo-router';
import { getCardsForDeck, deleteDeck } from '../../src/services/database';
import PrimaryButton from '../../src/components/PrimaryButton';
import { COLORS } from '../../src/constants/colors';

export default function DeckDetailScreen() {
  const { deckId, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [cardCount, setCardCount] = useState(0);

  // Set the header title dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation, title]);

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
      `Are you sure you want to delete the "${title}" deck and all its cards? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeck(deckId);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.cardCount}>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</Text>
      </View>
      <View style={styles.actions}>
        <Link href={{ pathname: '/add-card', params: { deckId: deckId } }} asChild>
          <PrimaryButton title="Add Card" />
        </Link>

        <Link href={{ pathname: '/study', params: { deckId: deckId } }} asChild>
          <PrimaryButton
            title="Start Study Session"
            onPress={(e) => {
              if (cardCount === 0) {
                e.preventDefault(); // Prevent navigation
                Alert.alert('No Cards', 'Add some cards to this deck before you can study!');
              }
            }}
            color={COLORS.accent}
          />
        </Link>
         <Link href={{ pathname: '/stats', params: { deckId: deckId, deckTitle: title } }} asChild>
          <PrimaryButton title="View Stats" color={COLORS.darkGray} />
        </Link>
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
    marginTop: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
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
    borderTopWidth: 1,
    borderTopColor: COLORS.mediumGray,
    paddingTop: 10,
  }
});
