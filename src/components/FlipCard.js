// src/components/FlipCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const FlipCard = ({ card, isFlipped, style }) => {
  const rotate = useSharedValue(isFlipped ? 1 : 0);

  // Update animation when isFlipped prop changes
  React.useEffect(() => {
    rotate.value = withTiming(isFlipped ? 1 : 0, { duration: 500 });
  }, [isFlipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
    };
  });

  return (
    <View style={style}>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.cardText}>{card.front}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardText}>{card.back}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    padding: 20,
  },
  cardFront: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    backgroundColor: COLORS.primary,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'black'
  },
});

export default FlipCard;
