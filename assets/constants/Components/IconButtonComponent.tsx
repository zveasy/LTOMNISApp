import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome6Brands from 'react-native-vector-icons/FontAwesome5Pro';  // Adjust as per your installed library for FontAwesome 6 Brands

type IconButtonComponentProps = {
  backgroundColor?: string;
  text?: string;
  iconName?: string;
  onPress?: () => void;
  textColor?: string;
  iconColor?: string;
  iconSet?: 'Ionicons' | 'FontAwesome6Brands';
};

const IconButtonComponent: React.FC<IconButtonComponentProps> = ({ 
  backgroundColor = 'transparent', 
  text, 
  iconName, 
  onPress = () => {}, 
  textColor = 'black', 
  iconColor = 'black', 
  iconSet = 'Ionicons' 
}) => {
  const IconComponent = iconSet === 'FontAwesome6Brands' ? FontAwesome6Brands : Icon;
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: backgroundColor }]} onPress={onPress}>
      {iconName && <IconComponent name={iconName} size={24} color={iconColor} style={styles.icon} />}
      {text && <Text style={[styles.text, { color: textColor }]}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500'
  },
});

export default IconButtonComponent;
