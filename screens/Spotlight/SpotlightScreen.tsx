import {View, Text} from 'react-native';
import React from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {StyleSheet} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {SafeAreaView} from 'react-native';
import SpotlightNavOne from '../../assets/constants/Components/SpotlightNavOne';

export default function SpotlightScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Spotlight" />
      <View
        style={{
          height: '100%',
          width: '100%',}}>
        <SpotlightNavOne />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
});
