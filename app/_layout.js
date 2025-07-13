// app/_layout.js
import { Stack } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <Stack
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
      <Stack.Screen name="index" options={{ title: 'Flashcard Decks' }} />
      <Stack.Screen name="add-deck" options={{ title: 'Create New Deck', presentation: 'modal' }} />
      <Stack.Screen name="deck/[deckId]" options={{ title: 'Deck Details' }} />
      <Stack.Screen name="add-card" options={{ title: 'Add New Card', presentation: 'modal' }} />
      <Stack.Screen name="study" options={{ title: 'Study Session' }} />
      <Stack.Screen name="stats" options={{ title: 'Deck Statistics' }} />
    </Stack>
  );
}
