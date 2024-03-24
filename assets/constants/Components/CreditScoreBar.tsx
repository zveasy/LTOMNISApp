import React from 'react';
import {View, Text as RNText, StyleSheet, Dimensions} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {RFPercentage} from 'react-native-responsive-fontsize'; // Install this package

const {width} = Dimensions.get('window');

interface CreditScoreBarProps {
  score: number;
  scoreUpdate: number;
}

function CreditScoreBar({score, scoreUpdate}: CreditScoreBarProps) {
  const svgWidth = width - 90; // Adjusted to be dependent on the screen width
  const svgHeight = (svgWidth * 11) / 10; // Proportional height adjustment
  const strokeWidth = 20;
  const sidePadding = (svgWidth * 2.73) / 100; // Proportional side padding
  const radius = svgWidth / 2 - sidePadding - strokeWidth / 2;

  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(score / 100, 1));
  const offset = circumference * (1 - progress);

  const cy = svgHeight / 2 - 10; 

  const d = `
      M ${sidePadding + strokeWidth / 2} ${cy}
      a ${radius} ${radius} 0 1 1 ${2 * radius - 0.01} 0
    `;

  const scoreUpdateColor =
    scoreUpdate > 0 ? 'green' : scoreUpdate < 0 ? 'red' : 'gray';
  const scoreUpdateSymbol = scoreUpdate > 0 ? '+' : '';

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            <LinearGradient id="grad" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor="#302214" stopOpacity="1" />
              <Stop offset="0.33" stopColor="#B28D6C" stopOpacity="1" />
              <Stop offset="0.66" stopColor="#B18A69" stopOpacity="1" />
              <Stop offset="1" stopColor="#EADBC3" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d={d}
            stroke="rgba(120, 120, 128, 0.08)" // gray color for the unmet progress
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
          <SvgText
            x={sidePadding + strokeWidth / 2 - 5}
            y={cy + radius - 110}
            fill="black"
            fontSize={10}
            textAnchor="middle"
            alignmentBaseline="middle">
            0
          </SvgText>
          <SvgText
            x={svgWidth - sidePadding - strokeWidth / 2 + 5}
            y={cy + radius - 110}
            fill="black"
            fontSize={10}
            textAnchor="middle"
            alignmentBaseline="middle">
            100
          </SvgText>
        </Svg>
      </View>
      <RNText style={styles.scoreText}>{score}</RNText>
      <RNText style={[styles.scoreTextUpdate, {color: scoreUpdateColor}]}>
        {scoreUpdateSymbol}
        {scoreUpdate} vs last week
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  scoreText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: 'black',
    fontSize: RFPercentage(3), // Responsive font size
    fontWeight: '500',
  },
  scoreTextUpdate: {
    position: 'absolute',
    top: '46%',
    alignSelf: 'center',
    color: 'gray',
    fontSize: RFPercentage(1.5), // Responsive font size
  },
});

export default CreditScoreBar;
