import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import GlobalStyles from '../../assets/constants/colors';

export default function RatingComponent() {
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate your Experience</Text>
      <View style={{ width: '100%', alignItems: 'center' }} >
        <StarRating
          maxStars={5}
          rating={selectedRating}
          onChange={(rating: number) => setSelectedRating(rating)}
          starSize={44}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 16,
    width: '90%',
  },
  title: {
    fontSize: 16,
    color: GlobalStyles.Colors.accent100,
    marginBottom: 10,
  },
});
