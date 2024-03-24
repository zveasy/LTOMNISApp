import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {Avatar} from 'react-native-elements';

export default function NFCAcceptFriend() {
  return (
    <View style={styles.background}>
      <Text style={styles.text}>Add Friend</Text>
      <ImageBackground
        source={require('../../assets/Onboarding.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}>
        <Avatar
          size={80}
          rounded
          source={{
            uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          }}
        />
        <Text style={[styles.text, {marginVertical: 10}]}>Zacharyia Veasy</Text>
        <Text style={styles.smallText}>@easy</Text>
      </ImageBackground>
      <View style={styles.view2}>
        <Pressable style={[styles.acceptAndDeclineButtons, styles.button1]}>
          <Text style={styles.buttonText}>Decline</Text>
        </Pressable>
        <Pressable style={[styles.acceptAndDeclineButtons, styles.button2]}>
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptAndDeclineButtons: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  background: {
    backgroundColor: GlobalStyles.Colors.primary800,
    height: '100%',
    paddingTop: 75,
    display: 'flex',
    alignItems: 'center',
  },

  imageBackground: {
    height: 192,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: 20,
  },

  button1: {
    backgroundColor: GlobalStyles.Colors.primary600,
    borderColor: GlobalStyles.Colors.primary600,
    borderWidth: 1,
    borderRadius: 16,
    width: '45%',
    height: 56,
  },

  button2: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderColor: GlobalStyles.Colors.primary200,
    borderWidth: 1,
    borderRadius: 16,
    width: '45%',
    height: 56,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  imageStyle: {
    borderRadius: 16, // Adjust the border radius as needed
    overflow: 'hidden',
  },

  text: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 24,
    fontWeight: 'bold',
  },

  smallText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'normal',
  },
  smallTextId: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 16,
    fontWeight: 'normal',
  },

  view1: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  view2: {
    width: '100%',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: '100%',
  },
});
