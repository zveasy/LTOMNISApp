import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AppState, setUserId} from '../../ReduxStore';
import GlobalStyles from '../../assets/constants/colors';
import PlaidLink, {
  LinkExit,
  LinkSuccess,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

const Auth = () => {
  const token = useSelector((state: AppState) => state.token);
  const publicToken = useSelector((state: AppState) => state.authToken);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const userId = useSelector((state: AppState) => state.user.userId);

  console.log('this is an ID in Auth', userId);

  console.log('Auth Token on Auth 1', publicToken);

  const onSuccess = async (success: LinkSuccess) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/omnis/token/public_exchange/get_products',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicToken: success.publicToken,
          }),
        },
      );

      const data = await response.json();

      console.log('This is the response data on Auth: ', data);

      navigation.navigate('SplashScreen');
      setTimeout(() => {
        navigation.navigate('MainStackNavigator');
      }, 3000);
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

  console.log('Auth Token on Auth 2', publicToken);

  return (
    <View style={styles.container}>
      {publicToken ? (
        <PlaidLink
          tokenConfig={{
            token: publicToken.authToken,
          }}
          onSuccess={onSuccess}
          onExit={onExit}
          style={styles.plaidLink}>
          <View style={styles.plaidLink}>
            <Text style={styles.buttonText}>Connect Account</Text>
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

export default Auth;
