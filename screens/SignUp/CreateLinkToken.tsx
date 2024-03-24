import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {setLinkToken} from '../../actions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {AppState} from '../../ReduxStore';
import {link} from 'fs';
import axios from 'axios';

interface CreateLinkTokenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'IdentityVerificationScreen'>;
}

const CreateLinkToken: React.FC<CreateLinkTokenProps> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const id = useSelector((state: AppState) => state.id.id);
  const linkToken = useSelector((state: AppState) => state.linkToken);
  const token = useSelector((state: AppState) => state.token);
  const dispatch = useDispatch();


  useEffect(() => {
    const createToken = async () => {
      setIsLoading(true);
      try {
        const options = {
          method: 'GET',
          url: 'http://localhost:8080/api/omnis/token/create',
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        };
        const res = await axios(options);
        if (res.data) {
          dispatch(setLinkToken(res.data)); // Set the post data with the data from the API.
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
  }, []); // Add dependencies if necessary

  // http://localhost:8080/api/omnis/token/create

  useEffect(() => {
    if (linkToken) {
      navigation.navigate('IdentityVerificationScreen');
    }
  }, [linkToken, navigation]);


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

export default CreateLinkToken;
