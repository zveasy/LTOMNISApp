import {View, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../../../../assets/constants/colors';
import {offersDataLender} from '../../../../assets/constants/offersDataLender';
import MediumBigContainer from '../../../../assets/constants/Components/MediumBigContainer';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../ReduxStore';
import axios from 'axios';

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

const ActiveOffersLender = () => {
  // Function to render the empty list message
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
        'http://localhost:8080/api/omnis/posts/lender/active_offers',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setOffersData(response.data.lenderActiveOfferPostList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  const renderEmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Active Offers</Text>
    </View>
  );

  return (
    <FlatList
      style={{backgroundColor: GlobalStyles.Colors.primary100}}
      data={offersData}
      renderItem={({item}) => (
        <MediumBigContainer
          targetScreen="ActiveOfferLenderDetails"
          title={item.title}
          firstName={item.offers[0].user.firstName}
          lastName={item.offers[0].user.lastName}
          // avatarImage={item.avatarImage}
          // userName={item.userName}
          amount={item.offers[0].amount}
          interest={item.offers[0].interestPercentage}
          postId={item.id}
          timeElapsed={item.timeElapsed}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={renderEmptyListComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData} // Call fetchData on pull-to-refresh
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

export default ActiveOffersLender;
