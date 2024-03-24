import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import GlobalStyles from '../../assets/constants/colors';

export default function FeedbackComponent() {
  const [feedback, setFeedback] = useState(''); // Holds the user's input

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We have been working hard on our app, so your feedback is important to us.</Text>
      <TextInput 
        style={styles.textbox} 
        multiline={true} 
        numberOfLines={10} 
        placeholder="Tell us how we can improve..."
        placeholderTextColor={GlobalStyles.Colors.accent100}
        onChangeText={text => setFeedback(text)}
        value={feedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.accent100,
    marginBottom: 10,
  },
  textbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: GlobalStyles.Colors.primary100,
    padding: 10,
    borderRadius: 16,
    textAlignVertical: 'top', // Makes text start from the top of the textbox
    height: 200, // Adjust as necessary
  },
});
