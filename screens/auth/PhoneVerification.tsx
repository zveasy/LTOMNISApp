import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

export default function PhoneVerification() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const token = useSelector((state: AppState) => state.token);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  const ref_input1 = useRef<TextInput>(null);
  const ref_input2 = useRef<TextInput>(null);
  const ref_input3 = useRef<TextInput>(null);
  const ref_input4 = useRef<TextInput>(null);
  const ref_input5 = useRef<TextInput>(null);
  const ref_input6 = useRef<TextInput>(null);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/account/send_phone_code',
        {phoneNumber},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      setCodeSent(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert(
          'Error',
          error.response.data?.message || 'Failed to send verification code.',
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

  const handleVerify = async () => {
    const verificationCode =
      digit1 + digit2 + digit3 + digit4 + digit5 + digit6;

    if (verificationCode.length < 6) {
      Alert.alert('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/account/verify_phone',
        {phoneNumber, code: verificationCode},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );

      if (response.data.success) {
        console.log('Phone verification successful.', response.data);
        navigation.navigate('CreateLinkToken');
      } else {
        Alert.alert('Error', 'Invalid verification code.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert(
          'Error',
          error.response.data?.message || 'Verification failed.',
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

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle title="Phone Verification" showBackArrow={true} />

      {!codeSent ? (
        <>
          <View style={styles.buttonContainer}>
            <View style={{marginBottom: 8, alignSelf: 'center', width: '90%'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  opacity: 0.6,
                  textAlign: 'left',
                }}>
                Phone Number
              </Text>
            </View>
            <View style={styles.emailButton}>
              <TextInput
                style={[
                  styles.textInput,
                  phoneNumber ? styles.textActive : null,
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor="rgba(255,255,255, 0.6)"
                keyboardType="phone-pad"
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
              />
            </View>
          </View>

          <Pressable
            style={[styles.SignButton, styles.SignButtonOutlined]}
            onPress={handleSendCode}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.SignButtonText}>Send Code</Text>
            )}
          </Pressable>
        </>
      ) : (
        <>
          <View>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input1}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit1(text);
                    text && ref_input2.current?.focus();
                  }}
                  value={digit1}
                  maxLength={1}
                />
              </View>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input2}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit2(text);
                    text
                      ? ref_input3.current?.focus()
                      : ref_input1.current?.focus();
                  }}
                  value={digit2}
                  maxLength={1}
                />
              </View>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input3}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit3(text);
                    text
                      ? ref_input4.current?.focus()
                      : ref_input2.current?.focus();
                  }}
                  value={digit3}
                  maxLength={1}
                />
              </View>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input4}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit4(text);
                    text
                      ? ref_input5.current?.focus()
                      : ref_input3.current?.focus();
                  }}
                  value={digit4}
                  maxLength={1}
                />
              </View>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input5}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit5(text);
                    text
                      ? ref_input6.current?.focus()
                      : ref_input4.current?.focus();
                  }}
                  value={digit5}
                  maxLength={1}
                />
              </View>
              <View style={styles.VerificationBox}>
                <TextInput
                  ref={ref_input6}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDigit6(text);
                    !text && ref_input5.current?.focus();
                  }}
                  value={digit6}
                  maxLength={1}
                />
              </View>
            </View>
            <Text style={styles.resendSubheaderText} onPress={handleSendCode}>
              Resend code
            </Text>
          </View>

          <Pressable
            style={[styles.SignButton, styles.SignButtonOutlined]}
            onPress={handleVerify}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.SignButtonText}>Verify</Text>
            )}
          </Pressable>
        </>
      )}
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
  buttonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emailButton: {
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
  codeInput: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
  },
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
  resendSubheaderText: {
    color: '#BDAE8D',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  VerificationBox: {
    width: '15%',
    height: 'auto',
    paddingVertical: 20,
    borderRadius: 16,
    borderColor: '#BDAE8D',
    borderWidth: 1,
  },
});
