import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import SmallOfferDetailsVFour from '../../../../assets/constants/Components/SmallOfferDetailsVFour';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import GlobalStyles from '../../../../assets/constants/colors';
import TransactionHistory from '../../../../assets/constants/Components/CustomTransactionButton';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeStackParamList } from '../../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


export default function ClosedOfferGiftAccepted() {
  const navigation =
  useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
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
          goalLabel="Total payback needed"
        />
      </View>
      <TransactionHistory
        buttonText="View Offer Transaction History"
        onPress={() => navigation.navigate('LoanDetailsScreen')}
      />
      <SmallOfferDetailsVFour
        title="Offer Details"
        words={[
          {
            leftText: 'Offer sent from',
            rightText: 'John Doe',
          },
          {leftText: 'Closing date', rightText: '02.10.2024'},
          {leftText: 'Number of payments', rightText: '5'},
          {leftText: 'Total payback amount', rightText: '$65.50'},
          // ... and so on
        ]}
      />
      <CompleteButton
        text="Back to Offers"
        icon="return-up-back"
        iconSet="Ionicons"
        iconColor={GlobalStyles.Colors.primary100}
        color={GlobalStyles.Colors.primary600}
        onPress={() => console.log('Button pressed!')}
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
