import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
} from 'react-native';
import React from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {t} from 'i18next';
import {OnboardingScreen2Props} from '../../types';

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({onSkip}) => {
  return (
    <View style={styles.background}>
      <ImageBackground
        source={require('../../assets/Onboarding.png')}
        style={styles.image}>
        <View style={{height: '50%', marginTop: 75}}>
          <Pressable style={styles.button} onPress={onSkip}>
            <Text style={{color: '#fff'}}>{t('skip')}</Text>
          </Pressable>
        </View>

        <View style={styles.view}>
          <Text style={styles.text}>{t('onboardingTitle2')}</Text>
          <Text style={styles.smallText}>{t('description2')}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    height: '100%',
  },

  button: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'transparent',
    width: '30%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.accent120,
    alignSelf: 'flex-end',
    marginRight: '5%',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  text: {
    color: '#EADBC3',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  smallText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 30,
  },

  view: {
    padding: 20,
    height: '50%',
    backgroundColor: '#000',
  },
});

export default OnboardingScreen2;
