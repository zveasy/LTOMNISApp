import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../../assets/constants/colors';

type StatisticItemProps = {
  value?: string;
  label: string;
  lottieSource?: any;  // Adjust the type if necessary.
};

const StatisticItem: React.FC<StatisticItemProps> = ({ value, label, lottieSource }) => (
  <View style={styles.container}>
    {lottieSource ? (
      <LottieView
        source={lottieSource}
        autoPlay
        loop
        style={[styles.lottieStyle, (label === 'Status') ? styles.lottieMarginTop : null]}
      />
    ) : (
      <Text style={[styles.value, (label === 'Status') ? styles.valueMarginBottom : styles.valueMarginTop]}>{value}</Text>
    )}
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary100
  },
  valueMarginTop: {
    marginTop: 30,
  },
  valueMarginBottom: {
    marginBottom: 0,
  },
  label: {
    marginTop: 10,
    color: GlobalStyles.Colors.accent100,
    fontSize: 16,
  },
  lottieStyle: {
    width: 50,
    height: 50,
  },
  lottieMarginTop: {
    marginTop: 10, // Adjust this value as needed
  },
});

export default StatisticItem;
