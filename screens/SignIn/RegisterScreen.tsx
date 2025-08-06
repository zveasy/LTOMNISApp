import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  
  
  
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import {setId} from '../../Redux/actions/idActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setToken} from '../../ReduxStore';

// 03.28.2024

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();


  const register = async () => {
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage('Password must be at least 8 characters, contain a number and a special character.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    // clear errors
    setErrorMessage(null);
    setConfirmError(null);

    try {
      const res = await axios.post(
        'http://localhost:8080/api/omnis/account/register_login',
        {
          email,
          password,
        },
      );
      const user = res.data;
      if (user) {
        dispatch(setToken(user.token));
        navigation.navigate('Verification', {userId: user.userId});
        dispatch(setId(user.userId));
      } else {
        console.error('Error:', Error);
      }
    } catch (error) {}
  };

  // const onAppleButtonPress = async () => {
  //   try {
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: AppleAuthRequestOperation.LOGIN,
  //       requestedScopes: [
  //         AppleAuthRequestScope.EMAIL,
  //         AppleAuthRequestScope.FULL_NAME,
  //       ],
  //     });

  //     const credentialState = await appleAuth.getCredentialStateForUser(
  //       appleAuthRequestResponse.user,
  //     );

  //     if (credentialState === appleAuth.State.AUTHORIZED) {
  //       const {email, fullName} = appleAuthRequestResponse;
  //       const userData = {
  //         email,
  //         fullName,
  //         phoneNumber,
  //         appleIdToken: appleAuthRequestResponse.identityToken, 
  //       };
  //       const res = await axios.post(
  //         'http://localhost:8080/api/omnis/account/register_login',
  //         userData,
  //       );
  //       const {sessionToken} = res.data;
  //     }
  //   } catch (error) {

  //   }
  // };

  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.text}>Lets Get Started</Text>
      <Text style={styles.smallText}>Create Your Account</Text>
      <View style={styles.view1}>
        {/* input boxes */}
        <Text style={styles.boxSpacing}>Email</Text>
        <TextInput
          style={[styles.textImputBox, styles.smallText]}
          value={email}
          onChangeText={text => setEmail(text)}
          aria-label="Email"
          placeholder="Email"
          placeholderTextColor={'#fff'}
        />
        <Text style={styles.boxSpacing}>Password</Text>
        <TextInput
          style={[styles.textImputBox, styles.smallText]}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          aria-label="Password"
          placeholder="Password"
          placeholderTextColor={'#fff'}
        />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <Text style={styles.boxSpacing}>Confirm Password</Text>
        <TextInput
          style={[styles.textImputBox, styles.smallText]}
          value={confirmPassword}
          secureTextEntry
          onChangeText={text => setConfirmPassword(text)} 
          aria-label="Confirm Password"
          placeholder="Confirm Password"
          placeholderTextColor={'#fff'}
         />
         {confirmError && <Text style={styles.errorText}>{confirmError}</Text>}
       </View>

      {/* signup  */}
      <View style={styles.view2}>
        <Pressable style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.login}
        onPress={() => navigation.navigate('SignInScreen')}>
        <Text style={{color: 'white', fontSize: 14}}>
          Already have an account? <Text style={{color: '#BDAE8D'}}>Login</Text>
        </Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    height: '100%',
  },

  button: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },

  buttonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },

  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  smallText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'normal',
  },

  textImputBox: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    height: 50,
    width: '90%',
    paddingLeft: 10,
    marginVertical: 15,
  },

  view1: {
    alignItems: 'center',
    marginTop: 20,
    color: '#fff',
    width: '100%',
  },

  view2: {
    alignItems: 'center',
    marginTop: '40%',
    color: '#fff',
    width: '100%',
  },

  boxSpacing: {
    color: 'white',
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginTop: 8,
    marginBottom: 4,
  },

  login: {
    flexDirection: 'row',
    marginTop: 20,
  },

});
