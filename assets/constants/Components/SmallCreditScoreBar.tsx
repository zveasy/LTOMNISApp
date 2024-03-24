import React from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import {RFPercentage} from 'react-native-responsive-fontsize'; // Install this package

const {width} = Dimensions.get('window');

interface SmallCreditScoreBarProps {
  creditScore: number;
}

function SmallCreditScoreBar({creditScore}: SmallCreditScoreBarProps) {
  const svgWidth = width - 106; // Adjusted to be dependent on the screen width
  const svgHeight = (svgWidth * 300) / 285; // Proportional height adjustment
  const strokeWidth = (svgWidth * 25) / 285; // Proportional stroke width adjustment
  const sidePadding = (svgWidth * 20) / 285; // Proportional side padding adjustment
  const radius = svgWidth / 2 - sidePadding - strokeWidth / 2;

  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min((creditScore - 300) / (850 - 300), 1));
  const offset = circumference * (1 - progress);

  const cy = svgHeight / 2 - 10;

  const d = `
      M ${sidePadding + strokeWidth / 2} ${cy}
      a ${radius} ${radius} 0 1 1 ${2 * radius - 0.01} 0
    `;

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            <LinearGradient id="grad" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor="#284631" stopOpacity="1" />
              <Stop offset="1" stopColor="#C82324" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d={d}
            stroke="rgba(120, 120, 128, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={d}
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </Svg>
      </View>
      <RNText style={styles.scoreText}>{creditScore}</RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: -270,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  scoreText: {
    position: 'absolute',
    top: '18%', // Adjust this value to move the score up
    alignSelf: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },

  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    flexDirection: 'row', // to align red and green side by side
    marginRight: 8, // optional, to give some space between circle and score
  },
  redHalfCircle: {
    flex: 1,
    backgroundColor: 'red',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  greenHalfCircle: {
    flex: 1,
    backgroundColor: 'green',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default SmallCreditScoreBar;
