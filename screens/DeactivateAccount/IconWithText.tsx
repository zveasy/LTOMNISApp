// Filename: IconWithText.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // Importing Feather icons
import GlobalStyles from '../../assets/constants/colors';

interface IconWithTextProps {
  text: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Feather name="x-circle" size={24} color="red" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    marginLeft: 40, // Adding space between the icon and the text
    color: GlobalStyles.Colors.primary100
  },
});

export default IconWithText;
