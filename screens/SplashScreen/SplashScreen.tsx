// SplashScreen.tsx
import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import {SplashScreenNavigationProp} from '../../navigationTypes';

type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SelectLang');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/transparent.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  logo: {
    width: 240, // Set the width and height as needed
    height: 240,
    resizeMode: 'contain', // or 'cover' depending on your requirement
  },
});

export default SplashScreen;
