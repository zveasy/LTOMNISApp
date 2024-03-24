import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import CountryDropdown from '../../assets/constants/Components/CountryDropdown';

export default function InternationalCreditReportAccess() {
  // UseState

  const [country, setCountry] = useState('US');
  const [ssn, setSsn] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  return (
    <SafeAreaView style={styles.Background}>
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'white', fontSize: 24, fontWeight: '700'}}>International Credit</Text>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            marginBottom: 168,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          Report Access
        </Text>
      </View>

      {/* Country Picker */}
      <View style={styles.buttonContainer}>
        <View style={{marginBottom: 8, alignSelf: 'center', width: '90%'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              opacity: 0.6,
              textAlign: 'left',
            }}>
            Country
          </Text>
        </View>
        <View style={styles.emailButton}>
          <TextInput
            style={[styles.textInput, password ? styles.textActive : null]}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255,255,255, 0.6)"
            keyboardType="visible-password"
            onChangeText={text => setPassword(text)}
            // autoCompleteType="email"
          />
        </View>
      </View>

{/* <View>
      <CountryDropdown onValueChange={(value) => setSelectedCountry(value)} />
    </View> */}

      {/* SSN placement */}
      <View style={styles.passwordButtonContainer}>
        <View style={{marginBottom: 16, alignSelf: 'center', width: '90%'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              opacity: 0.6,
              textAlign: 'left',
            }}>
            Password
          </Text>
        </View>
        <View style={styles.passwordButton}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <TextInput
              style={[
                styles.textInput,
                confirmPassword ? styles.textActive : null,
              ]}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255, 0.6)"
              keyboardType="email-address"
              onChangeText={text => setConfirmPassword(text)}
              // autoCompleteType="email"
            />
          </View>
        </View>
      </View>

      {/* Create Password Button */}
      <Pressable
        style={[styles.SignButton, styles.SignButtonOutlined]}
        onPress={() => {}}>
        <Text style={styles.SignButtonText}>Authorize Access</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  emailButton: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    color: '#fff',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 20,
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#BDAE8D',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'flex-start',
    paddingLeft: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonTextOutlined: {
    color: '#BDAE8D',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  //   Password Styling

  passwordButtonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  passwordButton: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    color: '#fff',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
  },

  //   Sign In styling

  SignButton: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 110,
  },
  SignButtonOutlined: {
    borderWidth: 2,
    backgroundColor: '#BDAE8D',
    opacity: 0.6,
    position: 'absolute',
    bottom: 40
  },
  SignButtonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
  },

  // Addtional

  textInput: {
    color: 'rgba(255,255,255, 0.6)', // default color when there is no input
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'center',
    width: '90%',
  },
  textActive: {
    color: 'white', // color when there is input
  },
});
