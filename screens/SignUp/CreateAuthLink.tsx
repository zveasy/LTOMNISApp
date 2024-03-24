import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {setAuthToken, setLinkToken} from '../../actions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {AppState} from '../../ReduxStore';
import {link} from 'fs';
import axios from 'axios';

interface CreateAuthLinkProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'IdentityVerificationScreen'>;
}

const CreateAuthLink: React.FC<CreateAuthLinkProps> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const id = useSelector((state: AppState) => state.id.id);
  const linkToken = useSelector((state: AppState) => state.linkToken);
  const authToken = useSelector((state: AppState) => state.authToken);
  const token = useSelector((state: AppState) => state.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const createToken = async () => {
      setIsLoading(true);
      try {
        const options = {
          method: 'GET',
          url: 'http://localhost:8080/api/omnis/token/create/auth',
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        };
        const res = await axios(options);
        if (res.data) {
          console.log('this is new auth store!', res.data);
          dispatch(setAuthToken(res.data.linkToken)); // Set the post data with the data from the API.
        } else {
          console.log('No linkToken data received');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createToken();
  }, []);

  useEffect(() => {
    if (authToken) {
      navigation.navigate('Auth');
    }
  }, [authToken, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text>Redirecting to Plaid...</Text>
      )}
    </View>
  );
};

export default CreateAuthLink;
