import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {PostCard, PostCardProps} from './PostCard';
import GlobalStyles from '../../assets/constants/colors';
import axios from 'axios';
import {AppState, setUserPostId} from '../../ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;

export default function Featured({route, navigation}: Props) {
  const fromMyPosts = route.params?.fromMyPosts ?? false;
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const renderEmptyListComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Featured Posts</Text>
      </View>
    );
  };

  const [postData, setPostData] = useState<PostCardProps[]>([]);
  const token = useSelector((state: AppState) => state.token);
  
  // Add safety check for token
  if (!token || !token.token) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/posts/featured',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setPostData(response.data.featuredPostList);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching data:', error.message);
      } else {
        console.error('Error fetching data:', String(error));
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOfferPress = async (postId: string) => {
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
      dispatch(setUserPostId(uniquePostId));
      navigation.navigate('PostOfferSummary', {
        posts: response.data.uniquePost,
      });

      console.log(
        'this is the Featured screen ***************************************',
        response.data,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching offers:', error.message);
      } else {
        console.error('Error fetching offers:', String(error));
      }
    }
  };

  // renderItem function
  const renderItem = ({item}: {item: PostCardProps; index: number}) => (
<PostCard
      avatar={item.avatar}
      user={item.user}
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
      subtext={undefined} 
      progress={undefined} 
      hours={undefined}/>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={postData || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id || index.toString()}
        ListEmptyComponent={renderEmptyListComponent}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
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
