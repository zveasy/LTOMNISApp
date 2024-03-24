import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles from '../colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type WordWithIcon = {
  leftText: string;
  rightText: string;
  icon?: string;
};

type Props = {
  title: string;
  words: WordWithIcon[];
};

const SmallOfferDetailsVFour: React.FC<Props> = ({title, words}) => {
  const isGift = words.find(word => word.rightText === 'Gift');

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      {words.map((wordItem, index) => {
        const icon = wordItem.icon;

        // Check for "Payment Plan" and "Amount per month" and adjust based on isGift condition
        let rightWordText = wordItem.rightText;
        if (
          isGift &&
          (wordItem.leftText === 'Payment Plan' ||
            wordItem.leftText === 'Amount per month')
        ) {
          rightWordText = '-';
        }

        return (
          <View key={index}>
            <View style={styles.row}>
              <Text style={styles.leftWord}>{wordItem.leftText}</Text>
              <View style={styles.rightWordContainer}>
                <Text style={styles.rightWord}>{rightWordText}</Text>
                {icon && (
                  <MaterialCommunityIcons
                    name={icon}
                    size={14}
                    color={GlobalStyles.Colors.primary100}
                  />
                )}
              </View>
            </View>
            {index !== words.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    padding: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary100,
    marginBottom: 20,
  },
  leftWord: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary100,
  },
  rightWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWord: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary100,
    marginRight: 5,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    backgroundColor: 'grey',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SmallOfferDetailsVFour;
