import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import TextInputComponent from '../../../assets/constants/Components/TextInputComponent';
import CustomOfferBlock from '../../../assets/constants/Components/CustomOfferBlock';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../App';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import axios from 'axios';

type CounterOfferProps = NativeStackScreenProps<HomeStackParamList, 'CounterOffer'>;

const CounterOffer: React.FC<CounterOfferProps> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const token = useSelector((state: AppState) => state.token);

  const {offerId, firstName, lastName, totalAmount, interestPercentage} =
    route.params;

  const [proposedAmount, setProposedAmount] = useState('');
  const [proposedInterest, setProposedInterest] = useState('');
  const [proposedTerm, setProposedTerm] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendCounterOffer = () => {
    if (!proposedAmount || !proposedInterest || !proposedTerm) {
      Alert.alert('Missing Fields', 'Please fill in all counter-offer fields.');
      return;
    }

    setSubmitting(true);

    const payload = {
      proposedAmount: parseFloat(proposedAmount),
      proposedInterest: parseFloat(proposedInterest),
      proposedTerm: parseInt(proposedTerm, 10),
      message: message,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    axios
      .post(
        `http://localhost:8080/api/omnis/offer/${offerId}/counter`,
        payload,
        config,
      )
      .then(response => {
        console.log('Counter offer sent:', response.data);
        setSubmitting(false);
        Alert.alert('Success', 'Counter offer sent successfully!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(error => {
        console.error('Counter offer error:', error);
        setSubmitting(false);
        Alert.alert('Error', 'Failed to send counter offer. Please try again.');
      });
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Counter Offer"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Original Offer</Text>
        <CustomOfferBlock
          data={[
            {leftText: 'Lender', rightText: `${firstName} ${lastName}`},
            {leftText: 'Amount Offered', rightText: `$${totalAmount}`},
            {leftText: 'Interest Rate', rightText: `${interestPercentage}%`},
          ]}
        />

        <Text style={styles.sectionLabel}>Your Counter Offer</Text>
        <TextInputComponent
          title="Proposed Amount"
          placeholder="Enter proposed amount"
          keyboardType="numeric"
          onChangeText={text => {
            const cleaned = text.replace(/[^0-9.]/g, '');
            setProposedAmount(cleaned);
          }}
          isAmount={true}
        />
        <TextInputComponent
          title="Proposed Interest Rate (%)"
          placeholder="Enter interest rate"
          keyboardType="numeric"
          onChangeText={text => {
            const cleaned = text.replace(/[^0-9.]/g, '');
            setProposedInterest(cleaned);
          }}
        />
        <TextInputComponent
          title="Proposed Term (months)"
          placeholder="Enter number of months"
          keyboardType="numeric"
          onChangeText={text => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setProposedTerm(cleaned);
          }}
        />
        <TextInputComponent
          title="Message to Lender"
          placeholder="Write a message (optional)"
          keyboardType="default"
          onChangeText={text => setMessage(text)}
          inputHeight={100}
        />
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <CompleteButton
        text={submitting ? 'Sending...' : 'Send Counter Offer'}
        color={GlobalStyles.Colors.primary200}
        onPress={handleSendCounterOffer}
      />
    </SafeAreaView>
  );
};

export default CounterOffer;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
