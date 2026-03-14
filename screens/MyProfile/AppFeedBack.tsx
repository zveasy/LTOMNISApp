import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import RatingComponent from './RatingComponent';
import FeedbackComponent from './FeedbackComponent';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export default function AppFeedBack() {
  const navigation = useNavigation();
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/api/omnis/user/feedback', {
        feedback: feedbackText,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    Alert.alert('Thank you', 'Your feedback has been submitted');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title={'App Feedback'} />
      <Text style={styles.subText}>Share your experience with us</Text>
      <RatingComponent />
      <FeedbackComponent onFeedbackChange={setFeedbackText} />
      <CompleteButton text="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  subText: {
    fontSize: 13,
    color: GlobalStyles.Colors.accent100,
  },
});
