// app/study.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCardsForDeck, logStudySession } from '../src/services/database';
import { shuffleArray } from '../src/utils/helpers';
import FlipCard from '../src/components/FlipCard';
import PrimaryButton from '../src/components/PrimaryButton';
import { COLORS } from '../src/constants/colors';

export default function StudyScreen() {
  const { deckId } = useLocalSearchParams();
  const router = useRouter();

  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionOver, setSessionOver] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const fetchedCards = await getCardsForDeck(deckId);
        setCards(shuffleArray(fetchedCards));
      } catch (error) {
        Alert.alert("Error", "Could not load cards.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCards();
  }, [deckId]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    const isLastCard = currentCardIndex === cards.length - 1;
    if (isLastCard) {
      const finalCorrect = correctAnswers + (isCorrect ? 1 : 0);
      const finalScore = (finalCorrect / cards.length) * 100;
      logStudySession(deckId, finalScore);
      setSessionOver(true);
    } else {
      setIsFlipped(false);
      // Use a tiny timeout to let the card flip back before changing content
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
      }, 250);
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" color={COLORS.primary} />;
  }

  if (sessionOver) {
    const finalScore = ((correctAnswers) / cards.length) * 100;
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.scoreText}>Your score: {finalScore.toFixed(0)}%</Text>
        <PrimaryButton title="Back to Deck" onPress={() => router.back()} />
      </View>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{currentCardIndex + 1} / {cards.length}</Text>
      <TouchableOpacity onPress={handleFlip} activeOpacity={1} style={styles.cardContainer}>
        <FlipCard card={currentCard} isFlipped={isFlipped} />
      </TouchableOpacity>

      {!isFlipped ? (
        <PrimaryButton title="Show Answer" onPress={handleFlip} color={COLORS.accent} />
      ) : (
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Incorrect" onPress={() => handleAnswer(false)} color={COLORS.danger} style={styles.answerButton} />
          <PrimaryButton title="Correct" onPress={() => handleAnswer(true)} color={COLORS.success} style={styles.answerButton} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 10,
    fontWeight: '600'
  },
  cardContainer: {
    flex: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  answerButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
});
