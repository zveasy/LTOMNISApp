import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../assets/constants/colors';
import SmallOfferDetailsVFour from '../../assets/constants/Components/SmallOfferDetailsVFour';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';

type WithdrawSuccessfulProps = {
  receivedAmount?: string;
};

const WithdrawSuccessful: React.FC<WithdrawSuccessfulProps> = ({
  receivedAmount = '$15',
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
      <View>
        <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 48}}>
          {receivedAmount} {/* used receivedAmount prop here */}
        </Text>
      </View>
      <View style={{marginTop: 40, width: '100%', flex: 1, alignItems: 'center'}}>
        <SmallOfferDetailsVFour
          title="Withdraw Details"
          words={[
            {
              leftText: 'Date',
              rightText: '02.10.2024',
            },
            {leftText: 'Time', rightText: '6:18'},
            {leftText: 'Card Information', rightText: '*****3464'},
            // ... and so on
          ]}
        />
      </View>
      <View style={{marginTop: 40}}>
        <CompleteButton
          text="Done"
          iconColor={GlobalStyles.Colors.primary100}
          color={GlobalStyles.Colors.primary200}
          onPress={() => console.log('Button pressed!')}
        />
      </View>
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

export default WithdrawSuccessful;
