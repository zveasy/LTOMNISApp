import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import React from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {Avatar} from 'react-native-elements';

export default function NFCDone() {
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
      <View style={styles.view}>
        <Image source={require('../../assets/checkmark.circle.png')} />
        <Text style={[styles.smallTextId, {marginVertical: 20}]}>Done</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  view: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
