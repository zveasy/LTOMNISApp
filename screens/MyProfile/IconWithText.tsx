import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles from '../../assets/constants/colors';

interface IconWithTextProps {
  iconName: string;
  text: string;
  iconType: 'Ionicons' | 'MaterialCommunity';
}

const IconWithText: React.FC<IconWithTextProps> = ({ iconName, text, iconType }) => {
  const RenderedIcon = iconType === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
  
  return (
    <View style={styles.container}>
      <RenderedIcon name={iconName} size={20} color={GlobalStyles.Colors.primary200} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Aligns icon with the first line of text
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 10, // Some space between the icon and the text
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 14,
  },
});

export default IconWithText;
