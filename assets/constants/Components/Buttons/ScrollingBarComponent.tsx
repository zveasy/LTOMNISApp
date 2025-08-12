import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import GlobalStyles from '../../colors';

interface ScrollingBarComponentProps {
  scrollPosition: Animated.Value;
  totalWidth: number;
  flatListWidth: number;
  highlightedWidth: number;
}

const ScrollingBarComponent: React.FC<ScrollingBarComponentProps> = ({
  scrollPosition,
  totalWidth,
  flatListWidth,
  highlightedWidth,
}) => {
  const maxTranslateX = Math.max(totalWidth - flatListWidth, 1);
  const translateX = scrollPosition.interpolate({
    inputRange: [0, maxTranslateX],
    outputRange: [0, 300 - highlightedWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View
          style={[styles.barHighlight, { width: highlightedWidth, transform: [{ translateX }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barBackground: {
    height: 2,
    width: 300,
    backgroundColor: 'rgba(256,256,256,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  barHighlight: {
    height: 2,
    backgroundColor: GlobalStyles.Colors.primary210,
    borderRadius: 1,
  },
});

export default ScrollingBarComponent;
