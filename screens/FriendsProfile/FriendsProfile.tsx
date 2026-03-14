import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert, ScrollView, Pressable} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {Avatar, Divider, Icon} from 'react-native-elements';
import {user as importedUser} from '../../assets/constants/user';
import GlobalStyles from '../../assets/constants/colors';
import StatisticItem from '../MyProfile/StatisticItem';
import ButtonsRow from '../MyProfile/ButtonsRow';
import GrayBox from '../MyProfile/GrayBox';
import TrustBadges from '../../assets/constants/Components/TrustBadges';
import {User} from '../../types';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../App';

interface ReputationData {
  loansFunded: number;
  loansRepaid: number;
  onTimePaymentRate: number;
}

const FriendsProfile = () => {
  const route = useRoute<RouteProp<HomeStackParamList, 'FriendsProfile'>>();
  const {id} = route.params;

  const bugFix: any = null;
  const [friendUserData, setFriendUserData] = useState(bugFix);
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const token = useSelector((state: AppState) => state.token);
  const [friendshipStatus, setFriendshipStatus] = useState('not_friends');
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  let buttonText = 'Add';
  let buttonAction = () => console.log('Send friend request');
  let buttonActive = true;
  let buttonState = 'default';

  if (friendshipStatus === 'not_friends') {
    buttonState = 'add';
  } else if (friendshipStatus === 'pending') {
    buttonState = 'pending';
  } else {
    buttonState = 'default';
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
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };

    const fetchReputation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/user/friend/reputation/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setReputationData(response.data);
      } catch (error) {
        console.error('Error fetching reputation data: ', error);
        Alert.alert('Error', 'Failed to load reputation data.');
      }
    };

    fetchData();
    fetchReputation();
  }, []);

  const initials = friendUserData
    ? `${friendUserData.firstName[0]}${friendUserData.lastName[0]}`
    : 'NA';

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} showRightIcon={false} />
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{alignItems: 'center'}}>
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
            <StatisticItem
              value={friendUserData?.omnisScore?.toString() ?? '0'}
              label="Score"
            />
            <VerticalDivider />
            <StatisticItem
              label="Status"
              lottieSource={require('../../assets/goldBar.json')}
            />
          </View>
          <ButtonsRow
            leftButtonText="Add Friend"
            onLeftButtonPress={() => console.log('Action for button')}
            isLeftButtonActive={true}
            buttonState={buttonState}
          />
        </View>

        <View
          style={{
            borderRadius: 24,
            backgroundColor: 'white',
            width: '100%',
            padding: 20,
          }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trust Badges</Text>
          </View>
          <TrustBadges userId={friendId} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lending History</Text>
          </View>
          <View style={styles.lendingHistoryContainer}>
            <View style={styles.lendingHistoryItem}>
              <Text style={styles.lendingHistoryValue}>
                {reputationData?.loansFunded ?? 0}
              </Text>
              <Text style={styles.lendingHistoryLabel}>Loans Funded</Text>
            </View>
            <View style={styles.lendingHistoryItem}>
              <Text style={styles.lendingHistoryValue}>
                {reputationData?.loansRepaid ?? 0}
              </Text>
              <Text style={styles.lendingHistoryLabel}>Loans Repaid</Text>
            </View>
            <View style={styles.lendingHistoryItem}>
              <Text style={styles.lendingHistoryValue}>
                {reputationData?.onTimePaymentRate != null
                  ? `${Math.round(reputationData.onTimePaymentRate)}%`
                  : '0%'}
              </Text>
              <Text style={styles.lendingHistoryLabel}>On-Time Rate</Text>
            </View>
          </View>

          <Pressable
            style={styles.endorsementButton}
            onPress={() => navigation.navigate('Endorsements', {userId: friendId})}>
            <Text style={styles.endorsementButtonText}>Write Endorsement</Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 16,
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
        </View>
      </ScrollView>
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
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
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
    marginHorizontal: 10,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary500,
  },
  lendingHistoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  lendingHistoryItem: {
    alignItems: 'center',
  },
  lendingHistoryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary500,
  },
  lendingHistoryLabel: {
    fontSize: 12,
    color: GlobalStyles.Colors.accent300,
    marginTop: 4,
  },
  endorsementButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 4,
  },
  endorsementButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
});
