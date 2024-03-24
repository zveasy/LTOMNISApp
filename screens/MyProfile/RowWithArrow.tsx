import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';

interface RowWithArrowProps {
  title: string;
}

const RowWithArrow: React.FC<RowWithArrowProps> = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Icon
        name="chevron-forward"
        type="ionicon"
        color={GlobalStyles.Colors.primary200}
        size={24} // Adjust size as needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    width: '98%',
    paddingHorizontal: 16, // Adjust as needed
  },
  title: {
    fontSize: 18,
    fontWeight: '600', // Semibold
    color: 'white',
  },
});

export default RowWithArrow;
