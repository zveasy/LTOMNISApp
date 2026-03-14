import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import React from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import RowWithArrow from './RowWithArrow';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {removeToken} from '../../ReduxStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../assets/constants/colors';

export default function Settings() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    dispatch(removeToken());
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('hasViewedOnboarding');
    navigation.reset({
      index: 0,
      routes: [{name: 'SignInScreen'}],
    });
  };

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
      <Pressable
        onPress={() => {
          navigation.navigate('HomeStackNavigator', {
            screen: 'DetectionSettings',
          });
        }}>
        <RowWithArrow title="Payment Detection" />
      </Pressable>
      <Pressable onPress={handleSignOut}>
        <View style={styles.signOutRow}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </View>
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
  signOutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    width: '98%',
    paddingHorizontal: 16,
  },
  signOutText: {
    fontSize: 18,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary300,
  },
});
