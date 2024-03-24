import {View, Text, Image, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import GlobalStyles from '../../../../assets/constants/colors';
import StarCircle from '../../../../assets/constants/Components/Buttons/StarCircle';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useRef } from 'react';

interface Props {
  status: 'gold' | 'silver' | 'bronze';
  title: string;
  subtext: string;
  statusVisible: boolean; // New prop for visibility
  progress: number;
}

const ScoreName: React.FC<Props> = ({
  status,
  title,
  subtext,
  statusVisible,
  progress,
}) => {
  const getLottieSource = () => {
    switch (status) {
      case 'gold':
        return require('../../../../assets/goldBar.json');
      case 'silver':
        return require('../../../../assets/silverBar.json');
      case 'bronze':
        return require('../../../../assets/bronzeBar.json');
      default:
        return require('../../../../assets/bronzeBar.json');
    }
  };

  const getScore = () => {
    switch (status) {
      case 'gold':
        return 15000;
      case 'silver':
        return 7500;
      case 'bronze':
        return 1500;
      default:
        return 0;
    }
  };

  const getGradientColors = () => {
    if (!statusVisible)
      return ['#F6F4F4', '#F6F4F4', '#F6F4F4', '#F6F4F4', '#F6F4F4']; // Default colors

    switch (status) {
      case 'gold':
        return ['#E3C4AB', '#DDAF7C', '#D18A2A', '#835726', '#513623']; // Gold colors
      case 'silver':
        return ['#F6F4F4', '#BFC0C1', '#8B8E91', '#535456', '#1E1E1E']; // Silver colors
      case 'bronze':
        return ['#B08766', '#B3794E', '#B7652C', '#714426', '#463122']; // Bronze colors
      default:
        return ['#F6F4F4', '#F6F4F4', '#F6F4F4', '#F6F4F4', '#F6F4F4']; // Default colors
    }
  };

  const getGradientLocations = () => {
    if (status === 'bronze' || status === 'gold' || status === 'silver') {
      return [0, 0.2, 0.55, 0.8, 1]; // Adjust these as needed
    }
    return undefined; // Default: equal spacing
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'gold':
        return '#FFF1DA';
      case 'silver':
        return '#EDEDED';
      case 'bronze':
        return '#FFEFD6';
      default:
        return '#B7652C';
    }
  };

  const progressBarRef = useRef<View>(null);
  const calculatedProgressBarWidth = (Number(progress) / Number(getScore())) * 100;

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.setNativeProps({ style: { width: calculatedProgressBarWidth + '%' } });
    }
  }, [calculatedProgressBarWidth]);

  // const determineStatus = (progress: number): 'gold' | 'silver' | 'bronze' => {
  //   if (progress >= 3000) return 'gold';
  //   if (progress >= 3000) return 'silver';
  //   return 'bronze';
  // };
  
  
  return (
    <LinearGradient
      colors={getGradientColors()}
      locations={getGradientLocations()}
      style={[
        styles.container,
        {height: statusVisible ? 182 : 162}, // inline style to dynamically set the height
      ]}>
      <View style={styles.row}>
        <LottieView
          source={getLottieSource()}
          autoPlay={statusVisible} // Set autoPlay based on statusVisible prop
          loop
          style={styles.lottie}
        />
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, {color: statusVisible ? 'white' : 'black'}]}>
            {title}
          </Text>
          <Text
            style={[
              styles.subtext,
              {color: statusVisible ? 'white' : 'black'},
            ]}>
            {subtext}
          </Text>
          <View style={styles.pointsCircle}>
            <StarCircle
              iconName="star-four-points-outline"
              height={16}
              width={16}
            />
            <Text
              style={[
                styles.score,
                {color: statusVisible ? 'white' : 'black'},
              ]}>
              {getScore()}
            </Text>
          </View>
        </View>
      </View>
      {statusVisible && (
      <View>
    <View style={styles.progressBarContainer}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
      <View
        ref={progressBarRef}
        style={{
          height: '100%',
          backgroundColor: getProgressBarColor(),
          borderRadius: 6,
        }}
      />
            </View>
    </View>
        <View style={styles.progressNumbersContainer}>
          <Text style={styles.progressNumbers}>
            {`${progress}/${getScore()}`}
          </Text>
        </View>
      </View>
    )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'column', // Changed from 'row' to 'column'
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  progressBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#ccc',
  },
  progressBarFill: {
    height: '100%',
    width: '50%', // Set this to control the fill amount
    backgroundColor: 'blue', // Set this to control the fill color
  },
  lottie: {
    width: 80,
    height: 80,
  },
  textContainer: {
    marginLeft: 10,
    width: '75%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary800,
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary800,
  },
  score: {
    fontSize: 24,
    fontWeight: '500',
    color: '#393838',
  },
  pointsCircle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
    marginTop: 5,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 18,
    backgroundColor: 'rgba(256, 256, 256, 0.16)',
    padding: 5, // Padding around the progress bar
    borderRadius: 6,
    marginTop: 10,
    width: '100%', // Set the width of the progress bar container to 80%
    alignSelf: 'center' // Center the progress bar container
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressNumbersContainer: {
    alignItems: 'flex-end', // to align the text to the right
    paddingTop: 5, // or any other value to give some padding

  },
  progressNumbers: {
    fontSize: 14, // or any other value
    color: 'white', // or any other color
  },
});

export default ScoreName;
