import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScoreName from './ScoreName'; // Import the ScoreName component
import ScoreNameTwo from './ScoreNameTwo';

interface ContainerProps {
  // You can define the props of the container component
  status: 'gold' | 'silver' | 'bronze';
  title: string;
  subtext: string;
  statusVisible: boolean;
  progress: number;
}

const WhiteContainer: React.FC<ContainerProps> = ({
  status,
  title,
  subtext,
  statusVisible,
  progress,
}) => {
  return (
    <View style={styles.container}>
      <ScoreNameTwo
        status={status}
        title={title}
        subtext={subtext}
        statusVisible={statusVisible}
        progress={progress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto', 
  },
});

export default WhiteContainer;
