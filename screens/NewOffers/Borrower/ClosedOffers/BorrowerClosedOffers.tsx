import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, Text, RefreshControl, View} from 'react-native';
import GlobalStyles from '../../../../assets/constants/colors';
import ClosedOfferBigContainer, {
  OfferStatus,
} from '../../../../assets/constants/Components/ClosedOfferBigContainer';
import {offersData} from '../../../../assets/constants/data';
import {t} from 'i18next';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../ReduxStore';

export default function BorrowerClosedOffers() {
  const [offersData, setOffersData] = useState([]);
  const token = useSelector((state: AppState) => state.token);
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/posts/borrower/closed_offers',
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
        '/omnis/posts/borrower/closed_offers',
        JSON.stringify(response.data),
      );
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  const renderEmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('No Closed Offers')}</Text>
    </View>
  );

  const renderItem = ({item}) => (
    <ClosedOfferBigContainer
      title={item.title} // Assuming item has a title
      raiseNumber={item.raiseNumber} // Assuming item has a raiseNumber
      fullNumber={item.fullNumber} // Assuming item has a fullNumber
      users={item.users} // Assuming item has a list of users
      status={t('Closed')} // Here you are setting the status to a translated 'Closed' string
    />
  );

  return (
    <FlatList
      style={{backgroundColor: GlobalStyles.Colors.primary100}}
      data={offersData}
      renderItem={({item}) => (
        <ClosedOfferBigContainer
          title={item.title}
          totalAmount={item.totalAmount}
          currentAmount={item.currentAmount}
          user={item.user}
          description={item.description}
          status={t('Closed')} // Assuming you want to display 'Closed' for all items
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={renderEmptyListComponent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: 'grey',
  },
});
