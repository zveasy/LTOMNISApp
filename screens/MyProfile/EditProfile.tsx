import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import CustomLabelledTextInput from '../../assets/constants/Components/CustomLabelledTextInput';
import axios from 'axios';
import {Button} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';

export default function EditProfile() {
  // State for all the form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const token = useSelector((state: AppState) => state.token);

  const handleSubmit = () => {
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      state,
      city,
      address,
      postalCode,
    };

    axios
      .put('http://localhost:8080/api/omnis/user/edit', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`,
        },
      })
      .then(response => {
        // Handle success response
        console.log('this is user data on edit', response.data);
        Alert.alert('Profile updated successfully!');
      })
      .catch(error => {
        // Handle error response
        console.error(error);
        Alert.alert('An error occurred while updating your profile.');
      });
  };

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title="Edit Profile" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}
        style={{width: '100%'}}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <CustomLabelledTextInput
            label="First Name"
            placeholder="First Name"
            onChangeText={setFirstName}
            value={firstName}
          />
          <CustomLabelledTextInput
            label="Last Name"
            placeholder="Last Name"
            onChangeText={setLastName}
            value={lastName}
          />
          <CustomLabelledTextInput
            label="Email"
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
          <CustomLabelledTextInput
            label="Phone Number"
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            keyboardType="phone-pad"
          />
          <CustomLabelledTextInput
            label="Country"
            placeholder="Country"
            onChangeText={setCountry}
            value={country}
          />
          <CustomLabelledTextInput
            label="State"
            placeholder="State"
            onChangeText={setState}
            value={state}
          />
          <CustomLabelledTextInput
            label="City"
            placeholder="City"
            onChangeText={setCity}
            value={city}
          />
          <CustomLabelledTextInput
            label="Address"
            placeholder="Address"
            onChangeText={setAddress}
            value={address}
          />
          <CustomLabelledTextInput
            label="Postal Code"
            placeholder="Postal Code"
            onChangeText={setPostalCode}
            value={postalCode}
            keyboardType="number-pad"
          />
          <View style={{padding: 5}}>
            <Pressable
              onPress={handleSubmit}
              style={{
                paddingHorizontal: '35%',
                paddingVertical: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: GlobalStyles.Colors.primary200,
                borderRadius: 16,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  padding: 5,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Submit
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
});
