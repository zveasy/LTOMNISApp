import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SwipeableOnboardingContainer from '../screens/Onboarding/SwipeableOnboardingContainer';
import MessagesWidgetSettingsScreen from '../screens/Onboarding/MessagesWidgetSettingsScreen';
import HowItWorksScreen from '../screens/Onboarding/HowItWorksScreen';

export type MessagesOnboardingStackParamList = {
  MessagesIntro: undefined;
  MessagesSteps: undefined;
  MessagesLaunch: undefined;
  MessagesWidgetSettings: undefined;
  HowItWorks: undefined;
};

const Stack = createNativeStackNavigator<MessagesOnboardingStackParamList>();

const MessagesOnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MessagesIntro" component={SwipeableOnboardingContainer} />
      <Stack.Screen 
        name="MessagesWidgetSettings" 
        component={MessagesWidgetSettingsScreen} 
      />
      <Stack.Screen 
        name="HowItWorks" 
        component={HowItWorksScreen} 
      />
    </Stack.Navigator>
  );
};

export default MessagesOnboardingNavigator;
