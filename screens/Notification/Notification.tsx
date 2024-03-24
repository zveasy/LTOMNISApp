import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {Avatar, Divider} from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../assets/constants/colors';
import TransactionHistory from '../../assets/constants/Components/CustomTransactionButton';
import StarCircle from '../../assets/constants/Components/Buttons/StarCircle';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

interface NotificationProps {
  id: string;
  type: NotificationType;
}

interface EarnedPointsNotificationProps extends NotificationProps {
  type: NotificationType.EarnedPoints;
  points: number;
}

interface SomeonePostedNotificationProps extends NotificationProps {
  type: NotificationType.SomeonePosted;
  from: string;
}

interface PaymentDueNotificationProps extends NotificationProps {
  type: NotificationType.PaymentDue;
  amount: number;
  dateDue: string;
}

interface GroupInvitationNotificationProps extends NotificationProps {
  type: NotificationType.GroupInvitation;
  from: string;
}

interface FriendRequestNotificationProps extends NotificationProps {
  type: NotificationType.FriendRequest;
  from: string;
}

export type NotificationTypes =
  | EarnedPointsNotificationProps
  | SomeonePostedNotificationProps
  | PaymentDueNotificationProps
  | GroupInvitationNotificationProps
  | FriendRequestNotificationProps;

export enum NotificationType {
  EarnedPoints = 'EarnedPointsNotifications',
  SomeonePosted = 'SomeonePostedNotification',
  PaymentDue = 'PaymentDueNotification',
  GroupInvitation = 'GroupInvitationNotification',
  FriendRequest = 'FriendRequestNotification',
}

export default function Notification(props: NotificationTypes) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  switch (props.type) {
    case NotificationType.EarnedPoints:
      return (
        <View>
          <View style={styles.Container}>
            <View style={styles.RoleLabelContainer}>
              <View style={styles.points}>
                <StarCircle iconName={'star-four-points-outline'} />
                <Text style={styles.pointsText}>{props.points}</Text>
              </View>

              <View style={styles.info}>
                <View>
                  <Text style={styles.bigText}>You Earned Omnis points</Text>
                </View>

                <View>
                  <Text style={styles.smallText}>Lending really suits you</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    case NotificationType.SomeonePosted:
      return (
        <View style={styles.Container}>
          <View style={styles.RoleLabelContainer}>
            <View style={styles.points}>
              <StarCircle iconName={'star-four-points-outline'} />
            </View>

            <View style={styles.info}>
              <View>
                <Text
                  style={
                    styles.bigText
                  }>{`Someone posted in '${props.from}'`}</Text>
              </View>

              <View>
                <Text style={styles.smallText}>See group post</Text>
              </View>
            </View>
          </View>
        </View>
      );
    case NotificationType.PaymentDue:
      return (
        <View style={styles.Container}>
          <View style={styles.RoleLabelContainer}>
            <View style={styles.points}>
              <Text style={styles.paymentText}>{props.amount}</Text>
            </View>

            <View style={styles.info}>
              <View>
                <Text style={styles.bigText}>Payment Due Soon</Text>
              </View>

              <View>
                <Text style={styles.smallText}>{props.dateDue}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    case NotificationType.GroupInvitation:
      return (
        <View style={styles.BigContainer}>
          <View style={styles.InvitationContainer}>
            <View style={styles.points}>
              <StarCircle iconName={'star-four-points-outline'} />
            </View>

            <View>
              <Text style={styles.bigText}>{props.from}</Text>
            </View>

            <View>
              <Text style={styles.smallText}>New group Invitation</Text>
            </View>

            <View style={styles.ButtonContainer}>
              <View
                style={{
                  width: 80,
                  height: 32,
                  backgroundColor: '#383838',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                <Text style={styles.InviteButtonText}>Decline</Text>
              </View>

              <View
                style={{
                  width: 80,
                  height: 32,
                  backgroundColor: GlobalStyles.Colors.primary200,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 10,
                  marginLeft: 10,
                  marginRight: 20,
                }}>
                <Text style={styles.InviteButtonText}>Accept</Text>
              </View>
            </View>
          </View>
        </View>
      );
    case NotificationType.FriendRequest:
      const handleAcceptFriendRequest = () => {
        navigation.navigate('SpotlightStackNavigator', {
            screen: 'FriendsProfile',
            params: { from: props.from },
          });
      };
      return (
        <Pressable onPress={handleAcceptFriendRequest} style={styles.BigContainer}>
          <View style={styles.InvitationContainer}>
            <View style={styles.points}>
              <StarCircle iconName={'star-four-points-outline'} />
            </View>

            <View>
              <Text style={styles.bigText}>{props.from}</Text>
            </View>

            <View>
              <Text style={styles.smallText}>New friend request</Text>
            </View>

            <View
              style={styles.ButtonContainer}>
              <View
                style={{
                  width: 80,
                  height: 32,
                  backgroundColor: '#383838',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                <Text style={styles.InviteButtonText}>Decline</Text>
              </View>

              <View
                style={{
                  width: 80,
                  height: 32,
                  backgroundColor: GlobalStyles.Colors.primary200,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 10,
                  marginLeft: 10,
                  marginRight: 20,
                }}>
                <Text style={styles.InviteButtonText}>Accept</Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    default:
      return (
        <View>
          <View style={styles.Container}>
            <View style={styles.RoleLabelContainer}>
              <View style={styles.points}>
                <Text style={styles.pointsText}>Something went wrong</Text>
              </View>
            </View>
          </View>
        </View>
      );
  }
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
  paymentText: {
    fontSize: 24,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  info: {
    marginBottom: 10,
  },
});
