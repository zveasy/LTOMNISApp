import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {setHasCompletedOnboarding} from '../../actions';
import {AppState, setId, setToken} from '../../ReduxStore';
import axios from 'axios';

export default function Verification({route}) {
  const {userPhoneNumber} = route.params;
  const dispatch = useDispatch();

  // State definitions
  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  // Correctly typed refs for TextInput components
  const ref_input1 = useRef<TextInput>(null);
  const ref_input2 = useRef<TextInput>(null);
  const ref_input3 = useRef<TextInput>(null);
  const ref_input4 = useRef<TextInput>(null);
  const ref_input5 = useRef<TextInput>(null);
  const ref_input6 = useRef<TextInput>(null);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const token = useSelector((state: AppState) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/account/twilio/code',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your token
            },
            params: {
              userPhoneNumber: {userPhoneNumber},
            },
          },
        );

        const data = response.data;
        if (data) {
          console.log('Verification successful.', data);
          // Handle successful verification
        } else {
          console.log('Invalid verification code.');
          // Handle invalid code
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network errors
      }
    };

    fetchData();
  }, []); // Add dependencies to the dependency array if needed

  const handleNextPress = async () => {
    const verificationCode =
      digit1 + digit2 + digit3 + digit4 + digit5 + digit6;
    // Make sure to define userEmail or fetch it from state or props

    try {
      const response = await fetch(
        'http://localhost:8080/api/omnis/account/twilio/verification',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({twilioCode: verificationCode}),
        },
      );

      const data = await response.json();
      if (data.success) {
        console.log('Verification successful.', data);
        // dispatch(setHasCompletedOnboarding(true));
        console.log(`This is the dispatch of Verify`);
        navigation.navigate('MainStackNavigator');
      } else {
        console.log('Invalid verification code.');
        // Handle invalid code
      }
    } catch (error) {
      if (error instanceof Error) {
        // Now TypeScript knows error is an Error object, not unknown
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred');
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(
        'YOUR_BACKEND_URL/api/resend-verification-code',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: userEmail}), // userEmail should be the email address of the user
        },
      );

      const data = await response.json();
      if (data.success) {
        console.log('Verification code resent.');
      } else {
        console.log('Failed to resend verification code.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.Background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Verification</Text>
        <Text style={styles.subheaderText}>
          Enter your email account to reset password
        </Text>
      </View>

      {/* 4 Digits */}

      <View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={styles.VerificationBox}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit1(text);
                text && ref_input2.current.focus();
              }}
              value={digit1}
              maxLength={1}
            />
          </View>
          <View style={styles.VerificationBox}>
            <TextInput
              ref={ref_input2}
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit2(text);
                text ? ref_input3.current.focus() : ref_input1.current.focus();
              }}
              value={digit2}
              maxLength={1}
            />
          </View>
          <View style={styles.VerificationBox}>
            <TextInput
              ref={ref_input3}
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit3(text);
                text ? ref_input4.current.focus() : ref_input2.current.focus();
              }}
              value={digit3}
              maxLength={1}
            />
          </View>
          <View style={styles.VerificationBox}>
            <TextInput
              ref={ref_input4}
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit4(text);
                text ? ref_input5.current.focus() : ref_input3.current.focus();
              }}
              value={digit4}
              maxLength={1}
            />
          </View>
          <View style={styles.VerificationBox}>
            <TextInput
              ref={ref_input5}
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit5(text);
                text ? ref_input6.current.focus() : ref_input4.current.focus();
              }}
              value={digit5}
              maxLength={1}
            />
          </View>
          <View style={styles.VerificationBox}>
            <TextInput
              ref={ref_input6}
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={text => {
                setDigit6(text);
                !text && ref_input5.current.focus();
              }}
              value={digit6}
              maxLength={1}
            />
          </View>
        </View>
        <Text style={styles.resendSubheaderText} onPress={handleResendCode}>
          Resend code
        </Text>
      </View>

      {/* Next */}
      <Pressable
        style={[styles.SignButton, styles.SignButtonOutlined]}
        onPress={handleNextPress}>
        <Text style={styles.SignButtonText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 40,
  },
  textInput: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 4,
  },
  subheaderText: {
    color: 'white',
    opacity: 0.6,
    fontSize: 13,
  },

  //   Reset Password styling
  SignButton: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 40,
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

  //   Resend Code

  resendSubheaderText: {
    color: '#BDAE8D',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },

  //   Box Styling

  VerificationBox: {
    width: '15%',
    height: 'auto',
    paddingVertical: 20,
    borderRadius: 16,
    borderColor: '#BDAE8D',
    // height: 50,
    borderWidth: 1,
  },
});
