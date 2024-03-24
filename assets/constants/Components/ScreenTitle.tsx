import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


type ScreenTitleProps = {
  title?: string;
  subtitle?: string;
  showBackArrow?: boolean;
  onBackPress?: () => void;
  showRightIcon?: boolean;
  rightIconType?: 'Ionicons' | 'Feather' | 'MaterialCommunityIcons';
  rightIconName?: string;
  onRightIconPress?: () => void;
};

const ScreenTitle: React.FC<ScreenTitleProps> = ({
  title,
  subtitle,
  showBackArrow = false,
  onBackPress,
  showRightIcon = false,
  rightIconType = 'Ionicons',
  rightIconName,
  onRightIconPress,
}) => {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        if (showBackArrow) {
          navigation.goBack();
        }
      }} style={styles.backButton}>
        {showBackArrow && <Icon name="chevron-back" size={24} color="white" />}
      </TouchableOpacity>
  
      <View style={styles.textContainer}>
        {title && <Text style={styles.headerText}>{title}</Text>}
        {subtitle && <Text style={styles.subheaderText}>{subtitle}</Text>}
      </View>
  
      <TouchableOpacity onPress={onRightIconPress} style={styles.rightButton}>
        {showRightIcon && rightIconName && (
          rightIconType === 'Ionicons' ? (
            <Icon name={rightIconName} size={24} color="white" />
          ) : rightIconType === 'Feather' ? (
            <Feather name={rightIconName} size={24} color="white" />
          ) : (
            <MaterialCommunityIcons name={rightIconName} size={24} color="white" />
          )
        )}
      </TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
    paddingTop: 30,
  },
  textContainer: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
},
  backButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10, // for some space from the edges
  },
  rightButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10, // for some space from the edges
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheaderText: {
    color: 'white',
    opacity: 0.6,
    fontSize: 13,
    textAlign: 'center',
  },
});


export default ScreenTitle;
