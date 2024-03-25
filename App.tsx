/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import i18n from './screens/SelectLanguage/i18n';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import NFCDone from './screens/NFC/NFCDone';
import RegisterScreen from './screens/SignIn/RegisterScreen';
import OnboardingScreen1 from './screens/onboarding/OnboardingScreen1';
import HomeScreen from './screens/HomeScreen';
import NFCFaceId from './screens/NFC/NFCFaceId';
import SignInScreen from './screens/SignIn/SignInScreen';
import ForgotPassword from './screens/auth/ForgotPassword';
import Verification from './screens/auth/Verification';
import CreateNewPassword from './screens/auth/CreateNewPassword';
import OnboardingScreen4 from './screens/onboarding/OnboardingScreen4';
import OnboardingScreen3 from './screens/onboarding/OnboardingScreen3';
import OnboardingScreen2 from './screens/onboarding/OnboardingScreen2';
import Tabs from './navigation/Tabs';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfferSent from './screens/MyFeed/Lender/OfferSent';
import TransactionHistoryDetails from './screens/TransactionHistory/TransactionHistoryDetails';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TransactionHistoryTax from './screens/TransactionHistory/TransactionHistoryTax';
import PlaidLinkButton from './PlaidAPI/PlaidLinkButton';
import CreditScoreDisplay from './PlaidAPI/creditScoreDisplay';
import WithdrawMoneyScreen from './screens/WithdrawMoney/WithdrawMoneyScreen';
import OnboardingManager from './screens/onboarding/OnboardingManager';
import LanguagesSettings from './screens/MyProfile/LanguagesSettings';
import SelectLang from './screens/onboarding/SelectLang';
import {
  RootStackParamList,
  HomeStackNavigatorProps,
  FeedStackNavigatorProps,
  SpotlightStackNavigatorProps,
  OMNISScoreStackNavigatorProps,
} from './types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import OfferTransactionHistory from './screens/NewOffers/Borrower/ClosedOffers/OfferTransactionHistory';
import IdentityVerificationScreen from './screens/SignUp/IdentityVerificationScreen';
import OfferScreenLender from './screens/NewOffers/Lender/OfferScreenLender';
import ActiveOfferDetails from './screens/NewOffers/Lender/SentOffers/ActiveOfferDetails';
import ActiveOfferLenderDetails from './screens/NewOffers/Lender/ActiveOffersLenders/ActiveOfferLenderDetails';
import ClosedOfferGiftAccepted from './screens/NewOffers/Lender/ClosedOfferLenders/ClosedOfferGiftAccepted';
import LoanDetailsScreen from './screens/NewOffers/Borrower/ActiveOffers/LoanDetailsScreen';
import MyFeedScreen from './screens/MyFeed/MyFeedScreen';
import PostDetails from './screens/MyFeed/Lender/PostDetails';
import PostOffer from './screens/MyFeed/Lender/PostOffer';
import FeedSummary from './screens/MyFeed/Borrower/FeedSummary';
import OfferSentSuccessful from './screens/MyFeed/OfferSentSuccessful';
import FriendsProfile from './screens/FriendsProfile/FriendsProfile';
import LevelsScreen from './screens/OMNISScore/ScoreBreakDown/Levels/LevelsScreen';
import SpotlightScreen from './screens/Spotlight/SpotlightScreen';
import OfferScreen from './screens/NewOffers/Borrower/NewOffersBorrower/OfferScreen';
import NewOfferDetails from './screens/NewOffers/Borrower/NewOffersBorrower/NewOfferDetails';
import ChoosePaymentPlanScreen from './screens/NewOffers/Borrower/NewOffersBorrower/ChoosePaymentPlanScreen';
import PaymentChosenScreen from './screens/NewOffers/Borrower/NewOffersBorrower/PaymentChosenScreen';
import SuccessOffer from './screens/NewOffers/Borrower/NewOffersBorrower/SuccessOffer';
import ActiveOfferMakePayment from './screens/NewOffers/Borrower/ActiveOffers/ActiveOfferMakePayment';
import OfferDetailsAccepted from './screens/NewOffers/Borrower/ClosedOffers/OfferDetailsAccepted';
import store, {Friend} from './ReduxStore';
import OMNISScoreScreen from './screens/OMNISScore/OMNISScoreScreen';
import GroupsScreen from './screens/Spotlight/Groups/GroupsScreen';
import FriendsScreen from './screens/Spotlight/Friends/FriendsScreen';
import NotificationScreen from './screens/Notification/NotificationScreen';
import MyProfile from './screens/MyProfile/MyProfile';
import AddFriendScreen from './screens/Spotlight/Friends/AddFriendScreen';
import FAQ from './screens/HelpCenter/FAQ';
import Settings from './screens/MyProfile/Settings';
import DeactivateAccount from './screens/MyProfile/DeactivateAccount';
import PrivacyPolicy from './screens/MyProfile/PrivacyPolicy';
import EditProfile from './screens/MyProfile/EditProfile';
import AppFeedBack from './screens/MyProfile/AppFeedBack';
import DepositMoneyScreen from './screens/DepositMoney/DepositMoneyScreen';
import BeforeYouGo from './screens/DeactivateAccount/BeforeYouGo';
import BeforeYouGoAgain from './screens/DeactivateAccount/BeforeYouGoAgain';
import PostOfferSummary from './screens/MyFeed/Borrower/PostOfferSummary';
import PostEdit from './screens/MyFeed/Borrower/PostEdit';
import ChooseFriends from './screens/Spotlight/Friends/ChooseFriends';
import GroupBill from './screens/Spotlight/Groups/GroupBill';
import GroupDetailsHistoryScreen from './screens/Spotlight/Groups/GroupDetailsHistoryScreen';
import GroupDetailsScreen from './screens/Spotlight/Groups/GroupDetailsScreen';
import MakeAGroupScreen from './screens/Spotlight/Groups/MakeAGroupScreen';
import PaymentStatus from './screens/Spotlight/PaymentStatus';
import ScoreBreakDown from './screens/OMNISScore/ScoreBreakDown/ScoreBreakDown';
import AllPosts from './screens/MyFeed/AllPosts';
import CreateLinkToken from './screens/SignUp/CreateLinkToken';
import PaymentPlanBoxChangePlan from './assets/constants/Components/PaymentPlanBoxChangePlan';
import MyPosts from './screens/MyFeed/MyPosts';
import NewOffersLender from './screens/NewOffers/Lender/SentOffers/NewOffersLender';
import Auth from './screens/SignUp/Auth';
import CreateAuthLink from './screens/SignUp/CreateAuthLink';

type MainStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const CombinedStack = createNativeStackNavigator<RootStackParamList>();
const SpotlightStack = createNativeStackNavigator();
const OMNISScoreStack = createNativeStackNavigator();

let value: unknown;
// If you are sure value is a string
let stringValue = value as string;

// Combined Stack Navigator
function CombinedStackNavigator() {
  return (
    <CombinedStack.Navigator screenOptions={{headerShown: false}}>
      {/* Onboarding Screens */}
      <CombinedStack.Screen name="SplashScreen" component={SplashScreen} />
      <CombinedStack.Screen name="SelectLang" component={SelectLang} />
      <CombinedStack.Screen
        name="OnboardingManager"
        component={OnboardingManager}
      />
      <CombinedStack.Screen
        name="OnboardingScreen1"
        component={OnboardingScreen1}
      />
      <CombinedStack.Screen
        name="OnboardingScreen2"
        component={OnboardingScreen2}
      />
      <CombinedStack.Screen
        name="OnboardingScreen3"
        component={OnboardingScreen3}
      />
      <CombinedStack.Screen
        name="OnboardingScreen4"
        component={OnboardingScreen4}
      />

      <CombinedStack.Screen name="SignInScreen" component={SignInScreen} />
      <CombinedStack.Screen name="RegisterScreen" component={RegisterScreen} />
      <CombinedStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <CombinedStack.Screen name="Verification" component={Verification} />
      <CombinedStack.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
      />
      <CombinedStack.Screen name="PlaidLink" component={PlaidLinkButton} />
      <CombinedStack.Screen
        name="IdentityVerificationScreen"
        component={IdentityVerificationScreen}
      />
      <CombinedStack.Screen
        name="Auth"
        component={Auth}
      />
      <CombinedStack.Screen
        name="CreditScoreDisplay"
        component={CreditScoreDisplay}
      />
      <CombinedStack.Screen
        name="CreateLinkToken"
        component={CreateLinkToken}
      />
      <CombinedStack.Screen
        name="CreateAuthLink"
        component={CreateAuthLink}
      />
      <CombinedStack.Screen
        name="MainStackNavigator"
        component={MainStackNavigator}
      />
    </CombinedStack.Navigator>
  );
}

