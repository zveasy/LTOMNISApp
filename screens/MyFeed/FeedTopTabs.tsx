import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GlobalStyles from '../../assets/constants/colors';
import Verification from '../auth/Verification';
import SplashScreen from '../SplashScreen/SplashScreen';
import OnboardingScreen3 from '../onboarding/OnboardingScreen3';
import OnboardingScreen4 from '../onboarding/OnboardingScreen4';
import Featured from './Featured';
import MyPosts from './MyPosts';
import FriendsFeed from './FriendsFeed';
import HomeScreen from '../HomeScreen';
import AllPosts from './AllPosts';

const Tab = createMaterialTopTabNavigator();

export default function FeedTopTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {borderTopLeftRadius: 24, borderTopRightRadius: 24}, // set this to your preferred tab bar background color
        tabBarIndicatorStyle: {
          backgroundColor: GlobalStyles.Colors.primary200,
          height: 2,
          alignSelf: 'center',
        },
      }}>
      <Tab.Screen
        options={{title: 'Featured'}}
        name="Featured"
        component={Featured}
      />
      <Tab.Screen
        options={{title: 'All'}}
        name="AllPosts"
        component={AllPosts}
      />
      <Tab.Screen
        options={{title: 'Friends'}}
        name="FriendsFeed"
        component={FriendsFeed}
      />
      <Tab.Screen
        options={{title: 'My posts'}}
        name="MyPosts"
        component={MyPosts}
        initialParams={{ fromMyPosts: true }}
      />
    </Tab.Navigator>
  );
}
