import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {PostCard, PostCardProps} from './PostCard';
import GlobalStyles from '../../assets/constants/colors';
import { useSelector } from 'react-redux';
import { AppState } from '../../ReduxStore';
import axios from 'axios';

export default function FriendsFeed() {

  const [postData, setPostData] = useState<PostCardProps[]>([]);
  const token = useSelector((state: AppState) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      console.log("friends before the try")
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/posts/friends',
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setPostData(response.data);
        console.log(
          'response.data Friends',
          response.data,
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the function immediately to fetch data initially
    fetchData();

    // // Set up polling to fetch data every specified interval
    // const interval = setInterval(fetchData, 30000000); // Fetch data every 30 seconds

    // // Clean up interval on component unmount
    // return () => clearInterval(interval);
  }, []);
  // Data array
  // const postData = [
  //   {
  //     id: '1',
  //     avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     hours: 1,
  //     number: 5000,
  //     totalAmount: 100,
  //     progress: 50,
  //     title: 'This is a Post Title',
  //     subtext:
  //       'This is some subtext for the post. It provides more information about the post.',
  //     imageUrl:
  //       'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  //     offerText: 'Offers',
  //   },
  //   {
  //     id: '2',
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     hours: 2,
  //     number: 3000,
  //     totalAmount: 100,
  //     progress: 80,
  //     title: 'Another Post Title',
  //     subtext: 'Here is more subtext for another post.',
  //     offerText: 'Offers',
  //   },
  // ];

  const renderEmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Friends Posts</Text>
    </View>
  );

  // renderItem function
  const renderItem = ({item}: {item: PostCardProps}) => (
    <PostCard
      avatar={item.avatar}
      firstName={item.firstName}
      lastName={item.lastName}
      hours={item.hours}
      number={item.number}
      totalAmount={item.totalAmount}
      progress={item.progress}
      title={item.title}
      subtext={item.subtext}
      imageUrl={item.imageUrl}
      offerText={item.offerText}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.Colors.primary100,
    flex: 1,
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
