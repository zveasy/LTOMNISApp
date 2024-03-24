// LevelDetailsComponent.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LevelDetailsComponentProps {
  progress: number;
}

const LevelDetailsComponent: React.FC<LevelDetailsComponentProps> = ({ progress }) => {
  const progressBarRef = useRef<View>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.setNativeProps({ style: { width: `${progress}%` } });
    }
  }, [progress]);

  const gradientColors = ['#B08766', '#B3794E', '#B7652C', '#714426', '#463122'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View ref={progressBarRef} style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.text}>BRONZE</Text>
      <Text style={styles.progressText}>{`${progress}/${1500}`}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: 'rgba(256, 256, 256, 0.16)',
    borderRadius: 6,
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFEFD6',
    borderRadius: 6,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  progressText: {
    color: 'white',
    marginTop: 5,
  },
});

export default LevelDetailsComponent;
