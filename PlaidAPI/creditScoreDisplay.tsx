import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Define the type for the route prop
 type CreditScoreDisplayRouteProp = RouteProp<RootStackParamList, 'CreditScoreDisplay'>;

interface CreditScoreDisplayProps {
  route: CreditScoreDisplayRouteProp;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = ({ route }) => {
  const { score } = route.params;
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
