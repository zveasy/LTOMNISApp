import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import {Divider} from '@rneui/themed';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import {setId} from '../../Redux/actions/idActions';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setToken} from '../../ReduxStore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();


  const register = async () => {
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain a number and a special character.',
      );
      setInvalidPassword(true);
      setModalVisible(true); // Open the modal
      return;
    } else {
      setInvalidPassword(false);
      setModalVisible(false); // Close the modal
    }

    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    setErrorMessage(null);

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
        navigation.navigate('CreateLinkToken', {userId: user.userId});
        dispatch(setId(user.userId));
      } else {
        console.error('Error:', error.message);
      }
    } catch (error) {}
  };

  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const {email, fullName} = appleAuthRequestResponse;
        const userData = {
          email,
          fullName,
          phoneNumber,
          appleIdToken: appleAuthRequestResponse.identityToken, 
        };
        const res = await axios.post(
          'http://localhost:8080/api/omnis/account/register_login',
          userData,
        );
        const {sessionToken} = res.data;
      }
    } catch (error) {

    }
  };

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
          onChangeText={text => {
            if (text.length < 8) {
              setInvalidPassword(true);
            } else {
              setInvalidPassword(false);
            }
            setPassword(text);
          }}
          aria-label="Password"
          placeholder="Password"
          placeholderTextColor={'#fff'}
        />
        {invalidPassword ? (
          <Text style={[styles.smallText, {color: 'red'}]}>
            password Length Warning
          </Text>
        ) : (
          <Text> </Text>
        )}
        <Text style={styles.boxSpacing}>Confirm Password</Text>
        <TextInput
          style={[styles.textImputBox, styles.smallText]}
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)} // Use setConfirmPassword instead of getConfirmPassword
          aria-label="Confirm Password"
          placeholder="Password"
          placeholderTextColor={'#fff'}
        />
      </View>

      {/* signup  */}
      <View style={styles.view2}>
        <Pressable style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        {/* or Register with */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
            height: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              height: 50,
              marginVertical: 30,
            }}>
            <Divider style={{flex: 1, height: 1, backgroundColor: '#fff'}} />
            <Text style={{marginHorizontal: 10, color: '#fff', fontSize: 12}}>
              or Register With
            </Text>
            <Divider style={{flex: 1, height: 1, backgroundColor: '#fff'}} />
          </View>
        </View>

        {/* google and apple */}
        <View style={styles.view3}>
          <Pressable style={styles.googleAndApple}>
            <Image
              source={require('../../assets/google.png')}
              style={styles.image}
            />
          </Pressable>
          <Pressable style={styles.googleAndApple}>
            <View style={styles.image}>
              {appleAuth.isSupported && (
                <AppleButton
                  style={styles.imageApple}
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  onPress={() => onAppleButtonPress()}
                />
              )}
            </View>
          </Pressable>
        </View>

        <Pressable
          style={styles.login}
          onPress={() => navigation.navigate('SignInScreen')}>
          <Text style={{color: 'white', fontSize: 14}}>
            Already Have Account
          </Text>
          <View>
            <Text style={{color: '#BDAE8D', fontSize: 14}}> login</Text>
          </View>
        </Pressable>
      </View>
      {/* Modal for password constraints */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Password Requirements</Text>
            <Text style={styles.modalTextDetail}>
              - At least 8 characters long
              {'\n'}- Contains a number
              {'\n'}- Contains a special character
            </Text>
            <Pressable
              style={[styles.buttonTwo, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  googleAndApple: {
    alignItems: 'center',
  },

  image: {
    resizeMode: 'contain',
    width: '65%',
    aspectRatio: 1, 
    height: 'auto',
  },

  imageApple: {
    width: '95%',
    height: 60,
    marginTop: 52,
  },

  login: {
    flexDirection: 'row',
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

  view3: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  boxSpacing: {
    color: 'white',
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalTextDetail: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonTwo: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#BDAE8D',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
