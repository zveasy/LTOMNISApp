import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import PlaidLink, {
  LinkSuccess,
  LinkExit,
  LinkIOSPresentationStyle,
} from 'react-native-plaid-link-sdk';
import usePlaidLink from 'react-native-plaid-link-sdk';

const PlaidLinkButton = ({navigation}: any) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const createLinkToken = useCallback(async () => {
    try {
      const response = await fetch(
        'https://js.lucidtrades.com/api/omnis/link_token/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({clientUserId: 'your-client-user-id'}), // Replace with your client user id
        },
      );
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
    }
  }, []);

  useEffect(() => {
    if (!linkToken) {
      createLinkToken();
    }
  }, [linkToken, createLinkToken]);

  const handleSuccess = async (success: LinkSuccess) => {
    try {
      await fetch(
        'https://js.lucidtrades.com/api/omnis/token/public_exchange/get_products',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicToken: success.publicToken,
            id: 'your-id',
          }), // Replace with your id
        },
      );
      navigation.navigate('/displayScore');
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };

  const handleExit = (exit: LinkExit) => {
    console.log('Link exit:', exit);
  };

  return (
    <SafeAreaView style={styles.container}>
      {linkToken && (
        <PlaidLink
          tokenConfig={{
            token: linkToken,
            noLoadingState: false,
          }}
          onSuccess={handleSuccess}
          onExit={handleExit}
          iOSPresentationStyle={LinkIOSPresentationStyle.MODAL} // Use the enum value directly
        >
          <Text>Add Account</Text>
        </PlaidLink>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your container styles here
  },
  button: {
    // Add your button styles here
  },
  buttonText: {
    // Add your button text styles here
  },
});

export default PlaidLinkButton;
