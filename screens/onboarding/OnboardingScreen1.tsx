import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {OnboardingScreen1Props} from '../../types';
import {t} from 'i18next';
import IonIcon from 'react-native-vector-icons/Ionicons';

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({
  onNext,
  onSkip,
  onBack,
}) => {
  return (
    <View style={styles.screenContainer}>
      <ImageBackground
        source={require('../../assets/Onboarding.png')}
        style={styles.image}>
        <View style={{height: '50%', marginTop: 75}}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <IonIcon
              name="chevron-back"
              size={24}
              color={GlobalStyles.Colors.primary100}
            />
          </Pressable>
          <Pressable style={styles.button} onPress={onSkip}>
            <Text style={{color: GlobalStyles.Colors.primary100}}>
              {t('skip')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{t('onboardingTitle1')}</Text>
          <Text style={styles.smallText}>{t('description1')}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1, // This makes sure the container takes up the full available space
  },
  background: {
    backgroundColor: GlobalStyles.Colors.primary900,
    alignItems: 'center',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
  },

  text: {
    color: GlobalStyles.Colors.primary130,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  smallText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 30,
  },
  pagination: {
    bottom: 10,
  },
  view: {
    padding: 20,
    height: '50%',
    backgroundColor: GlobalStyles.Colors.primary900,
  },
  backButton: {
    position: 'absolute', // Positioning the button
    left: 20, // Adjust the position as needed
    padding: 10, // Adding some padding to make it easier to press
  },
});

export default OnboardingScreen1;
