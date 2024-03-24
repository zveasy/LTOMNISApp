import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LinearProgress} from '@rneui/base';
import GlobalStyles from '../colors';

export default function PointsRow() {
  const [Points, setPoints] = useState(5500);

  return (
    <View style={styles.container}>
      <LinearProgress
        value={Points / 10000}
        variant="determinate"
        style={styles.progress}
        color={GlobalStyles.Colors.primary210}
      />

      <View style={styles.pointsRow}>
        {[100, 2500, 5000, 7500, 10000].map((point, index) => (
          <View key={index} style={styles.pointWrapper}>
            <View
              style={[
                styles.pointCircle,
                {
                  backgroundColor:
                    Points >= point
                      ? GlobalStyles.Colors.primary210
                      : GlobalStyles.Colors.primary200,
                },
              ]}>
              <MaterialCommunityIcons
                size={40} // Increased icon size
                color={
                  Points >= point
                    ? GlobalStyles.Colors.primary600
                    : GlobalStyles.Colors.primary210
                }
                name="star-four-points-outline"
              />
            </View>
            <Text style={styles.pointText}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 40,
  },
  progress: {
    width: '100%',
    height: 3,
    borderRadius: 30,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '105%',
    top: -20,
  },
  pointWrapper: {
    alignItems: 'center',
  },
  pointCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointText: {
    textAlign: 'center',
    fontFamily: 'Futura',
    fontSize: 15,
  },
});
