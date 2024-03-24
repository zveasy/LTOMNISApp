import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles from '../colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type WordWithIcon = {
  text: string;
  icon?: string;
};

type Props = {
  title: string;
  rightWords?: WordWithIcon[];
};

const DEFAULT_RIGHT_WORDS: WordWithIcon[] = [
  {text: '#235446577542', icon: 'checkbox-multiple-blank-outline'},
  {text: 'Zak Veasy'},
  {text: '3%'},
  {text: '05.26.2025'},
  {text: '$1000'},
  {text: '6%APR, 6 months'},
  {text: '$171.23'},
  // ... Add other default values as needed
];

const LEFT_WORDS = [
  'Offer Number',
  'Sent from',
  'Amount Offered',
  'Interest rate',
  'Due date',
  'Payment Plan',
  'Amount per month',
  // ... Add other left words as needed
];

const SmallOfferDetailsVTwo: React.FC<Props> = ({
    title,
    rightWords = DEFAULT_RIGHT_WORDS,
  }) => {
    const isGift = rightWords.find((word) => word.text === "Gift");
  
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        {LEFT_WORDS.map((leftWord, index) => {
          const icon = rightWords[index]?.icon;
          let rightWordText = rightWords[index]?.text;
  
          // Check for "Payment Plan" and "Amount per month" and adjust based on isGift condition
          if (isGift && (leftWord === "Payment Plan" || leftWord === "Amount per month")) {
            rightWordText = "-";
          }
  
          return (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.leftWord}>{leftWord}</Text>
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
              {index !== LEFT_WORDS.length - 1 && <View style={styles.divider} />}
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

export default SmallOfferDetailsVTwo;
