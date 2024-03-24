import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RadialComponent from './RadialComponent';

type RadialRowProps = {
  type: 'radio' | 'icon' | 'image';
  iconName?: string;
  imagePath?: string;
  mainTextLeft: string;
  mainTextRight: string;
  subTextLeft: string;
  subTextRight: string;
};

const RadialRow: React.FC<RadialRowProps> = ({
  type,
  iconName,
  imagePath,
  mainTextLeft,
  mainTextRight,
  subTextLeft,
  subTextRight,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RadialComponent
          type={type}
          iconName={iconName}
          imagePath={imagePath}
        />
        <View style={styles.textContainer}>
          <View style={styles.textRow}>
            <Text>{mainTextLeft}</Text>
            <Text>{mainTextRight}</Text>
          </View>
          <View style={styles.textRow}>
            <Text>{subTextLeft}</Text>
            <Text>{subTextRight}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    width: '80%',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default RadialRow;
