import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../colors';

const {width} = Dimensions.get('window');

type OmnisOptionsProps = {
  isLottie: boolean;
  lottieSource?: any;
  imageSource?: any;
  title: string;
  isProgressBar: boolean;
  subText?: string;
  progress?: number;
  status?: 'gold' | 'silver' | 'bronze';
};

const OmnisOptions: React.FC<OmnisOptionsProps> = ({
  isLottie,
  imageSource,
  title,
  isProgressBar,
  subText,
  progress,
  status,
}) => {
  let lottieFile;
  switch (status) {
    case 'gold':
      lottieFile = require('../../goldBar.json');
      break;
    case 'silver':
      lottieFile = require('../../silverBar.json');
      break;
    case 'bronze':
      lottieFile = require('../../bronzeBar.json');
      break;
    default:
      lottieFile = null;
  }

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {isLottie ? (
          <View style={styles.lottieContainer}>
            {lottieFile && (
              <LottieView
                source={lottieFile}
                autoPlay
                loop
                style={styles.lottie}
              />
            )}
          </View>
        ) : (
          <Image
            source={imageSource || require('../../photo.jpg')}
            style={styles.image}
          />
        )}
      </View>

      {/* Middle Section */}
      <View style={styles.middleSection}>
        <Text style={styles.title}>{title}</Text>
        {isProgressBar ? (
          <>
            <View style={styles.progressBar}>
              <View
                style={{
                  ...styles.progressFill,
                  width: `${(progress ?? 0) / 50}%`,
                }}></View>
            </View>
            <Text style={styles.progressText}>
              {`${progress ?? 0}/5000`} {/* Progress text */}
            </Text>
          </>
        ) : (
          <Text style={styles.subText}>{subText ?? ''}</Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width * 0.9,
    height: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 16,
    marginTop: 16,
  },
  leftSection: {
    flex: 1,
  },
  middleSection: {
    flex: 3,
  },
  rightSection: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  lottie: {
    width: 90,
    height: 120,
    margin: -10,
  },
  image: {
    width: 50,
    height: 50,
    margin: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '500'
  },
  subText: {
    fontSize: 12,
    fontWeight: '500',
    color: GlobalStyles.Colors.accent120,
    width: '90%'
  },
  progressBar: {
    height: 18,
    backgroundColor: 'rgba(168, 172, 176, 0.08)',
    borderRadius: 6,
    width: '100%',
  },
  progressFill: {
    height: '50%',
    left: 5,
    marginVertical: 5,
    backgroundColor: '#787880',
    borderRadius: 6,
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right', // align the text to the right
    marginTop: 4, // optional: add some margin at the top
  },
  lottieContainer: {
    marginRight: 20,
  },
});

export default OmnisOptions;