export type MainStackParamList = {
  Tabs: undefined;
};

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="Tabs" component={Tabs} />
    </MainStack.Navigator>
  );
}

const App = () => {
  const [hasViewedOnboarding, setHasViewedOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Check onboarding status
      const viewedOnboarding = await AsyncStorage.getItem(
        'hasViewedOnboarding',
      );
      setHasViewedOnboarding(viewedOnboarding === 'true');

      // Check authentication status
      const userToken = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!userToken);
    };

    initializeApp();
  }, []);

  // Determine which navigator to show
  let RootNavigator;
  if (!hasViewedOnboarding) {
    RootNavigator = CombinedStackNavigator;
  } else if (isAuthenticated) {
    RootNavigator = MainStackNavigator;
  } else {
    RootNavigator = SignInScreen; // Or any other initial screen for unauthenticated users
  }

  const onOnboardingFinish = async () => {
    await AsyncStorage.setItem('hasViewedOnboarding', 'true');
    setHasViewedOnboarding(true);
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="RootNavigator" component={RootNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function Root() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <App />
      </GestureHandlerRootView>
    </Provider>
  );
}

export {App};

export type HomeStackParamList = {
  HomeScreen: undefined;
  TransactionHistoryDetails: {transactionId: string};
  TransactionHistoryTax: {transactionId: string};
  OfferScreenLender: undefined;
  OfferTransactionHistory: undefined;
  DepositMoneyScreen: undefined;
  WithdrawMoneyScreen: undefined;
  ClosedOfferGiftAccepted: undefined;
  LoanDetailsScreen: undefined;
  OfferScreen: undefined;
  ChoosePaymentPlanScreen: {
    offerId: string;
    interestPercentage: number;
    totalAmount: number;
    postCurrentAmount?: number;
    postTotalAmount?: number;
    totalWithInterest?: number;
    firstName: string;
    lastName: string;
  };
  PaymentChosenScreen: {
    offerId: string;
    interestPercentage: number;
    term: number;
    monthlyPayment: number;
    postCurrentAmount?: number;
    postTotalAmount?: number;
    totalWithInterest?: number;
    firstName: string;
    lastName: string;
  };
  OfferSentSuccessful: undefined;
  SuccessOffer: {
    offerId: string;
    firstName: string;
    lastName: string;
    postCurrentAmount: number;
    postTotalAmount: number;
    totalWithInterest: number;
    interestPercentage: number;
    monthlyPayment: number;
    monthDuration: number;
    fullNumber: number;
  };
  ActiveOfferMakePayment: undefined;
  OfferDetailsAccepted: undefined;
  NotificationScreen: undefined;
  MyProfile: undefined;
  FriendsProfile: {
    id: string;
  };
  FAQ: undefined;
  Settings: undefined;
  LanguagesSettings: undefined;
  DeactivateAccount: undefined;
  PrivacyPolicy: undefined;
  EditProfile: undefined;
  AppFeedBack: undefined;
  BeforeYouGo: undefined;
  PaymentPlanBoxChangePlan: undefined;
  BeforeYouGoAgain: undefined;
  ActiveOfferDetails: {
    offerId: string;
  };
  ActiveOfferLenderDetails: {
    offerId: string;
  };
  NewOfferDetails: {
    offerId: string;
    firstName: string;
    lastName: string;
    totalAmount: number;
    interestPercentage: number;
    avatar?: string;
    currentAmount: number;
    postTotalAmount: number;
    postCurrentAmount: number;
  };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator({}: HomeStackNavigatorProps) {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen
        name="WithdrawMoneyScreen"
        component={WithdrawMoneyScreen}
      />
      <HomeStack.Screen
        name="OfferTransactionHistory"
        component={OfferTransactionHistory}
      />
      <HomeStack.Screen
        name="OfferScreenLender"
        component={OfferScreenLender}
      />
      <HomeStack.Screen
        name="ActiveOfferDetails"
        component={ActiveOfferDetails}
      />
      <HomeStack.Screen
        name="ActiveOfferLenderDetails"
        component={ActiveOfferLenderDetails}
      />
      <HomeStack.Screen
        name="ClosedOfferGiftAccepted"
        component={ClosedOfferGiftAccepted}
      />
      <HomeStack.Screen
        name="TransactionHistoryDetails"
        component={TransactionHistoryDetails}
      />
      <HomeStack.Screen
        name="TransactionHistoryTax"
        component={TransactionHistoryTax}
      />
      <HomeStack.Screen
        name="LoanDetailsScreen"
        component={LoanDetailsScreen}
      />
      <HomeStack.Screen name="OfferScreen" component={OfferScreen} />
      <HomeStack.Screen name="NewOfferDetails" component={NewOfferDetails} />
      <HomeStack.Screen
        name="ChoosePaymentPlanScreen"
        component={ChoosePaymentPlanScreen}
      />
      <HomeStack.Screen
        name="PaymentChosenScreen"
        component={PaymentChosenScreen}
      />
      <HomeStack.Screen
        name="OfferSentSuccessful"
        component={OfferSentSuccessful}
      />
      <HomeStack.Screen name="SuccessOffer" component={SuccessOffer} />
      <HomeStack.Screen
        name="ActiveOfferMakePayment"
        component={ActiveOfferMakePayment}
      />
      <HomeStack.Screen
        name="OfferDetailsAccepted"
        component={OfferDetailsAccepted}
      />
      <HomeStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <HomeStack.Screen name="MyProfile" component={MyProfile} />
      <HomeStack.Screen name="FAQ" component={FAQ} />
      <HomeStack.Screen name="Settings" component={Settings} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen
        name="LanguagesSettings"
        component={LanguagesSettings}
      />
      <HomeStack.Screen
        name="DeactivateAccount"
        component={DeactivateAccount}
      />
      <HomeStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <HomeStack.Screen name="AppFeedBack" component={AppFeedBack} />
      <HomeStack.Screen
        name="DepositMoneyScreen"
        component={DepositMoneyScreen}
      />
      <HomeStack.Screen name="BeforeYouGo" component={BeforeYouGo} />
      <HomeStack.Screen name="NewOffersLender" component={NewOffersLender} />
      <HomeStack.Screen name="BeforeYouGoAgain" component={BeforeYouGoAgain} />
      <HomeStack.Screen
        name="PaymentPlanBoxChangePlan"
        component={PaymentPlanBoxChangePlan}
      />
    </HomeStack.Navigator>
  );
}

