import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../../assets/constants/colors';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import TransactionHistory from '../../../../assets/constants/Components/CustomTransactionButton';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import Icon from 'react-native-vector-icons/Ionicons';
import SmallOfferDetailsVThree from '../../../../assets/constants/Components/SmallOfferDetailsVThree';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../../App';

type NewOfferDetailsProps = {
  initialRaiseNumber?: number;
  initialFullNumber?: number;
};

type WordWithIcon = {
  text: string;
  icon?: string;
};

export default function OfferDetailsAccepted({
  initialRaiseNumber = 40,
  initialFullNumber = 100,
}: NewOfferDetailsProps) {
  const [raiseNumber, setRaiseNumber] = React.useState(initialRaiseNumber);
  const [fullNumber, setFullNumber] = React.useState(initialFullNumber);
  const navigation =
  useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  function handleTransaction() {
    navigation.navigate('TransactionHistoryTax')}
  

  const rightWordsData: WordWithIcon[] = [
    {text: 'Zak Veasy'},
    {text: '01.02.2024'},
    {text: '34'},
    {text: '$171.23'},
  ];

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Offer Details"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
        showRightIcon={true}
        rightIconType="Feather" // Either 'Ionicons' or 'Feather'
        rightIconName="upload" // replace with actual Feather icon name
        onRightIconPress={() => {}}
      />
      <View style={{marginTop: 50}}>
        <Icon
          name="checkmark-circle-outline"
          size={60}
          color={GlobalStyles.Colors.primary200}
          style={{alignSelf: 'center'}}
        />
        <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 24}}>
          Offer is Closed
        </Text>
      </View>
      <View style={{marginTop: 40, flexDirection: 'row'}}>
        <ProgressWithLabel
          collected={100}
          goal={500}
          collectedLabel="Payed"
          goalLabel="Full payback needed"
        />
      </View>
      <TransactionHistory
        buttonText="View Offer Transaction History"
        onPress={handleTransaction}
      />
      <SmallOfferDetailsVThree
        title="Offer Details"
        rightWords={rightWordsData}
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
