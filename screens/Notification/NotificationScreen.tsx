import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Avatar, Divider} from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../assets/constants/colors';
import TransactionHistory from '../../assets/constants/Components/CustomTransactionButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StarCircle from '../../assets/constants/Components/Buttons/StarCircle';
import Notification, {
  NotificationType,
  NotificationTypes,
} from './Notification';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';

export default function NotificationScreen() {
  const notifications: NotificationTypes[] = [
    {id: '1', type: NotificationType.EarnedPoints, points: 50},
    {id: '2', type: NotificationType.SomeonePosted, from: 'Outside'},
    {
      id: '3',
      type: NotificationType.PaymentDue,
      amount: 800,
      dateDue: '05/14/24',
    },
    {id: '4', type: NotificationType.GroupInvitation, from: 'Real Restate'},
    {id: '5', type: NotificationType.FriendRequest, from: 'Anna Marie'},
    {id: '6', type: NotificationType.EarnedPoints, points: 100},
    {id: '7', type: NotificationType.SomeonePosted, from: 'School'},
    {
      id: '8',
      type: NotificationType.PaymentDue,
      amount: 800,
      dateDue: '09/24/24',
    },
    {id: '9', type: NotificationType.GroupInvitation, from: 'Library'},
    {id: '10', type: NotificationType.FriendRequest, from: 'Zack Wilson'},
  ];

  const renderNotification = ({item}: {item: NotificationTypes}) => (
    <Notification {...item} />
  );

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Notifications"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <View>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  InvitationContainer: {
    width: '100%',
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Background: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingVertical: 40,
  },
  points: {
    flex: 1,
    flexDirection: 'row', // This makes items arrange horizontally
    alignItems: 'center',
    marginLeft: 16,
  },
  Container: {
    height: 108,
    width: '96%',
    borderRadius: 15,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  BigContainer: {
    height: 150,
    width: '96%',
    borderRadius: 15,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  RoleLabelContainer: {
    flexDirection: 'column',
    width: '99%',
    height: '100%',
  },
  bigText: {
    fontSize: 18,
    marginLeft: 16,
    marginRight: 8,
    marginBottom: 6,
    //color: GlobalStyles.Colors.accent300,
    //textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
    marginLeft: 16,
    marginRight: 8,
    marginBottom: 6,
    //color: GlobalStyles.Colors.accent300,
    //textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '400',
  },
  InviteButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 24,
    marginLeft: 5,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
});
