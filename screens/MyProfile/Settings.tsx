import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Touchable,
} from 'react-native';
import React from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import RowWithArrow from './RowWithArrow';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Settings() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title="Settings" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'LanguagesSettings',
          });
        }}>
        <RowWithArrow title="Language" />
      </TouchableOpacity>
      <Pressable
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'NotificationScreen',
          });
        }}>
        <RowWithArrow title="Notifications" />
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'PrivacyPolicy',
          });
        }}>
        <RowWithArrow title="Privacy Policy" />
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'DeactivateAccount',
          });
        }}>
        <RowWithArrow title="Deactivate Account" />
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'AppFeedBack',
          });
        }}>
        <RowWithArrow title="App Feedback" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#1E1E1E',
  },
});
