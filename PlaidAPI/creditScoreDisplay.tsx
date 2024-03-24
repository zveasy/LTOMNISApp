import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CreditScoreDisplayProps {
  score: number; // Assuming the credit score is passed as a number
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = ({ score }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Credit Score</Text>
      <Text style={styles.score}>{score}</Text>
      {/* Additional UI elements can go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Style for the container
  },
  title: {
    // Style for the title text
  },
  score: {
    // Style for the score display
  }
});

export default CreditScoreDisplay;
