import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { AppState } from '../../ReduxStore';
import { useSelector } from 'react-redux';

const Wallets = () => {
  const [wallet, setWallet] = useState();
  // /omnis/get/wallets
  const token = useSelector((state: AppState) => state.token);

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
        setWallet(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  console.log('this is a wallet data', wallet)

  return (
    <View>
      <Text>Wallets</Text>
      <Text></Text>
    </View>
  );
};

export default Wallets;
