import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import CustomOfferBlock from '../../../assets/constants/Components/CustomOfferBlock';
import {ParticipantDetails} from '../Lender/ParticipantDetails';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import { Divider } from 'react-native-elements/dist/divider/Divider';

// Dummy data for demonstration
const participants = [{ name: 'John Doe' }, { name: 'Jane Smith' }];
const groups = [{ name: 'Group One' }, { name: 'Group Two' }, { name: 'Group Three' }];
const friends = [{ name: 'Friend One' }];

export default function FeedSummary() {
  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Offer Summary"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <CustomOfferBlock
        data={[
          {leftText: 'Loan amount', rightText: `$${380}`},
          {leftText: 'Interest rate', rightText: `${5}%`},
          {isDivider: true},
          {leftText: 'Remaining', rightText: `$${375}`},
        ]}
      />
      <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'column' }} >
        <Text style={styles.title}>Transaction Details</Text>
        <Text style={styles.subtext}>
    you need to start different groups to be able to reach your goal! Please,
    try{' '}
    <Text
      style={{
        ...styles.subtext,
        color: GlobalStyles.Colors.primary200, fontWeight: 'bold' // change this to the yellow color you prefer
      }}>
      Spotlight{' '}
    </Text>
    features to find your community
  </Text>   
     </View>
      <ParticipantDetails textColor={GlobalStyles.Colors.primary100} borderColor={GlobalStyles.Colors.primary800} participants={participants} />
      <Divider width={1} style={{ width: '90%', alignSelf: 'center', marginTop: 10 }} color={GlobalStyles.Colors.accent200} />
      <ParticipantDetails textColor={GlobalStyles.Colors.primary100} borderColor={GlobalStyles.Colors.primary800} participants={groups} type="groups" />
      <Divider width={1} style={{ width: '90%', alignSelf: 'center', marginTop: 10 }} color={GlobalStyles.Colors.accent200} />
      <ParticipantDetails textColor={GlobalStyles.Colors.primary100} borderColor={GlobalStyles.Colors.primary800} participants={friends} type="friends" />

      <CompleteButton
        text="Edit Post"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  subtext: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 20,
    color: GlobalStyles.Colors.primary100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
    color: GlobalStyles.Colors.primary100
  },
});
