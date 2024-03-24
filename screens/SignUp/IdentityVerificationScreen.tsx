import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {link} from 'fs';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {
  LinkExit,
  LinkSuccess,
  PlaidLink,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';
import {useDispatch, useSelector} from 'react-redux';
import {setLinkToken} from '../../actions';
import {user} from '../../assets/constants/user';
import {AppState} from '../../ReduxStore';
import {RootStackParamList} from '../../types';
import {usePlaidLink} from 'react-plaid-link';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import GlobalStyles from '../../assets/constants/colors';

type IdentityVerificationScreenRouteParams = {
  linkToken: string;
};

type IdentityVerificationScreenProps = {
  route: RouteProp<RootStackParamList, 'IdentityVerificationScreen'>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'IdentityVerificationScreen'
  >;
};

const IdentityVerificationScreen: React.FC<IdentityVerificationScreenProps> = ({
  route,
}) => {
  const token = useSelector((state: AppState) => state.token);
  const linkToken = useSelector((state: AppState) => state.linkToken);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const onSuccess = async (success: LinkSuccess) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/omnis/identity_verification',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            linkToken: success.metadata.linkSessionId,
          }),
        },
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.user.firstName) {
        navigation.navigate('SplashScreen');
        setTimeout(() => {
          navigation.navigate('CreateAuthLink');
        }, 3000);
      } else {
        console.log('firstName not found in response');
      }
    } catch (error) {
      console.error('Error in Plaid Link onSuccess:', error);
    }
  };

  const onExit = (linkExit: LinkExit) => {
    supportHandler.report({
      error: linkExit.error,
      institution: linkExit.metadata.institution,
      linkSessionId: linkExit.metadata.linkSessionId,
      requestId: linkExitlinkExit.metadata.requestId,
      status: linkExit.metadata.status,
    });
  };

  usePlaidEmitter(event => {
    console.log(event);
  });

  return (
    <View style={styles.container}>
      {linkToken ? (
        <PlaidLink
          tokenConfig={{
            token: linkToken.LinkToken,
          }}
          onSuccess={onSuccess}
          onExit={onExit}
          style={styles.plaidLink}>
          <View style={styles.plaidLink}>
            <Text style={styles.buttonText}>Finish Verification</Text>
          </View>
        </PlaidLink>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800, // Set background color
  },
  plaidLink: {
    backgroundColor: GlobalStyles.Colors.primary200, // Button background color
    borderRadius: 5, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    color: 'white', // Button text color
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white', // Loading text color
    fontSize: 16,
  },
});

export default IdentityVerificationScreen;
