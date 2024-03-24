import {View, Text} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import GlobalStyles from '../../../../assets/constants/colors';
import {SafeAreaView} from 'react-native';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import CustomOfferBlock from '../../../../assets/constants/Components/CustomOfferBlock';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';

const ChosenPaymentPlan = () => {
  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="New Offer Details"
        showBackArrow={true}
        onBackPress={() => {}}
        showRightIcon={true}
      />
      <CustomOfferBlock
        data={[
          {
            leftText: t('sentFrom'),
            rightText: firstName + ' ' + lastName,
          },
          {leftText: t('amountOffered'), rightText: `$${totalAmount}`},
          {
            leftText: t('newOfferDetails-interestRate'),
            rightText: `${interestPercentage}%`,
          },
          {isDivider: true},
          {
            leftText: t('Total'),
            rightText: `$${totalAmount * (1 + interestPercentage / 100)}`,
          },
        ]}
      />
      <ProgressWithLabel collected={postCurrentAmount} goal={postTotalAmount} />
      <Text>Chosen Payment Plan</Text>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
    paddingVertical: 40,
  },
  acceptDeclineContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50, // Adding padding to push the component up a bit
  },
});

export default ChosenPaymentPlan;
