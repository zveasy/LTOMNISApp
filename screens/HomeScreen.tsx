import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  NativeModules,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Avatar, Divider} from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../assets/constants/colors';
import GlobalFonts from '../assets/constants/fonts';
import TransactionHistory from '../assets/constants/Components/CustomTransactionButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {hideTabBar, showTabBar} from '../tabBarSlice';
import {AppState, setFirstName, setLastName, setUserId} from '../ReduxStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
// import { hideTabBar, showTabBar } from '../appReducer';

const getScoreColor = (score: number): string => {
  if (score < 35) return '#E53935';
  if (score < 50) return '#FDD835';
  if (score < 70) return '#43A047';
  return GlobalStyles.Colors.primary200;
};

export default function HomeScreen({}: {}) {
  const [balance, setBalance] = useState('0.00'); // Default balance
  const [omnisScore, setOmnisScore] = useState(0);
  const [trustTier, setTrustTier] = useState(1);
  const [OfferSent, setOfferSent] = useState(0);
  const [AcceptedOffers, setAcceptedOffers] = useState(0);
  const [OffersAccepted, setOffersAccepted] = useState(0);
  const [NewOffers, setNewOffers] = useState(5);
  const [borrowerAcceptedOffers, setBorrowerAcceptedOffers] = useState(0);
  const [borrowerNewOffers, setBorrowerNewOffers] = useState(0);
  const [lenderAcceptedOffers, setLenderAcceptedOffers] = useState(0);
  const [lenderNumOfOffersSent, setLenderNumOfOffersSent] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0); // Example count
  const [refreshing, setRefreshing] = useState(false);

  const firstName = useSelector((state: AppState) => state.userFirstLast.firstName) 
  const lastName = useSelector((state: AppState) => state.userFirstLast.lastName) 

  // borrowerNewOffers

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const token = useSelector((state: AppState) => state.token);

  const userId = useSelector((state: AppState) => state.user.userId);

  const dispatch = useDispatch();
  dispatch(setUserId(userId));

  // Example of dispatching an action
  const updateUserId = (newId: string) => {
    dispatch(setUserId(newId));
  };

  const handlePaymentMethods = () => {
    navigation.navigate('ManagePaymentMethods');
  };

  const handleCreditDashboard = () => {
    navigation.navigate('CreditDashboard');
  };

  const handleTransaction = () => {
    console.log('Transaction button pressed');
    navigation.navigate('TransactionHistoryTax', {
      transactionId: 'YOUR_TRANSACTION_ID',
    });
  };

  const handleLender = () => {
    console.log('Transaction button pressed');
    navigation.navigate('OfferScreenLender');
  };

  const handleNotifications = () => {
    console.log('NotificationScreen button pressed');
    navigation.navigate('NotificationScreen');
  };

  const handleProfileScreen = () => {
    console.log('MyProfile button pressed');
    navigation.navigate('MyProfile');
  };

  const handleBorrower = () => {
    console.log('Transaction button pressed');
    navigation.navigate('OfferScreen');
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/omnis/user/homefeed`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

        const userData = response.data;
        console.log('user Data', userData);
        console.log('this is L NativeModules', firstName);
        dispatch(setFirstName(userData.homeFeedObject.user.firstName));
        console.log('this is everything:: ', firstName);
        dispatch(setLastName(userData.homeFeedObject.user.lastName));
        setBalance(userData.homeFeedObject.user.balance);
        setOffersAccepted(userData.homeFeedObject.offersAccepted);
        setNewOffers(userData.homeFeedObject.newOffers);
        setBorrowerAcceptedOffers(
          userData.homeFeedObject.borrowerAcceptedOffers,
        );
        setBorrowerNewOffers(userData.homeFeedObject.borrowerNewOffers);
        setLenderAcceptedOffers(userData.homeFeedObject.lenderAcceptedOffers);
        setLenderNumOfOffersSent(userData.homeFeedObject.lenderNumOfOffersSent);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load home data. Pull to refresh.');
      }
    }, []); // Add any dependencies if needed

    const fetchScore = useCallback(async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/omnis/score`, {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        setOmnisScore(response.data?.score ?? 0);
        setTrustTier(response.data?.tier ?? 1);
      } catch (error) {
        console.error('Error fetching score:', error);
      }
    }, []);
  
    useEffect(() => {
      fetchUserData();
      fetchScore();
    }, [fetchUserData, fetchScore]);
  
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        await Promise.all([fetchUserData(), fetchScore()]);
      } catch (error) {
        console.error('Error on refresh:', error);
      } finally {
        setRefreshing(false);
      }
    }, [fetchUserData, fetchScore]);
  
  console.log('This is After the First UseEffect');

  console.log('this home firstName', firstName)
  console.log('this home firstName', firstName)

  const scoreColor = getScoreColor(omnisScore);

  const NotificationIcon = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Pressable onPress={handleNotifications}>
          <IonIcon
            name="notifications-outline"
            size={24}
            color={GlobalStyles.Colors.primary100}
          />
        </Pressable>
        {notificationCount > 0 && (
          <View style={styles.notificationBubble}>
            <Text style={styles.notificationText}>{notificationCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E',}}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center',flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
      <View style={styles.headerContainer}>
        <Pressable onPress={handleProfileScreen} style={{flexDirection: 'row'}} accessibilityLabel="Profile">
          <Avatar
            size={48}
            rounded
            source={{
              uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
            }}
          />
          <Text
            style={styles.NameHeaderText}>{`${firstName} ${lastName}`}</Text>
        </Pressable>
        <Pressable onPress={handleNotifications} accessibilityLabel="Notifications">
          <NotificationIcon />
        </Pressable>
      </View>

      {/* OMNIS Credit Score */}

      <View style={styles.scoreSection}>
        <Text style={styles.LoanTitle}>OMNIS Credit Score</Text>
        <View style={[styles.scoreCircle, {borderColor: scoreColor}]}>
          <Text style={[styles.scoreNumber, {color: scoreColor}]}>{omnisScore}</Text>
        </View>
        <View style={styles.tierBadge}>
          <IonIcon name="shield-checkmark-outline" size={16} color={GlobalStyles.Colors.primary200} />
          <Text style={styles.tierText}>Tier {trustTier}</Text>
        </View>
      </View>

      {/* Payment Methods & Credit Dashboard */}

      <View style={styles.headerContainer}>
        <Pressable
          onPress={handlePaymentMethods}
          style={styles.DepositWithdrawContainer}
          accessibilityLabel="My Payment Methods"
          accessibilityRole="button">
          <IonIcon
            name="wallet-outline"
            size={22}
            style={{alignSelf: 'center'}}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.DepositWithdrawText}>Payment Methods</Text>
        </Pressable>
        <Pressable
          onPress={handleCreditDashboard}
          style={styles.DepositWithdrawContainer}
          accessibilityLabel="Credit Dashboard"
          accessibilityRole="button">
          <IonIcon
            name="stats-chart-outline"
            size={22}
            style={{alignSelf: 'center'}}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.DepositWithdrawText}>Credit Dashboard</Text>
        </Pressable>
      </View>

      {/* Transaction History */}
      <TransactionHistory
        buttonText="View Transaction History"
        onPress={handleTransaction}
      />

      {/* Outline for ROLES */}

      <View
        style={{
          backgroundColor: GlobalStyles.Colors.primary100,
          width: '100%',
          flex: 1,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
        }}>
        <View style={styles.MyRoleContainer}>
          <Text style={styles.MyRoleText}>My Roles</Text>
        </View>

        {/* Lender */}

        <View style={styles.RoleContainer}>
          <View style={styles.RoleLabelContainer}>
            <Text style={styles.LenderBorrowerText}>Lender</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.TextInRoles}>Offers Sent</Text>
              <Divider orientation="vertical" width={1} />
              <Text style={styles.NumberInRoles}>{lenderNumOfOffersSent}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.TextInRoles}>Accepted Offers</Text>
              <Divider orientation="vertical" width={1} />
              <Text style={styles.NumberInRoles}>{lenderAcceptedOffers}</Text>
            </View>
          </View>
          <View style={styles.RoleButtonContainer}>
            <Pressable
              onPress={handleLender}
              accessibilityLabel="View Lender offers"
              style={{
                width: '40%',
                height: 40,
                backgroundColor: GlobalStyles.Colors.primary200,
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                marginBottom: 20,
                marginLeft: 60,
              }}>
              <Text style={styles.ViewButton}>View</Text>
            </Pressable>
          </View>
        </View>

        {/* Borrower */}

        <View style={styles.BorrowerRoleContainer}>
          <View style={styles.RoleLabelContainer}>
            <Text style={styles.LenderBorrowerText}>Borrower</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.TextInRoles}>Offers Accepted</Text>
              <Divider orientation="vertical" width={1} />
              <Text style={styles.NumberInRoles}>{borrowerAcceptedOffers}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.TextInRoles}>New Offers</Text>
              <Divider orientation="vertical" width={1} />
              <Text style={styles.NumberInRoles}>{borrowerNewOffers}</Text>
            </View>
          </View>
          <View style={styles.RoleButtonContainer}>
            <Pressable
              onPress={handleBorrower}
              accessibilityLabel="View Borrower offers"
              style={{
                width: '40%',
                height: 40,
                backgroundColor: GlobalStyles.Colors.primary200,
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                marginBottom: 20,
                marginLeft: 60,
              }}>
              <Text style={styles.ViewButton}>View</Text>
            </Pressable>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 40,
  },
  headerContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  NameHeaderText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    marginBottom: 4,
    alignSelf: 'center',
    marginLeft: 10,
  },
  subheaderText: {
    color: 'white',
    opacity: 0.6,
    fontSize: 13,
  },
  LoanTitle: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  LoanNumber: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 64,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlign: 'left',
    marginBottom: 8,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189,174,141,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  tierText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  emailButton: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  //   Reset Password styling
  SignButton: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 40,
  },
  SignButtonOutlined: {
    borderWidth: 2,
  },
  SignButtonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
  },

  // Additional TextInput Styling
  textInput: {
    color: 'rgba(255,255,255, 0.6)', // default color when there is no input
    fontSize: 16,
    paddingLeft: 10,
  },
  textActive: {
    color: 'white', // color when there is input
  },

  //   Deposit & Withdraw Styling
  DepositWithdrawContainer: {
    flexDirection: 'row',
    height: 56,
    alignSelf: 'center',
    backgroundColor: GlobalStyles.Colors.primary200,
    width: '45%',
    justifyContent: 'center',
    borderRadius: 16,
  },

  DepositWithdrawText: {
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 13,
    color: GlobalStyles.Colors.primary100,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: 'bold',
  },

  //   Transaction History

  TransactionHistoryContainer: {
    marginVertical: 16,
    marginBottom: 22,
    height: 44,
    flexDirection: 'row',
    width: '90%',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.accent115,
  },
  TransactionHistoryText: {
    alignSelf: 'center',
    fontSize: 16,
    marginLeft: 10,
    color: GlobalStyles.Colors.primary200,
  },

  //   ROLES

  MyRoleContainer: {
    marginTop: 20,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  MyRoleText: {
    fontSize: 24,
  },

  // Role Container

  RoleContainer: {
    height: 108,
    width: '90%',
    borderRadius: 20,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 16,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  RoleLabelContainer: {
    flexDirection: 'column',
    // backgroundColor: 'green',
    width: '50%',
    height: '100%',
  },
  RoleButtonContainer: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
  },

  //

  TextInRoles: {
    fontSize: 14,
    marginLeft: 16,
    marginRight: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.accent300,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },

  // Numbers inside Roles

  NumberInRoles: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.accent300,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },

  // View Button

  ViewButton: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: 'bold',
  },

  //   Borrower

  BorrowerRoleContainer: {
    height: 108,
    width: '90%',
    borderRadius: 20,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  LenderBorrowerText: {
    fontSize: 20,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 6,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },

  notificationBubble: {
    position: 'absolute',
    right: 20,
    bottom: -20,
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
  },
});
