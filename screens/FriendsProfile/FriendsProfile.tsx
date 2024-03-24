import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {Avatar, Divider, Icon} from 'react-native-elements';
import {user as importedUser} from '../../assets/constants/user'; // Renamed to avoid naming conflicts
import GlobalStyles from '../../assets/constants/colors';
import StatisticItem from '../MyProfile/StatisticItem';
import ButtonsRow from '../MyProfile/ButtonsRow';
import GrayBox from '../MyProfile/GrayBox';
import {User} from '../../types';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import {RouteProp, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from '../../App';

const FriendsProfile = () => {
  const route = useRoute<RouteProp<HomeStackParamList, 'FriendsProfile'>>();
  const {id} = route.params;

  const [friendUserData, setFriendUserData] = useState();
  const token = useSelector((state: AppState) => state.token);
  const [friendshipStatus, setFriendshipStatus] = useState('not_friends'); // Example initial value

  let buttonText = 'Add';
  let buttonAction = () => console.log('Send friend request'); // Placeholder for your add friend function
  let buttonActive = true; // Assuming it's always active in this context, adjust as needed
  let buttonState = 'default'; // Default state, adjust based on your component's logic

  // Example logic to set buttonState based on some condition
  if (friendshipStatus === 'not_friends') {
    buttonState = 'add'; // Now TypeScript knows buttonState is one of the allowed literals
  } else if (friendshipStatus === 'pending') {
    buttonState = 'pending'; // Same here
  } else {
    buttonState = 'default'; // And here
  }

  const friendId = id;
  console.log('this idd', id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/user/friend/profile/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setFriendUserData(response.data.friendsProfileObject);

        console.log(
          'response.data /omnis/user/friend/profile/${id}',
          JSON.stringify(response.data.friendsProfileObject),
        );
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const initials = friendUserData
    ? `${friendUserData.firstName[0]}${friendUserData.lastName[0]}`
    : 'NA';

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} showRightIcon={false} />
      <View style={styles.avatarContainer}>
        <Avatar
          size={80}
          rounded
          title={!friendUserData?.avatarUri ? initials : undefined}
          source={
            friendUserData?.avatarUri
              ? {uri: friendUserData.avatarUri}
              : undefined
          }
          overlayContainerStyle={{backgroundColor: 'gray'}}
          containerStyle={{width: 80, height: 80}}
        />
      </View>

      <View
        style={{marginTop: 10, flexDirection: 'column', alignItems: 'center'}}>
        {friendUserData ? (
          <>
            <Text style={styles.nameTitle}>
              {`${friendUserData.firstName} ${friendUserData.lastName}`}
            </Text>
            <Text style={styles.usernameTitle}>@{friendUserData.email}</Text>
          </>
        ) : (
          // Render a placeholder or a loading indicator if friendUserData is undefined
          <Text>Loading...</Text>
        )}
      </View>

      <View>
        <View style={styles.statisticsContainer}>
          <StatisticItem
            value={friendUserData?.numOfFriends ?? '0'}
            label="Friends"
          />
          <VerticalDivider />
          <StatisticItem value="80" label="Score" />
          <VerticalDivider />
          <StatisticItem
            label="Status"
            lottieSource={require('../../assets/goldBar.json')}
          />
        </View>
        <ButtonsRow
          leftButtonText="Add Friend" // Example text, adjust based on your actual logic
          onLeftButtonPress={() => console.log('Action for button')} // Placeholder function, replace with actual functionality
          isLeftButtonActive={true} // Example, adjust based on your actual logic
          buttonState={buttonState} // Correctly typed, no error should be thrown here
        />
      </View>
      <View
        style={{
          borderRadius: 24,
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          padding: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <GrayBox iconName="users" label="Friends" iconType="feather" />
        <GrayBox
          iconName="message-square"
          label="My Posts"
          iconType="feather"
        />
        <GrayBox
          iconName="account-group"
          label="Groups"
          iconType="MaterialCommunityIcons"
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendsProfile;

const VerticalDivider = () => {
  return <Divider style={styles.divider} />;
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  AlignItems: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Relative positioning for this container
  },
  editIcon: {
    position: 'absolute', // Absolute positioning for the pencil icon
    right: 1,
    bottom: 1,
    backgroundColor: GlobalStyles.Colors.primary600,
    borderRadius: 15,
    padding: 5,
  },
  nameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary100,
  },
  usernameTitle: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary100,
  },
  statisticsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: '60%',
    width: 1,
    backgroundColor: GlobalStyles.Colors.accent100,
    marginHorizontal: 10, // Optional, to give some space on either side
  },
});
