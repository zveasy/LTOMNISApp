import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../../assets/constants/colors';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import TransactionHistory from '../../../../assets/constants/Components/CustomTransactionButton';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import SmallOfferDetailsVTwo from '../../../../assets/constants/Components/SmallOfferDetailsVTwo';
import {t} from 'i18next'

type NewOfferDetailsProps = {
  initialRaiseNumber?: number;
  initialFullNumber?: number;
};

type WordWithIcon = {
  text: string;
  icon?: string;
};

export default function ActiveOfferMakePayment({
  initialRaiseNumber = 40,
  initialFullNumber = 100,
}: NewOfferDetailsProps) {
  const [raiseNumber, setRaiseNumber] = React.useState(initialRaiseNumber);
  const [fullNumber, setFullNumber] = React.useState(initialFullNumber);

  const hasGift = (words: WordWithIcon[]) => {
    return words.some(word => word.text === 'Gift');
  };

  function handleTransaction() {
    // Whatever you want to happen when the button is pressed
    console.log('Transaction History Button Pressed');
    // Or navigate to a transaction history screen, etc.
  }

  const rightWordsData: WordWithIcon[] = [
    {text: '#235446577542', icon: 'checkbox-multiple-blank-outline'},
    {text: 'Zak Veasy'},
    {text: 'Gift'},
    {text: '05.26.2025'},
    {text: '$1000'},
    {text: '6%APR, 6 months'},
    {text: '$171.23'},
  ];

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title={t('OfferDetails')}
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <View style={{marginTop: 50}}>
        <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 48}}>
          $12.20
        </Text>
        <Text
          style={[
            {
              textAlign: 'center',
              color: 'rgba(256, 256, 256, 0.5)',
              fontSize: 16,
            },
            hasGift(rightWordsData) && {marginBottom: 50},
          ]}>
          {t('EnteredAmount')}
        </Text>
      </View>
      {/* Conditionally render ProgressWithLabel based on the presence of 'Gift' */}
      {!hasGift(rightWordsData) && (
        <View style={{marginTop: 40, flexDirection: 'row'}}>
          <ProgressWithLabel
            collected={100}
            goal={500}
            collectedLabel={t('payed')}
            goalLabel={t('FullPaybackNeeded')}
          />
        </View>
      )}
      {/* Conditionally render TransactionHistory based on the presence of 'Gift' */}
      {!hasGift(rightWordsData) && (
        <TransactionHistory
          buttonText={t('ViewOfferTransactionHistory')}
          onPress={handleTransaction}
        />
      )}
      <SmallOfferDetailsVTwo
        title={t('OfferDetails')}
        rightWords={rightWordsData}
      />
      <CompleteButton
        onPress={() => {
          console.log('Button pressed!');
        }}
        text={t('MakePayment')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
});