//  Feed Screen

export type FeedStackParamList = {
  MyFeedScreen: undefined;
  PostDetails: undefined;
  PostOffer: undefined;
  OfferSent: undefined;
  OfferSentSuccessful: undefined;
  FriendsProfile: undefined;
  SpotlightScreen: undefined;
  SpotlightStackNavigator: undefined;
  PostOfferSummary: undefined;
  PostEdit: undefined;
  FeedSummary: undefined;
  AllPosts: undefined;
};

export function FeedStackNavigator({}: FeedStackNavigatorProps) {
  return (
    <FeedStack.Navigator
      initialRouteName="MyFeedScreen"
      screenOptions={{headerShown: false}}>
      <FeedStack.Screen name="MyFeedScreen" component={MyFeedScreen} />
      <FeedStack.Screen name="PostDetails" component={PostDetails} />
      <FeedStack.Screen name="PostOffer" component={PostOffer} />
      <FeedStack.Screen name="OfferSent" component={OfferSent} />
      <FeedStack.Screen name="FriendsProfile" component={FriendsProfile} />
      <FeedStack.Screen
        name="SpotlightStackNavigator"
        component={SpotlightStackNavigator}
      />
      <FeedStack.Screen
        name="OfferSentSuccessful"
        component={OfferSentSuccessful}
      />
      <FeedStack.Screen name="PostOfferSummary" component={PostOfferSummary} />
      <FeedStack.Screen name="PostEdit" component={PostEdit} />
      <FeedStack.Screen name="FeedSummary" component={FeedSummary} />
      <FeedStack.Screen name="AllPosts" component={AllPosts} />
    </FeedStack.Navigator>
  );
}

