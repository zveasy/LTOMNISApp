import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import CustomOfferBlock from '../../assets/constants/Components/CustomOfferBlock';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import SmallOfferDetailsVFour from '../../assets/constants/Components/SmallOfferDetailsVFour';

type OfferSentSuccessfulProps = {
  receivedAmount?: string;
};

const OfferSentSuccessful: React.FC<OfferSentSuccessfulProps> = ({
  receivedAmount = '$399.78',
}) => {
  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
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
        <View style={styles.AlignItems}>
          <Text style={{fontSize: 16, color: 'rgba(256,256,256, 0.4)'}}>
            You just received
          </Text>
        </View>
      </View>
      <View style={{marginBottom: 20}}>
        <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 48}}>
          {receivedAmount} {/* used receivedAmount prop here */}
        </Text>
      </View>
      <CustomOfferBlock
        data={[
          {leftText: 'Sent to', rightText: 'Zak Veasy'},
          {isDivider: true},
          {leftText: 'Amount Offered', rightText: '$15.45'},
        ]}
      />
      <View
        style={{marginTop: 40, width: '100%', flex: 1, alignItems: 'center'}}>
        <SmallOfferDetailsVFour
          title="Deposit Details"
          words={[
            {
              leftText: 'Transaction number',
              rightText: '#61251981891',
            },
            {leftText: 'Time', rightText: '6:18'},
            {leftText: 'Date', rightText: 'March, 2 2024'},
          ]}
        />
      </View>
      <CompleteButton
        text="Back to Feed"
        icon="return-up-back"
        iconSet="Ionicons"
        iconColor={GlobalStyles.Colors.primary100}
        color={GlobalStyles.Colors.primary200}
        onPress={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  AlignItems: {
    alignItems: 'center', // added this to center the text
  },
});

export default OfferSentSuccessful;
