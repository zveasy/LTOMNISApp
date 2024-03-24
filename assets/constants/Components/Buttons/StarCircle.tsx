import React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles from '../../colors';

type StarCircleProps = {
  iconName: string;
  height?: number;
  width?: number;
};

const StarCircle: React.FC<StarCircleProps> = ({
  iconName,
  height = 24,
  width = 24,
}) => {
  const dynamicStyles = {
    width,
    height,
    borderRadius: height / 2, // half of the height to make it a circle
  };

  return (
    <View style={[styles.circle, dynamicStyles]}>
      <MaterialCommunityIcons
        name={iconName}
        size={14}
        color={GlobalStyles.Colors.primary100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center', // center the child vertically
    alignItems: 'center', // center the child horizontally
  },
});

export default StarCircle;
