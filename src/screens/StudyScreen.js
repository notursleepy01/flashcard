// src/screens/StudyScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getCardsForDeck, logStudySession } from '../services/database';
import { shuffleArray } from '../utils/helpers';
import FlipCard from '../components/FlipCard';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';
import { ActivityIndicator } from 'react-native';

export default function StudyScreen({ route, navigation }) {
  const { deckId } = route.params;
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

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false); // Flip back to front for the next card
    } else {
      const finalScore = ((correctAnswers + (isCorrect ? 1 : 0)) / cards.length) * 100;
      logStudySession(deckId, finalScore);
      setSessionOver(true);
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" color={COLORS.primary} />;
  }
  
  const score = ((correctAnswers / cards.length) * 100).toFixed(0);

  if (sessionOver) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.scoreText}>Your score: {score}%</Text>
        <PrimaryButton title="Back to Deck" onPress={() => navigation.goBack()} />
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
        <PrimaryButton title="Flip to Answer" onPress={handleFlip} color={COLORS.accent} />
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
