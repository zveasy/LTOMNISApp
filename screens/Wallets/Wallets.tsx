import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';

const Wallets = () => {
  const [wallet, setWallet] = useState({ tokenBalance: [] });
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/get/wallets`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        const data = response.data;
        console.log('user Data', data);
        setWallet(data.walletObject);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [token.token]); // Dependency on the token.token for re-fetching when it changes

  // Assuming the API returns the amount in a format suitable for display
  const renderBalances = () =>
    wallet.tokenBalance.map((token, index) => (
      <View key={index} style={styles.balanceContainer}>
        <Text style={styles.amountText}>{token.amount}</Text>
        <Text style={styles.currencyText}>{token.name}</Text>
      </View>
    ));

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle title="Wallet" showBackArrow={true} />
      <View style={styles.container}>
        <View style={styles.grayCard}>
          {renderBalances()}
          <Image
            source={require('../../assets/transparent.png')} // Replace with your actual logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  container: {
    alignItems: 'center',
    padding: 10,
  },
  grayCard: {
    backgroundColor: '#F2F2F5',
    width: Dimensions.get('window').width - 30,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  balanceContainer: {
    marginBottom: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  currencyText: {
    fontSize: 16,
    color: '#000',
  },
  logo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
  },
});

export default Wallets;
