import {View, StyleSheet, ImageBackground, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import PostOfferHeader from '../Lender/PostOfferHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FeedStackParamList} from '../../../App';
import axios from 'axios';
import {Text} from 'react-native-elements';

export default function PostOfferSummary() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const route = useRoute();

  // Unpack the 'offers' data from the route params
  const posts = route.params?.posts;

  console.log(
    `This is in the PostOfferSummary ${JSON.stringify(route.params)}`,
  );

  // Check if offers is available
  if (!posts) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.Background}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW5lcmd5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.rightSection}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      </ImageBackground>

      <View
        style={{
          width: '100%',
          height: '70%',
          bottom: 0,
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: 24,
        }}>
        <PostOfferHeader
          avatar={posts.user.avatar}
          firstName={posts.user.firstName}
          lastName={posts.user.lastName}
          number={80}
          title={posts.title}
          description={posts.description}
          totalAmount={posts.totalAmount}
          interestPercentage={posts.interestPercentage}
          progress={(posts.currentAmount / posts.totalAmount) * 100}
          participants={[
            {
              name: 'John Doe',
              avatarUri:
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFjZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            },
            {
              name: 'John Doe',
              avatarUri:
                'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            },
            {name: 'John Doe', avatarUri: 'http://example.com/johndoe.png'},
            // ... other participants
          ]}
          subtext="This is some random wrapping text that will be there and be going everywhere"
          buttonText="Offer"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    marginTop: 60, // Adjust the margin to position the title appropriately
  },
  rightSection: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 40,
    marginLeft: 40,
  },
});