// OMNIS SCORE Navigation Stack

export type OMNISScoreStackParamList = {
  OMNISScoreScreen: undefined;
  LevelsScreen: undefined;
  ScoreBreakDown: undefined;
};

export function OMNISScoreStackNavigator({}: OMNISScoreStackNavigatorProps) {
  return (
    <OMNISScoreStack.Navigator
      initialRouteName="OMNISScoreScreen"
      screenOptions={{headerShown: false}}>
      <OMNISScoreStack.Screen
        name="OMNISScoreScreen"
        component={OMNISScoreScreen}
      />
      <OMNISScoreStack.Screen name="LevelsScreen" component={LevelsScreen} />
      <OMNISScoreStack.Screen
        name="ScoreBreakDown"
        component={ScoreBreakDown}
      />
    </OMNISScoreStack.Navigator>
  );
}

export type SpotlightStackParamList = {
  SpotlightStackNavigator: undefined;
  PostDetails: undefined;
  PostOffer: undefined;
  FeedSummary: undefined;
  OfferSent: undefined;
  OfferSentSuccessful: undefined;
  FriendsProfile: {
    from: string;
  };
  SpotlightScreen: undefined;
  GroupsScreen: undefined;
  FriendsScreen: undefined;
  AddFriendScreen: undefined;
  ChooseFriends: undefined;
  GroupBill: undefined;
  GroupDetailsHistoryScreen: undefined;
  GroupDetailsScreen: undefined;
  MakeAGroupScreen: undefined;
  PaymentStatus: undefined;
};

export function SpotlightStackNavigator({}: SpotlightStackNavigatorProps) {
  return (
    <SpotlightStack.Navigator
      initialRouteName="SpotlightScreen"
      screenOptions={{headerShown: false}}>
      <SpotlightStack.Screen
        name="SpotlightScreen"
        component={SpotlightScreen}
      />
      <SpotlightStack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
      />
      <SpotlightStack.Screen name="ChooseFriends" component={ChooseFriends} />
      <SpotlightStack.Screen name="GroupBill" component={GroupBill} />
      <SpotlightStack.Screen
        name="GroupDetailsHistoryScreen"
        component={GroupDetailsHistoryScreen}
      />
      <SpotlightStack.Screen
        name="GroupDetailsScreen"
        component={GroupDetailsScreen}
      />
      <SpotlightStack.Screen
        name="MakeAGroupScreen"
        component={MakeAGroupScreen}
      />
      <SpotlightStack.Screen name="PostDetails" component={PostDetails} />
      <SpotlightStack.Screen name="PostOffer" component={PostOffer} />
      <SpotlightStack.Screen name="FeedSummary" component={FeedSummary} />
      <SpotlightStack.Screen name="OfferSent" component={OfferSent} />
      <SpotlightStack.Screen name="FriendsProfile" component={FriendsProfile} />
      <SpotlightStack.Screen name="GroupsScreen" component={GroupsScreen} />
      <SpotlightStack.Screen name="FriendsScreen" component={FriendsScreen} />
      <SpotlightStack.Screen
        name="OfferSentSuccessful"
        component={OfferSentSuccessful}
      />
      <SpotlightStack.Screen name="PaymentStatus" component={PaymentStatus} />
    </SpotlightStack.Navigator>
  );
}
