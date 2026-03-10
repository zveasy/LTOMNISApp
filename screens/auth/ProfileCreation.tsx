import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

export default function ProfileCreation() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const token = useSelector((state: AppState) => state.token);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Please enter your first and last name.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:8080/api/omnis/user/edit',
        {
          firstName,
          lastName,
          country,
          city,
          state: stateField,
          address,
          postalCode,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );

      if (response.data) {
        navigation.navigate('MainStackNavigator');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert(
          'Error',
          error.response.data?.message || 'Failed to update profile.',
        );
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
  ) => (
    <View style={styles.inputContainer}>
      <View style={{marginBottom: 8, alignSelf: 'center', width: '90%'}}>
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            opacity: 0.6,
            textAlign: 'left',
          }}>
          {label}
        </Text>
      </View>
      <View style={styles.inputButton}>
        <TextInput
          style={[styles.textInput, value ? styles.textActive : null]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255, 0.6)"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle title="Create Your Profile" showBackArrow={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {renderInput(
          'First Name',
          firstName,
          setFirstName,
          'Enter your first name',
        )}
        {renderInput(
          'Last Name',
          lastName,
          setLastName,
          'Enter your last name',
        )}
        {renderInput('Country', country, setCountry, 'Enter your country')}
        {renderInput('City', city, setCity, 'Enter your city')}
        {renderInput('State', stateField, setStateField, 'Enter your state')}
        {renderInput('Address', address, setAddress, 'Enter your address')}
        {renderInput(
          'Postal Code',
          postalCode,
          setPostalCode,
          'Enter your postal code',
        )}
      </ScrollView>

      <Pressable
        style={[styles.SignButton, styles.SignButtonOutlined]}
        onPress={handleCompleteProfile}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.SignButtonText}>Complete Profile</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputButton: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 16,
  },
  textInput: {
    color: 'rgba(255,255,255, 0.6)',
    fontSize: 16,
    paddingLeft: 10,
  },
  textActive: {
    color: 'white',
  },
  SignButton: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 40,
    marginTop: 20,
  },
  SignButtonOutlined: {
    borderWidth: 2,
  },
  SignButtonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
  },
});
