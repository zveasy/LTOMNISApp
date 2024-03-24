// ListItemWithRadial.tsx

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Divider} from 'react-native-elements';
import GlobalStyles from '../colors';
import RadialComponent from './RadialComponent';

export type ListItemProps = {
  radialType: 'radio' | 'icon' | 'image';
  iconName?: string;
  imagePath?: string;
  topTextLeft: string;
  topTextRight: string;
  bottomTextLeft: string;
  bottomTextRight: string;
  topTextRightStyle?: object;
};

const ListItemWithRadial: React.FC<ListItemProps> = ({
  radialType,
  iconName,
  imagePath,
  topTextLeft,
  topTextRight,
  bottomTextLeft,
  bottomTextRight,
  topTextRightStyle,
}) => {
  const determineTopTextColor = (text: string) => {
    if (text.startsWith('+')) {
      return 'green';
    }
    if (text.startsWith('-')) {
      return 'red';
    }
    return 'black'; // default color if no + or - is found
  };

  const determineBottomTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return GlobalStyles.Colors.accent300;
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'black'; // default color for unknown status
    }
  };

  const formatCurrency = (value: string) => {
    const hasSign = ['+', '-'].includes(value[0]);
    const sign = hasSign ? value[0] : '';
    const amountValue = value.replace(/[+$-]/g, '').trim(); // remove signs and dollar sign if they exist
    const amount = parseFloat(amountValue);

    if (isNaN(amount)) {
      console.error(`Invalid currency value: ${value}`);
      return value; // Or return a default value
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);

    return `${sign}${formattedAmount}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RadialComponent
          type={radialType}
          iconName={iconName}
          imagePath={imagePath}
        />
        <View style={styles.textContainer}>
          <View style={styles.textRow}>
            <Text
              style={{
                color: GlobalStyles.Colors.primary500,
                fontWeight: '500',
              }}>
              {topTextLeft}
            </Text>
            <Text
              style={[
                {color: determineTopTextColor(topTextRight)},
                topTextRightStyle,
              ]}>
              {formatCurrency(topTextRight)}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={{color: determineBottomTextColor(bottomTextLeft)}}>
              {bottomTextLeft}
            </Text>
            <Text style={{color: GlobalStyles.Colors.accent300}}>
              {bottomTextRight}
            </Text>
          </View>
        </View>
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  divider: {
    color: 'rgba(	46,	34,	22, 0.06',
    height: 1,
    marginBottom: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    width: '80%', // Adjust this width as per your layout needs
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // For spacing between the rows
  },
});

export default ListItemWithRadial;
