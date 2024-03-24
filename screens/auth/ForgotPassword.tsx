import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  // UseState
  const [email, setEmail] = useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Forgot Password"
        subtitle="Enter your email account to reset password"
        showBackArrow={true}
        onBackPress={() => {
          // Handle back action, e.g. navigate back
        }}
      />

      {/* Email */}

      <View style={styles.buttonContainer}>
        <View style={{marginBottom: 8, alignSelf: 'center', width: '90%'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              opacity: 0.6,
              textAlign: 'left',
            }}>
            Email
          </Text>
        </View>
        <View style={styles.emailButton}>
          <TextInput
            style={[styles.textInput, email ? styles.textActive : null]}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255,255,255, 0.6)"
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
            // autoCompleteType="email"
          />
        </View>
      </View>

      {/* Reset Password */}
      <Pressable
        style={[styles.SignButton, styles.SignButtonOutlined]}
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.SignButtonText}>Reset Password</Text>
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
  label: {
    color: 'white',
    fontSize: 12,
    opacity: 0.6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlign: 'left',
    marginBottom: 8,
  },
  emailButton: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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

  // Additional TextInput Styling
  textInput: {
    color: 'rgba(255,255,255, 0.6)', // default color when there is no input
    fontSize: 16,
    paddingLeft: 10,
  },
  textActive: {
    color: 'white', // color when there is input
  },
});
