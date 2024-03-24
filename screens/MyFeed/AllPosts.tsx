import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native'; // Add RefreshControl
import {PostCard, PostCardProps} from './PostCard';
import GlobalStyles from '../../assets/constants/colors';
import axios from 'axios';
import {AppState, setUserPostId} from '../../ReduxStore';
import {useDispatch, useSelector} from 'react-redux';

export default function AllPosts({route, navigation}) {
  const fromMyPosts = route.params?.fromMyPosts ?? false;
  const [postData, setPostData] = useState<PostCardProps[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Added for pull-to-refresh
  const token = useSelector((state: AppState) => state.token);
  const dispatch = useDispatch();

  const renderEmptyListComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No All Posts</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchData(); // Call fetchData directly
  }, []);

  const fetchData = async () => {
    setRefreshing(true); // Enable refreshing indicator
    try {
      const response = await axios.get('http://localhost:8080/api/omnis/posts/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setPostData(response.data.postList);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false); // Disable refreshing indicator
    }
  };

  const handleOfferPress = async (postId: string) => {
    console.log('we entered the handleOFFerPress')
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      // Now you can do something with the offers data, like navigating to a new screen with this data
      const uniquePostId = postId;
      console.log('This is the correct uniquePostId!: ', uniquePostId);
      dispatch(setUserPostId(uniquePostId))
      navigation.navigate('PostOfferSummary', {
        posts: response.data.uniquePost,
      });

      console.log(
        'this is the ALL screen ***********',
        response.data.uniquePost,
      );
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  // renderItem function
  const renderItem = ({item}: {item: PostCardProps}) => (
    <PostCard
      avatar={item.avatar}
      firstName={item.user.firstName}
      lastName={item.user.lastName}
      timeElapsed={item.timeElapsed}
      number={item.number}
      totalAmount={item.totalAmount}
      currentAmount={item.currentAmount}
      title={item.title}
      description={item.description}
      imageUrl={item.imageUrl}
      offerText={fromMyPosts ? 'Edit' : 'Offer'}
      onOfferPress={() => handleOfferPress(item.id)}
      id={item.id}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={postData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyListComponent}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData} // Call fetchData on pull-to-refresh
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.Colors.primary100,
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust this value as needed
  },
  emptyText: {
    fontSize: 18,
    color: 'grey', // Change the color as needed
  },
});
