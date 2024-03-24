import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import RatingComponent from './RatingComponent';
import FeedbackComponent from './FeedbackComponent';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';

export default function AppFeedBack() {
  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title={'App Feedback'} />
      <Text style={styles.subText}>Share your experience with us</Text>
      <RatingComponent />
      <FeedbackComponent />
      <CompleteButton text="Submit" onPress={() => {}} />
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
