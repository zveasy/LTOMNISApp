import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { IconButton } from 'react-native-paper';
import GlobalStyles from '../colors';

type RadialProps = {
  type: 'radio' | 'icon' | 'image';
  iconName?: string;
  imagePath?: string;
  isActive?: boolean;
};

const RadialComponent: React.FC<RadialProps> = ({ type, iconName, imagePath, isActive }) => {
  // ... other code

  // const handlePress = () => {
  //   setIsSelected(!isSelected);
  // };

  if (type === 'radio') {
    return (
      <View style={[styles.outerGrayCircle, isActive ? { backgroundColor: GlobalStyles.Colors.primary200 } : {}]}>
        <View style={[styles.innerGrayCircle, { width: isActive ? 12 : 20, height: isActive ? 12 : 20 }]} />
      </View>
    );
  }

  if (type === 'icon' && iconName) {
    return (
      <View style={styles.radialContainer}>
        <IconButton icon={iconName} size={20} />
      </View>
    );
  }

  if (type === 'image' && imagePath) {
    return (
      <View style={styles.radialContainer}>
        <Image source={{ uri: imagePath }} style={styles.image} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  radialContainer: {
    marginRight: 5,
  },
  outerGrayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F3F5',  // Dark gray
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  innerGrayCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#fff',  // Lighter gray
  },
  image: {
    width: 20,
    height: 20,
  },
  outerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C6A98C',  // Dark gray
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  outerCircleSelected: {
    backgroundColor: '#C6A98C',
  },
  innerGrayCircleActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  innerGrayCircleInactive: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});

export default RadialComponent;
