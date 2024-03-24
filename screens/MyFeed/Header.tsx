import React from 'react';
import { View, useWindowDimensions, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import GlobalStyles from '../../assets/constants/colors';

type HeaderProps = {
  firstName: string | null;
  lastName: string | null;
  avatarImage?: string;
  avatarSize?: number;
  avatarBackgroundColor?: string;
  avatarTextColor?: string;
};

const Header: React.FC<HeaderProps> = ({
  firstName,
  lastName,
  avatarImage,
  avatarSize = 25,
  avatarBackgroundColor = GlobalStyles.Colors.primary100,
  avatarTextColor = GlobalStyles.Colors.primary800,
}) => {
  const { width } = useWindowDimensions();
  const firstNameLetter = firstName ? firstName.charAt(0) : '';
  const lastNameLetter = lastName ? lastName.charAt(0) : '';
  const iconSize = width <= 320 ? 15 : 20;

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 20,
      }}>
      {avatarImage ? (
        <Avatar size={avatarSize} rounded source={{ uri: avatarImage }} />
      ) : (
        <Avatar
          size={avatarSize}
          rounded
          title={`${firstNameLetter}${lastNameLetter}`}
          containerStyle={{ backgroundColor: avatarBackgroundColor }}
          titleStyle={{
            color: avatarTextColor,
            fontWeight: 'bold',
          }}
        />
      )}
      {/* <Feather
        name={'filter'}
        size={iconSize}
        color={GlobalStyles.Colors.primary100}
      /> */}
      <View style={{ flexDirection: 'column' }} >
        <Text style={styles.PointsNumber} >5000</Text>
        <Text style={styles.PointsText} >Points</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  PointsText: {
    fontSize: 12,
    color: GlobalStyles.Colors.accent100,
    alignSelf: 'flex-end'
  },
  PointsNumber: {
    fontSize: 20,
    color: GlobalStyles.Colors.primary100
  },

});

export default Header;
