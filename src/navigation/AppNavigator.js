// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/colors';

// Import Screens
import DeckListScreen from '../screens/DeckListScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import AddDeckScreen from '../screens/AddDeckScreen';
import AddCardScreen from '../screens/AddCardScreen';
import StudyScreen from '../screens/StudyScreen';
import StatsScreen from '../screens/StatsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="DeckList"
        component={DeckListScreen}
        options={{ title: 'Flashcard Decks' }}
      />
      <Stack.Screen
        name="DeckDetail"
        component={DeckDetailScreen}
        options={({ route }) => ({ title: route.params.deckTitle })}
      />
      <Stack.Screen
        name="AddDeck"
        component={AddDeckScreen}
        options={{ title: 'Create New Deck' }}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={{ title: 'Add New Card' }}
      />
      <Stack.Screen
        name="Study"
        component={StudyScreen}
        options={{ title: 'Study Session' }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Deck Statistics' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
