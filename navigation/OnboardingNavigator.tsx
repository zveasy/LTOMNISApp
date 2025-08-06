import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessagesIntroScreen from '../screens/onboarding/MessagesIntroScreen';
import MessagesStepsScreen from '../screens/onboarding/MessagesStepsScreen';
import MessagesLaunchScreen from '../screens/onboarding/MessagesLaunchScreen';
import MessagesWidgetSettingsScreen from '../screens/onboarding/MessagesWidgetSettingsScreen';

export type OnboardingStackParamList = {
  MessagesIntro: undefined;
  MessagesSteps: undefined;
  MessagesLaunch: undefined;
  MessagesWidgetSettings: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MessagesIntro"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="MessagesIntro" component={MessagesIntroScreen} />
    <Stack.Screen name="MessagesSteps" component={MessagesStepsScreen} />
    <Stack.Screen name="MessagesLaunch" component={MessagesLaunchScreen} />
    <Stack.Screen
      name="MessagesWidgetSettings"
      component={MessagesWidgetSettingsScreen}
    />
  </Stack.Navigator>
);

export default OnboardingNavigator;
