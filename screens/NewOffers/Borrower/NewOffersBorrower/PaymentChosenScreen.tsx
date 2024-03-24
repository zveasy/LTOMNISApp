import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import CustomOfferBlock from '../../../../assets/constants/Components/CustomOfferBlock';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import GlobalStyles from '../../../../assets/constants/colors';
import PaymentPlanBoxChangePlan from '../../../../assets/constants/Components/PaymentPlanBoxChangePlan';
import AcceptAndDecline from '../../../../assets/constants/Components/Buttons/AcceptAndDecline';
import BottomSheetModal from '../../../../assets/constants/Components/BottomSheetModal';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../../App';
import {t} from 'i18next';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {AppState} from '../../../../ReduxStore';
import {useSelector} from 'react-redux';

type PaymentChosenScreenRouteParams = {
  offerId: string;
  interestPercentage: number;
  monthDuration: number;
  monthlyPayment: number;
  rewardNumber: number;
  fullNumber: number;
  postCurrentAmount: number;
  postTotalAmount: number;
  totalWithInterest: number;
  firstName: string;
  lastName: string;
};

export default function PaymentChosenScreen() {
  const route =
    useRoute<RouteProp<{params: PaymentChosenScreenRouteParams}, 'params'>>();
  const {
    offerId,
    interestPercentage,
    monthDuration,
    monthlyPayment,
    rewardNumber,
    fullNumber,
    postCurrentAmount,
    postTotalAmount,
    totalWithInterest,
    firstName,
    lastName,
  } = route.params;

  const [raiseNumber, setRaiseNumber] = React.useState(2);
  // const [fullNumber, setFullNumber] = React.useState(3);
  const token = useSelector((state: AppState) => state.token);
  const paymentPlans = ['5 months'];
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [interestRate, setInterestRate] = React.useState<string>('Gift'); // set default as '3%'
  const [paymentPlanDetails, setPaymentPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offerIdPost = offerId;
  const monthDurationPost = monthDuration;
  const ppm = monthlyPayment;

  const fetchPaymentPlanDetails = async () => {
    const headers = {
      Authorization: `Bearer ${token.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    console.log('Im in the try');
    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:8080/api/omnis/offer/accept',
        {
          offerId: offerIdPost,
          paymentPlan: {
            ppm: ppm,
            months: monthDurationPost,
          },
        },
        {headers: headers},
      );
      setPaymentPlanDetails(response.data);
      setError(null); // Clear any previous errors
      console.log('response.data /omnis/offer/accept', response.data);
    } catch (error) {
      setError('Failed to fetch data'); // Set the error message
      console.error('Failed to fetch payment plan details:', error);
      // Additional error handling (e.g., showing an alert)
    } finally {
      setIsLoading(false);
    }
  };

  const AcceptAndDeclineStyles = StyleSheet.create({
    acceptButtonActive: {},
    acceptButtonInactive: {
      // Define your styles for the inactive accept button here
    },
    // You can add more styles as needed
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const handleAccept = () => {
    setModalVisible(true);
  };

  const handleDecline = () => {
    navigation.goBack();
  };

  const handleAcceptModal = () => {
    setModalVisible(false);
    fetchPaymentPlanDetails();
    navigation.navigate('SuccessOffer', {
      offerId: offerId,
      firstName: firstName,
      lastName: lastName,
      postCurrentAmount: postCurrentAmount,
      postTotalAmount: postTotalAmount,
      totalWithInterest: totalWithInterest,
      interestPercentage: interestPercentage,
      monthDuration: monthDuration,
      monthlyPayment: monthlyPayment,
      fullNumber: fullNumber,
    });
  };

  const handleDeclineModal = () => {
    setModalVisible(false);
  };

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
          {leftText: t('sentFrom'), rightText: firstName + ' ' + lastName},
          {leftText: t('amountOffered'), rightText: `$${fullNumber}`},
          {
            leftText: t('newOfferDetails-interestRate'),
            rightText: `${interestPercentage}%`,
          },
          {isDivider: true},
          {leftText: t('Total'), rightText: `$${totalWithInterest}`},
        ]}
      />
      <ProgressWithLabel collected={postCurrentAmount} goal={postTotalAmount} />
      {interestRate !== '2%' ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: '90%',
              marginTop: 20,
            }}>
            <Text
              style={{
                color: GlobalStyles.Colors.primary100,
                fontSize: 18,
                fontWeight: '700',
              }}>
              Choose Payment plan
            </Text>
          </View>
          {paymentPlans.map((plan, index) => (
            <PaymentPlanBoxChangePlan
              key={index}
              title={plan}
              offerNumber={52}
              raiseNumber={300}
              fullNumber={500}
              rewardNumber={rewardNumber}
              interestPercentage={interestPercentage}
              monthDurationPost={monthDurationPost}
              ppm={ppm}
              users={[
                {
                  firstNameLetter: 'Z',
                  lastNameLetter: 'K',
                  userName: 'Zak',
                  amount: 250,
                  interest: 5,
                },
              ]}
            />
          ))}
        </>
      ) : (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <CheckBox
            value={isChecked}
            onValueChange={setChecked}
            onCheckColor={GlobalStyles.Colors.primary200}
            onTintColor={GlobalStyles.Colors.primary200}
          />
          <Text
            style={{
              marginLeft: 10,
              width: '80%',
              color: GlobalStyles.Colors.primary100,
            }}>
            {t('giftUnderstand')}
          </Text>
        </View>
      )}
      <View style={styles.acceptDeclineContainer}>
        <AcceptAndDecline
          onAccept={handleAccept}
          onDecline={handleDecline}
          acceptButtonStyle={
            interestRate === 'Gift' && isChecked
              ? AcceptAndDeclineStyles.acceptButtonActive
              : AcceptAndDeclineStyles.acceptButtonInactive
          }
        />
      </View>
      <BottomSheetModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAccept={() => {
          handleAcceptModal();
        }}
        onDecline={() => {
          handleDeclineModal();
        }}
      />
    </SafeAreaView>
  );
}

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
