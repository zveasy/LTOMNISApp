import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';

type GrayBoxProps = {
    iconName: string;
    label: string;
    iconType: 'feather' | 'MaterialCommunityIcons' | 'Ionicons';
  };
  

  const GrayBox: React.FC<GrayBoxProps> = ({ iconName, label, iconType }) => {
    let iconLibraryType;
    switch(iconType) {
      case 'feather':
        iconLibraryType = 'feather';
        break;
      case 'MaterialCommunityIcons':
        iconLibraryType = 'material-community';
        break;
      case 'Ionicons':
        iconLibraryType = 'ionicon';
        break;
      default:
        iconLibraryType = 'feather';
    }
  
    return (
      <View style={styles.grayBoxContainer}>
        <Icon name={iconName} type={iconLibraryType} size={24} />
        <Text style={styles.grayBoxText}>{label}</Text>
      </View>
    );
  };  
  

const styles = StyleSheet.create({
  grayBoxContainer: {
    width: 96,
    height: 80,
    backgroundColor: GlobalStyles.Colors.primary120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 16,
  },
  grayBoxText: {
    marginTop: 5,
    fontSize: 14,
    color: '#131313',
    fontWeight: '500',
  },
});

export default GrayBox;
