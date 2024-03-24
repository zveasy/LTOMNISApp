import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CompleteButtonProps = {
  text?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  iconSet?: 'Ionicons' | 'MaterialCommunityIcons';
  onPress: () => void;
};

const CompleteButton: React.FC<CompleteButtonProps> = ({
  text = 'Complete',
  icon,
  color = '#BDAE8D',
  iconSet = 'MaterialCommunityIcons',
  iconColor = 'white', // Default icon set
  onPress,
}) => {
  const renderIcon = () => {
    switch (iconSet) {
      case 'Ionicons':
        return (
          <Ionicons
            name={icon!}
            size={24}
            color={iconColor}
            style={styles.icon}
          />
        );
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            name={icon!}
            size={24}
            color={iconColor}
            style={styles.icon}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={[styles.SignButton, {backgroundColor: color}]}
      onPress={onPress}>
      {icon && renderIcon()}
      <Text style={styles.SignButtonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  SignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  SignButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default CompleteButton;
