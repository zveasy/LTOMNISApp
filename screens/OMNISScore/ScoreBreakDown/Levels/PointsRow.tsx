import { View, Text } from 'react-native';
import React, { useState } from 'react';
import GlobalStyles from '../../../../assets/constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearProgress } from '@rneui/base';

export default function PointsRow() {
  const [Points, setPoints] = useState(5500);

  return (
    <View style={{ width: '90%', alignSelf: 'center', marginVertical: 40 }}>
      <LinearProgress
        value={Points / 10000}
        variant="determinate"
        style={{
          width: '100%',
          height: 3,
          borderRadius: 30,
        }}
        color={GlobalStyles.Colors.primary210}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
          width: '105%',
          top: -20,  // Adjusted for the bigger icon and text size
        }}>
        {[100, 2500, 5000, 7500, 10000].map((point, index) => (
          <View key={index}>
            <View
              style={{
                backgroundColor: Points >= point ? GlobalStyles.Colors.primary210 : GlobalStyles.Colors.primary205,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons
                size={25} // Increased icon size
                color={Points >= point ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary600}
                name="star-four-points-outline"
              />
            </View>
            <Text
              style={{
                textAlign: 'center', // Centered text
                fontFamily: 'Futura',
                fontSize: 12,
                color: GlobalStyles.Colors.primary100
              }}
            >
              {point}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
