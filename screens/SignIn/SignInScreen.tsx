import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Divider} from '@rneui/themed';
import PasswordValidation from '../auth/passwordValidation';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {t} from 'i18next';
import {setsUserPhoneNumber, setToken, setUserId} from '../../ReduxStore';

import {Screen} from 'react-native-screens';
import {MainStackParamList} from '../../App';

interface SignInScreenProps {
  token: string;
}

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<{token?: string}>({});
  const [userToken, setUserToken] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [error, setError] = useState(false); // New state for error handling

  const dispatch = useDispatch();

  GoogleSignin.configure({
    iosClientId:
      '<812122915742-3docgp9krobbp8dm3e80vo33k9vroeud.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  });

  const signIn = async () => {
    try {
      const options = {
        method: 'POST',
        url: 'http://localhost:8080/api/omnis/account/login',
        data: {email, password},
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      const res = await axios(options);

      if (res.status === 200 && res.data && res.data.token) {
        const user = res.data;
        const token = user.token;
        const userId = user.userId;
        // const userPhoneNumber = user.userPhoneNumber;
        const userPhoneNumber = res.data.userPhoneNumber;

        // Save token to AsyncStorage
        setError(false);
        await AsyncStorage.setItem('token', token);
        setUserToken(token);
        setUser(user);
        setUserPhoneNumber(userPhoneNumber);
        dispatch(setToken(token)); // Dispatch token to Redux store
        dispatch(setUserId(userId)); // Dispatch userId to Redux store
        dispatch(setsUserPhoneNumber(userPhoneNumber));
        return token;
      } else {
        
        setError(true);
        showAlert();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(true);
        showAlert();
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const showAlert = () => {
    Alert.alert(
      "Login Failed",
      "Your email or password is incorrect. Please try again.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const handleSignIn = async () => {
    const token = await signIn();
    if (token) {
      dispatch(setToken(token));

      navigation.navigate('MainStackNavigator', { userPhoneNumber: userPhoneNumber });
    } else {
    }
  };

  // In your App component
  React.useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      dispatch(setToken(storedToken!));
    };

    loadToken();
  }, [dispatch]);

  const googleSignIn = async () => {
    console.log('We are in googleSignIn');
    try {
      console.log('We are in googleSignIn try');
      await GoogleSignin.hasPlayServices();
      console.log('We are in googleSignIn try2');
      const userInfo = await GoogleSignin.signIn();
      console.log('We are in googleSignIn try3', userInfo);
      const idToken = userInfo.idToken;

      // Send the ID token to your backend via HTTPS using Axios
      await sendTokenToBackend(idToken);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation (e.g., sign-in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Google SignIn Error', error);
      }
    }
  };

  const sendTokenToBackend = async (idToken: any) => {
    try {
      console.log('We are in googleSignIn sendTokenToBackend');
      const response = await axios.post(
        'http://localhost:8080/api/omnis/google_sign_in',
        {
          token: idToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response.data); // Handle the response data as needed
    } catch (error) {
      console.log('Error sending token to backend', error);
    }
  };

  // APPLE AUTH

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const identityToken = appleAuthRequestResponse.identityToken;

    sendTokenToYourServer(identityToken);
  }

  return (
    <SafeAreaView style={styles.Background}>
      <Text style={{color: 'white', fontSize: 20, marginBottom: 168}}>
        {t('signInTitle')}
      </Text>

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
            {t('emailLabel')}
          </Text>
        </View>
        <View style={[styles.emailButton, error ? styles.inputError : null]}>
          <TextInput
            style={[styles.textInput, email ? styles.textActive : null]}
            placeholder={t('enterYourEmail')}
            placeholderTextColor="rgba(255,255,255, 0.6)"
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
            value={email}
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
            {t('passwordLabel')}
          </Text>
        </View>
        <View style={[styles.passwordButton, error ? styles.inputError : null]}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <TextInput
              style={[styles.textInput, password ? styles.textActive : null]}
              placeholder={t('enterYourPassword')}
              placeholderTextColor="rgba(255,255,255, 0.6)"
              secureTextEntry={!passwordVisible}
              onChangeText={text => setPassword(text)}
              value={password}
            />
            <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
              <IonIcon
                name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#B08766"
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{alignSelf: 'center', width: '90%'}}>
          <Text
            style={{
              color: '#B08766',
              fontSize: 13,
              opacity: 0.6,
              textAlign: 'right',
            }}>
            {t('forgotPassword')}
          </Text>
        </Pressable>
      </View>

      {/* Sign In Button */}
      <Pressable
        onPress={async () => await handleSignIn()}
        style={[styles.SignButton, styles.SignButtonOutlined]}>
        <Text style={[styles.SignButtonText, styles.SignButtonTextOutlined]}>
          {t('signInButton')}
        </Text>
      </Pressable>

      {/* Or log in with */}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Divider style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <Text style={{marginHorizontal: 10, color: 'white'}}>
            {t('orLoginWith')}
          </Text>
          <Divider style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
      </View>

      {/* Google and Apple */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
        }}>
        <Pressable
          style={{
            width: '46%',
            height: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#BDAE8D',
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
          }}
          onPress={googleSignIn}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '60%',
              alignSelf: 'center',
            }}>
            <Image
              source={require('../../assets/google.png')}
              style={{height: 24, width: 24}}
            />
            <Text style={{color: 'white', fontSize: 18}}>{t('google')}</Text>
          </View>
        </Pressable>
        <Pressable
          style={{
            width: '46%',
            height: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#BDAE8D',
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          {/* <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '50%',
              alignSelf: 'center',
            }}> */}
          {/* <IonIcon name="logo-apple" size={24} color="#fff" />
            <Text style={{color: 'white', fontSize: 18}}>Apple</Text> */}
          {appleAuth.isSupported && (
            <AppleButton
              style={{width: '100%', height: 56}}
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              onPress={() => onAppleButtonPress()}
            />
          )}
          {/* </View> */}
        </Pressable>
      </View>

      <Pressable
        style={styles.newToOmnisContainer}
        onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={{color: 'white', fontSize: 14}}>{t('newToOmnis')}</Text>
        <Text> </Text>
        <Text style={{color: '#BDAE8D', fontSize: 14}}>{t('register')}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  image: {
    // margin: 10,
    resizeMode: 'contain',
    width: '80%',
    aspectRatio: 1, // This keeps image square while adjusting to screen width
    height: 'auto',
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
    marginTop: 80,
  },
  SignButtonOutlined: {
    borderWidth: 2,
    borderColor: '#BDAE8D',
  },
  SignButtonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
  },
  SignButtonTextOutlined: {},

  //   New to OMNIS

  newToOmnisContainer: {
    marginTop: 16,
    flexDirection: 'row',
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

  googleSignInButton: {
    width: '80%', // Adjust the width as needed
    height: 48, // Adjust the height as needed
    marginTop: 10, // Adjust the margin as needed
    alignSelf: 'center', // Center the button
  },
  inputError: {
    borderColor: 'red', // Change border color to red
  },
});

export default SignInScreen;
