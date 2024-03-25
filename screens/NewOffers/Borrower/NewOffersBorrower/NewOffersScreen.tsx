// NewOffersScreen.js

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import GlobalStyles from '../../../../assets/constants/colors';
import OfferBigContainer, {
  OfferBigContainerProps,
} from '../../../../assets/constants/Components/OfferBigContainer';
import {AppState} from '../../../../ReduxStore';

export default function NewOffersScreen() {
  const [postData, setPostData] = useState<OfferBigContainerProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state: AppState) => state.token);

  const fetchMyPostFeedList = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const options = {
        method: 'GET',
        url: 'http://localhost:8080/api/omnis/posts/mypost',
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      const res = await axios(options);
      if (res.data) {
        setPostData(res.data.myPostList); // Update the post data
        console.log('this is borrower post', res.data.myPostList)
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  useEffect(() => {
    fetchMyPostFeedList(); // Initial data fetch
  }, []);

  useEffect(() => {
    fetchMyPostFeedList(); // Fetch data when the component mounts
  }, []);

  const renderEmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No New Offers</Text>
    </View>
  );

  const handleSelect = (item: OfferBigContainerProps) => {
    console.log('Selected item:', item);
    // Your selection logic here
  };

console.log('postData', postData.length)
console.log('postData askj', postData)

  return (
    <FlatList
      style={{backgroundColor: GlobalStyles.Colors.primary100}}
      data={postData}
      renderItem={({item}) => (
        <OfferBigContainer
          targetScreen="ActiveOfferDetails"
          avatar={item.avatar}
          timeElapsed={item.timeElapsed}
          number={item.number}
          totalAmount={item.totalAmount}
          currentAmount={item.currentAmount}
          title={item.title}
          description={item.description}
          interestPercentage={item.interestPercentage}
          // imageUrl={item.imageUrl}
          // offerText={fromMyPosts ? 'Edit' : 'Offer'}
          id={item.id}
          offerId={item.offerId} // Assuming these are part of your item object
          fullNumber={item.fullNumber}
          users={item.users}
          onSelect={() => handleSelect(item)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={renderEmptyListComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchMyPostFeedList} // Call your fetch function
        />
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
