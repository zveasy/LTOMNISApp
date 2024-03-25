import {View, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../../../../assets/constants/colors';
import {offersDataLender} from '../../../../assets/constants/offersDataLender';
import MediumBigContainer from '../../../../assets/constants/Components/MediumBigContainer';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../ReduxStore';

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

const NewOffersLender = () => {
  const [offersData, setOffersData] = useState<OfferData[]>([]);
  const token = useSelector((state: AppState) => state.token);
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/posts/lender',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setOffersData(response.data.lenderPostList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  // Function to render the empty list message
  const renderEmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Sent Offers</Text>
    </View>
  );

  return (
    <FlatList
      style={{backgroundColor: GlobalStyles.Colors.primary100}}
      data={offersData}
      renderItem={({item}) => (
        <MediumBigContainer
          targetScreen="ActiveOfferDetails"
          title={item.title}
          firstName={item.offers[0].user.firstName}
          lastName={item.offers[0].user.lastName}
          // avatarImage={item.avatarImage}
          // userName={item.userName}
          amount={item.offers[0].amount}
          interest={item.offers[0].interestPercentage}
          offerId={item.offers[0].id}
          timeElapsed={item.timeElapsed}
        />
      )}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={renderEmptyListComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust as needed
  },
  emptyText: {
    fontSize: 18,
    color: 'grey', // Change as needed
  },
});

export default NewOffersLender;
