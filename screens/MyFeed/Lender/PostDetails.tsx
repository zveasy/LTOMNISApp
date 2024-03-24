import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import CustomOfferBlock from '../../../assets/constants/Components/CustomOfferBlock';
import {ParticipantDetails} from '../Lender/ParticipantDetails';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {AmountBox} from './AmountBox';
import AmountChips from '../../../assets/constants/Components/AmountChips';
import ResetSubmit from '../../../assets/constants/Components/ResetSubmit';
import StarCircle from '../../../assets/constants/Components/Buttons/StarCircle';
import {calculateRewardPoints} from '../../../assets/constants/RewardsData/calculateRewardPoints';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';

export default function PostDetails() {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [customRate, setCustomRate] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(0); // Moved from being a constant
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [loanAmountInput, setLoanAmountInput] = useState<string>('');
  const [interestRateInput, setInterestRateInput] = useState<string>('');
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const navigation = useNavigation();

  const [offerData, setOfferData] = useState();
  const token = useSelector((state: AppState) => state.token);
  const userPostId = useSelector(
    (state: AppState) => state.userPostId.userPostId,
  );
  const userstate = useSelector(
    (state: AppState) => state.userPostId.userPostId,
  );
  console.log('Post ID for this post userPostId2', userPostId);
  console.log('Post ID for this post userstate', userstate);

  const fetchData = async () => {

    console.log('we are in the fetch data')
    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/offer/create',
        {
          amount: loanAmount,
          interestPercentage: interestRate,
          postId: userPostId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setOfferData(response.data);
      // Navigate to the OfferSent screen after setting the offer data
      console.log('response.data for Offer details', response.data )
      console.log('response.data.newOffer', response.data.newOffer);
      console.log('response.data', response.data);
      navigation.navigate('OfferSent');
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    setRewardPoints(calculateRewardPoints(loanAmount));
  }, [loanAmount]);

  // Test with $80
  console.log(calculateRewardPoints(80)); // Outputs: 270

  const handleChipPress = (value: string) => {
    if (value === 'Custom') {
      // The custom rate will be updated by the AmountBox callback.
    } else {
      setCustomRate(null);
      setSelectedChip(value);
      if (value !== 'Gift') {
        const rate = value.replace('%', ''); // Remove '%' character
        setInterestRate(parseFloat(rate)); // Update the interest rate

        console.log('This is the rate', rate);
      } else {
        setInterestRate(0); // Assuming 'Gift' means 0% interest
      }
    }
  };

  const resetValues = () => {
    setSelectedChip(null);
    setCustomRate(null);
    setLoanAmount(0);
    setLoanAmountInput('0');
    setInterestRate(null);
    setInterestRateInput('0'); // Resetting interest rate input
  };

  const chipValues = [
    'Gift',
    '0%',
    '1%',
    '2%',
    '3%',
    '5%',
    '7%',
    '9%',
    'Custom',
  ];

  const calculateTotalAmount = () => {
    if (selectedChip === null) {
      return loanAmount;
    }
    if (selectedChip === 'Gift') {
      return 'Gift';
    }
    if (selectedChip === 'Custom' && interestRate !== null) {
      const interestAmount = (interestRate / 100) * loanAmount;
      return loanAmount + interestAmount;
    }

    const chipInterestRate = parseFloat(selectedChip);
    const interestAmount = (chipInterestRate / 100) * loanAmount;

    return loanAmount + interestAmount;
  };

  // NAN

  const renderAmountDisplay = () => {
    const amount = calculateTotalAmount();

    // Check if amount is "Gift" first
    if (amount === 'Gift') {
      return (
        <>
          <Text
            style={{
              fontSize: 24,
              marginTop: 40,
              color: GlobalStyles.Colors.primary100,
            }}>
            {amount}
          </Text>
          <Text
            style={{
              fontSize: 48,
              marginTop: 5,
              color: GlobalStyles.Colors.primary100,
            }}>
            ${loanAmount.toFixed(2)}
          </Text>
          <Text style={{fontSize: 14, marginTop: 10, color: 'gray'}}>
            A gift is not given back! I know they appreciate it!
          </Text>
        </>
      );
    }

    // Next, check if amount is NaN
    if (typeof amount === 'number' && isNaN(amount)) {
      return (
        <Text
          style={{
            fontSize: 24,
            marginTop: 40,
            color: GlobalStyles.Colors.primary100,
          }}>
          No amount chosen
        </Text>
      );
    }

    // Otherwise, display the amount
    return (
      <Text
        style={{
          fontSize: 48,
          marginTop: 40,
          color: GlobalStyles.Colors.primary100,
        }}>
        ${typeof amount === 'number' ? amount.toFixed(2) : amount}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={{flex: 1}}>
        <ScreenTitle
          title="Offer Details"
          showBackArrow={true}
          onBackPress={() => {}}
        />
        <AmountBox
          title="Loan Amount"
          inputType="dollar"
          inputValue={loanAmountInput}
          onInputChange={(value: string) => setLoanAmountInput(value)}
          onAmountChange={(value: number) => setLoanAmount(value)}
        />
        <View style={styles.container}>
          <Text style={styles.titleTwo}>Interest Rate</Text>
          <View style={styles.chipsContainer}>
            {chipValues.map((value, index) => (
              <AmountChips
                key={index}
                label={value}
                selected={selectedChip === value}
                onPress={() => handleChipPress(value)}
              />
            ))}
          </View>
        </View>
        <View>
          {selectedChip === 'Custom' ? (
            <AmountBox
              title="Interest Rate"
              inputType="percentage"
              inputValue={interestRateInput}
              onInputChange={(value: string) => setInterestRateInput(value)}
              onAmountChange={(value: number) => setInterestRate(value)} // This updates the interest rate
              editable={selectedChip === 'Custom'}
            />
          ) : (
            <AmountBox
              title="Interest Rate"
              inputType="percentage"
              inputValue={interestRateInput} // Add this
              onInputChange={(value: string) => {}} // This should not do anything since it's not editable
              onAmountChange={(value: number) => {}}
              editable={false}
            />
          )}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width: '100%',
                paddingRight: 20,
              }}>
              <Text
                style={{fontSize: 20, color: GlobalStyles.Colors.primary100}}>
                {rewardPoints}{' '}
              </Text>
              <StarCircle
                iconName="star-four-points-outline"
                height={24}
                width={24}
              />
            </View>
            {renderAmountDisplay()}
          </View>
          <View
            style={{
              width: '90%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}></View>
        </View>
      </View>
      <ResetSubmit
        onResetPress={resetValues} // Passing the reset function here
        onSubmitPress={fetchData}
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
    color: GlobalStyles.Colors.primary100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
    color: GlobalStyles.Colors.primary100,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleTwo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left', // Align text to the left
    marginBottom: 5, // Space between title and box
    color: GlobalStyles.Colors.primary100,
  },
  container: {
    width: '96%',
    alignSelf: 'center',
  },
  containerTwo: {
    width: '96%',
    alignSelf: 'center',
    marginTop: 20,
  },
  disabledBox: {
    opacity: 0.5,
    backgroundColor: 'gray',
    // You can add any other styles to make it appear disabled
  },

  disabledText: {
    color: 'gray',
    // You can add any other styles to make it appear disabled
  },
});
