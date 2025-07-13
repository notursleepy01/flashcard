// app/stats.js
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { getDeckStats } from '../src/services/database';
import { COLORS } from '../src/constants/colors';

export default function StatsScreen() {
  const { deckId, deckTitle } = useLocalSearchParams();
  const navigation = useNavigation();

  const [accuracy, setAccuracy] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set the header title dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ title: `${deckTitle} Stats` });
  }, [navigation, deckTitle]);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          setIsLoading(true);
          const [fetchedHistory, fetchedAccuracy] = await getDeckStats(deckId);
          setHistory(fetchedHistory);
          setAccuracy(fetchedAccuracy);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStats();
    }, [deckId])
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>
        {new Date(item.sessionDate).toLocaleString()}
      </Text>
      <Text style={[styles.historyScore, { color: item.score >= 70 ? COLORS.success : COLORS.danger }]}>
        {item.score.toFixed(0)}%
      </Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" color={COLORS.primary} />;
  }

  if (history.length === 0) {
    return (
        <View style={styles.centered}>
            <Text style={styles.emptyText}>No study history found.</Text>
            <Text style={styles.emptySubText}>Complete a study session to see your stats here.</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.accuracyContainer}>
        <Text style={styles.accuracyLabel}>Average Accuracy</Text>
        <Text style={styles.accuracyValue}>{accuracy.toFixed(0)}%</Text>
      </View>
      <Text style={styles.historyTitle}>Review History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
      />
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
    padding: 20,
  },
  accuracyContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  accuracyLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  accuracyValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  historyScore: {
    fontSize: 16,
    fontWeight: 'bold',
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
  }
});
