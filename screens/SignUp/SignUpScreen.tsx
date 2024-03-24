import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';

export default function SignUpScreen() {
  return (
    <SafeAreaView style={styles.Background}>
      <Image
        style={styles.image}
        source={require('../../assets/gradient9.png')}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonOutlined]}
          onPress={() => {}}>
          <Text style={[styles.buttonText, styles.buttonTextOutlined]}>
            Sign In
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    justifyContent: 'center',
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
  button: {
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
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
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
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
});
