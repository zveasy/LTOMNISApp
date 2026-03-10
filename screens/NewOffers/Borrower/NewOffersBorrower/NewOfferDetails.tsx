import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Pressable} from 'react-native';
import {HomeStackParamList} from '../../../../App';
import GlobalStyles from '../../../../assets/constants/colors';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import CustomOfferBlock from '../../../../assets/constants/Components/CustomOfferBlock';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import {t} from 'i18next';
import {RouteProp} from '@react-navigation/native';

type NewOfferDetailsProps = NativeStackScreenProps<HomeStackParamList, 'NewOfferDetails'>;

const NewOfferDetails: React.FC<NewOfferDetailsProps> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    offerId,
    firstName,
    lastName,
    totalAmount,
    interestPercentage,
    avatar,
    currentAmount,
    postTotalAmount,
    postCurrentAmount,
  } = route.params;
  console.log('this is postCurrentAmount^^', postCurrentAmount);
  console.log('this is postTotalAmount', postTotalAmount);

  const totalWithInterest: number = parseFloat(
    (totalAmount * (1 + interestPercentage / 100)).toFixed(2)
  );

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
            rightText: `$${totalWithInterest}`,
          },
        ]}
      />
      <ProgressWithLabel collected={postCurrentAmount} goal={postTotalAmount} />

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.counterOfferButton}
          onPress={() => {
            navigation.navigate('CounterOffer', {
              offerId: offerId,
              firstName: firstName,
              lastName: lastName,
              totalAmount: totalAmount,
              interestPercentage: interestPercentage,
            });
          }}>
          <Text style={styles.counterOfferButtonText}>Counter Offer</Text>
        </Pressable>
      </View>

      <CompleteButton
        onPress={() => {
          navigation.navigate('ChoosePaymentPlanScreen', {
            offerId: offerId,
            interestPercentage: interestPercentage,
            totalAmount: totalAmount,
            postCurrentAmount: postCurrentAmount,
            postTotalAmount: postTotalAmount,
            totalWithInterest: totalWithInterest,
            firstName: firstName,
            lastName: lastName,
          });
        }}
        text={t('Complete')}
      />
    </SafeAreaView>
  );
};

export default NewOfferDetails;

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
    paddingVertical: 40,
  },
  buttonRow: {
    width: '90%',
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'center',
  },
  counterOfferButton: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterOfferButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
