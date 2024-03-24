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
import {t} from 'i18next';
import {HomeStackParamList} from '../../../../App';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../ReduxStore';
import axios from 'axios';
import { OfferStatus } from '../../../../assets/constants/Components/ClosedOfferBigContainer';

function handleTransaction() {
  console.log('Transaction History Button Pressed');
}

interface OfferData {
  id: number; // Assuming id is a number
  title: string;
  firstName: string;
  lastName: string;
  amount: number;
  interestPercentage: number;
  timeElapsed: string;
  status: string;
  createdAt: Date;
  offers: [];
  // Include other fields as needed
}

type ActiveOfferDetailsProps = {
  route: RouteProp<HomeStackParamList, 'ActiveOfferDetails'>;
};
const ActiveOfferDetails: React.FC<ActiveOfferDetailsProps> = ({route}) => {
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
        console.log(
          'response.data /omnis/offers/details/',
          JSON.stringify(response.data),
        );
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title={t('NewOfferDetails')}
        showBackArrow={true}
        onBackPress={() => {}}
        showRightIcon={true}
      />
      {offersData.map((item, index) => (
        <CustomOfferBlockWithProfile
          key={index}
          // data={item.data}
          firstName={item.firstName}
          lastName={item.lastName}
          amount={item.amount}
          interestPercentage={item.interestPercentage}
          id={item.id}
          status={item.status as OfferStatus}
          createdAt={item.createdAt}
        />
      ))}
      <SmallOfferDetailsVFour
        title={t('OfferDetails')}
        words={[
          {
            leftText: 'Offer Number',
            rightText: '#235446577542',
            icon: 'checkbox-multiple-blank-outline',
          },
          {leftText: 'Date', rightText: '02.10.2024'},
          {leftText: 'Time', rightText: '05:15 AM'},
          // ... and so on
        ]}
      />
      <CompleteButton
        text={t('Deactivate')}
        icon="remove-circle-outline"
        iconSet="Ionicons"
        iconColor="#E10000"
        color={GlobalStyles.Colors.primary600}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
};

export default ActiveOfferDetails;

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
