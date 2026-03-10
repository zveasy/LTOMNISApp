import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LenderScoreBreakDown from './ScoreBreakDown/Lender/LenderScoreBreakDown';
import BorrowerScoreBreakdown from './ScoreBreakDown/Borrower/BorrowerScoreBreakdown';
import GlobalStyles from '../../assets/constants/colors';

const Tab = createMaterialTopTabNavigator();

export default function OMNISScoreTabs() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
          tabBarIndicatorStyle: {
            backgroundColor: GlobalStyles.Colors.primary200,
            height: 2,
            alignSelf: 'center',
          },
        }}>
        <Tab.Screen
          options={{ title: 'Lender' }}
          name="LenderScoreBreakDown"
          component={LenderScoreBreakDown}
        />
        <Tab.Screen
          options={{ title: 'Borrower' }}
          name="BorrowerScoreBreakdown"
          component={BorrowerScoreBreakdown}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
});
