import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles from '../colors';

type RowProps = {
  leftText: string | number; // Updated type here
  rightText: string | number; // Updated type here
};

const Row: React.FC<RowProps> = ({leftText, rightText}) => (
  <View style={styles.row}>
    <Text style={styles.leftText}>{leftText.toString()}</Text>
    <Text style={styles.rightText}>{rightText.toString()}</Text> 
  </View>
);

type RowData = {
  leftText: string | number; // Updated type here
  rightText: string | number; // Updated type here
};

type DividerData = {
  isDivider: true;
};

type CustomOfferBlockProps = {
  data: Array<RowData | DividerData>;
};

const CustomOfferBlock: React.FC<CustomOfferBlockProps> = ({data}) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        if ('isDivider' in item) {
          return <View key={index} style={styles.divider} />;
        }
        return (
          <Row
            key={index}
            leftText={item.leftText}
            rightText={item.rightText}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: '90%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    padding: 20, // This is to prevent words touching the sides
    justifyContent: 'space-around', // This brings the rows closer together
    marginVertical: 10,
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    fontSize: 14,
    color: GlobalStyles.Colors.accent300,
    fontFamily: 'San Francisco',
  },
  rightText: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary510,
    fontFamily: 'San Francisco',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(46, 34, 22, 0.06)', // or another color you want
    marginVertical: 5, // add space around the divider
  },
});

export default CustomOfferBlock;
