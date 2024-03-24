// Dots.js
import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

const Dots = ({ numberOfDots }: { numberOfDots: number }) => {
  const [activeDot, setActiveDot] = useState(0);

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < numberOfDots; i++) {
      dots.push(
        <Pressable key={i} onPress={() => setActiveDot(i)}>
          <View
            style={[
              styles.dot,
              { backgroundColor: activeDot === i ? 'blue' : 'white' },
            ]}
          />
        </Pressable>,
      );
    }
    return dots;
  };

  return <View style={styles.dotsContainer}>{renderDots()}</View>;
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
});

export default Dots;
