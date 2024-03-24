import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import PasswordValidation from './passwordValidation';

export default function CreateNewPassword() {
  // UseState

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updatePassword = async newPassword => {
    try {
      const response = await fetch('YOUR_BACKEND_URL/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: newPassword}),
      });

      const data = await response.json();
      if (data.success) {
        // Handle success (e.g., navigate to the login screen or show a success message)
      } else {
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors
    }
  };

  const handleCreatePassword = () => {
    // Check if the passwords are not empty
    if (!password || !confirmPassword) {
      Alert.alert('Please enter all fields.');
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match.');
      return;
    }

    // Check for password strength/complexity if needed
    if (password.length < 8) {
      Alert.alert('Password should be at least 8 characters long.');
      return;
    }

    // TODO: Send a request to your backend to update the password
    updatePassword(password);
  };

  return (
    <SafeAreaView style={styles.Background}>
      <Text style={{color: 'white', fontSize: 24, marginBottom: 168}}>
        Create New Password
      </Text>

      {/* Password */}
      <View style={styles.buttonContainer}>
        <View style={{marginBottom: 8, alignSelf: 'center', width: '90%'}}>
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
        <View style={styles.emailButton}>
          <TextInput
            style={[styles.textInput, password ? styles.textActive : null]}
            placeholder="Enter your password"
            placeholderTextColor="rgba(255,255,255, 0.6)"
            secureTextEntry={true} // This hides the password
            onChangeText={text => setPassword(text)}
          />
        </View>
      </View>

      {/* Password */}
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
              placeholder="Confirm your password"
              placeholderTextColor="rgba(255,255,255, 0.6)"
              secureTextEntry={true} // This hides the password
              onChangeText={text => setConfirmPassword(text)}
            />
          </View>
        </View>
      </View>

      {/* Create Password Button */}
      <Pressable
        style={[styles.SignButton, styles.SignButtonOutlined]}
        onPress={handleCreatePassword}>
        <Text style={styles.SignButtonText}>Create password</Text>
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
