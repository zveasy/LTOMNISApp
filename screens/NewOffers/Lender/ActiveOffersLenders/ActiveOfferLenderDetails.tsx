import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../../assets/constants/colors';
import CustomOfferBlockWithProfile from '../../../../assets/constants/Components/CustomOfferBlockWithProfile';
import activeDataCards from '../../../../assets/constants/Components/activeDataCards';
import ProgressWithLabel from '../../../../assets/constants/Components/ProgressWithLabel';
import TransactionHistory from '../../../../assets/constants/Components/CustomTransactionButton';
import SmallOfferDetailsVFour from '../../../../assets/constants/Components/SmallOfferDetailsVFour';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import {AppState} from '../../../../ReduxStore';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {RouteProp} from '@react-navigation/native';
import {HomeStackParamList} from '../../../../App';

function handleTransaction() {
  console.log('Transaction History Button Pressed');
}
interface OfferData {
  id: number; // Assuming id is a number
  title: string;
  firstName: string;
  lastName: string;
  totalAmount: number;
  interestPercentage: number;
  timeElapsed: string;
  offers: [];
  // Include other fields as needed
}

type ActiveOfferLenderDetailsProps = {
  route: RouteProp<HomeStackParamList, 'ActiveOfferLenderDetails'>;
};
const ActiveOfferLenderDetails: React.FC<ActiveOfferLenderDetailsProps> = ({route}) => {
  const [offersData, setOffersData] = useState<OfferData[]>([]);
  const token = useSelector((state: AppState) => state.token);
  const {offerId} = route.params;

  console.log('this is the post ID', offerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/offers/details/${offerId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setOffersData(response.data);
        console.log('response.data /omnis/offers/details/', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="New Offer Details"
        showBackArrow={true}
        onBackPress={() => {}}
        showRightIcon={true}
      />
      {activeDataCards.map((card, index) => (
        <CustomOfferBlockWithProfile
          key={index}
          data={card.data}
          firstname={card.firstname}
          lastname={card.lastname}
          status={card.status}
        />
      ))}
      <ProgressWithLabel
        collected={100}
        goal={500}
        collectedLabel="Already payed back"
        goalLabel="Full payback needed"
      />
      <TransactionHistory
        buttonText="View Offer Transaction History"
        onPress={handleTransaction}
      />
      <SmallOfferDetailsVFour
        title="Offer Details"
        words={[
          {
            leftText: 'Offer Number',
            rightText: '#235446577542',
            icon: 'checkbox-multiple-blank-outline',
          },
          {leftText: 'Due date', rightText: '02.10.2024'},
          {leftText: 'Duration', rightText: '6 months'},
          {leftText: 'Payback amount per month', rightText: '$65'},
          {leftText: 'Number of payouts', rightText: '5'},
          // ... and so on
        ]}
      />
      <CompleteButton
        text="Back to Active Offers"
        icon="return-up-back"
        iconSet="Ionicons"
        iconColor={GlobalStyles.Colors.primary100}
        color={GlobalStyles.Colors.primary600}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
};

export default ActiveOfferLenderDetails;

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
