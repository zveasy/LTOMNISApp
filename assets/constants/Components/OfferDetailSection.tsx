import {Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Divider} from 'react-native-elements';
import GlobalStyles from '../colors';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../App';
import {t} from 'i18next';


// Define this in a separate file or at the top of your current file
export type OfferDetailSectionProps = {
  targetScreen: string;
  firstName: string;
  lastName: string;
  totalAmount: number;
  interestPercentage: number | 'Gift';
  avatar?: string;
  offerId: string;
  currentAmount: number;
  postCurrentAmount: number;
  postTotalAmount: number;
  // ... any other props used in OfferDetailSection
};

const OfferDetailSection: React.FC<OfferDetailSectionProps> = ({
  offerId,
  firstName,
  lastName,
  totalAmount,
  interestPercentage,
  avatar,
  currentAmount,
  postTotalAmount,
  postCurrentAmount
}) => {
  const NameInitials = `${firstName?.charAt(0) || ''}${
    lastName?.charAt(0) || ''
  }`;

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  console.log('This is a Request::', JSON.stringify({firstName}));
  console.log('This is a Request::', JSON.stringify({lastName}));

  console.log('postCurrentAmount &&', postCurrentAmount)

  return (
    <View
      style={{
        backgroundColor: GlobalStyles.Colors.primary100,
        borderRadius: 20,
        height: 81,
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',
      }}>
      {/* Profile */}

      <View
        style={{
          flexDirection: 'row',
          marginTop: 16,
          marginLeft: 16,
          alignItems: 'center',
        }}>
        {avatar ? (
          <Avatar size={22} rounded source={{uri: avatar}} />
        ) : (
          <Avatar
            size={22}
            rounded
            title={t('title', {title: NameInitials})}
            containerStyle={{backgroundColor: GlobalStyles.Colors.primary120}}
            titleStyle={{
              color: GlobalStyles.Colors.primary500,
              fontWeight: 'bold',
            }}
          />
        )}
        <Text style={{left: 8, fontFamily: 'San Francisco', fontSize: 14}}>
          {`${firstName} ${lastName}`}
        </Text>
      </View>
      {/* Amount */}
      <View style={{flexDirection: 'row', marginTop: 6, alignItems: 'center'}}>
        <Text style={styles.NumberInRoles}>${totalAmount}</Text>
        <View
          style={{
            height: 15,
            width: 1,
            bottom: 3,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Divider orientation="vertical" width={1} />
        </View>
        <Text style={styles.TextInRoles}>{interestPercentage}% interest</Text>
      </View>
      <View style={styles.RoleButtonContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('NewOfferDetails', {
              offerId: offerId,
              firstName: firstName,
              lastName: lastName,
              totalAmount: totalAmount,
              interestPercentage: interestPercentage === 'Gift' ? 0 : interestPercentage,
              avatar: avatar,
              currentAmount: currentAmount,
              postTotalAmount: postTotalAmount,
              postCurrentAmount: postCurrentAmount,
            })
          }
          style={styles.ViewButtonContainer}>
          <Text style={styles.ViewButton}>{t('Details')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInRoles: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.primary500,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    alignContent: 'center',
  },

  // Numbers inside Roles

  NumberInRoles: {
    fontSize: 20,
    marginLeft: 15,
    marginRight: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.primary500,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },

  // View Button Styles

  RoleButtonContainer: {
    position: 'absolute', // To allow absolute positioning within the parent View.
    top: 10, // 10 pixels from the top of the parent View (adjust as needed).
    right: 0, // 10 pixels from the right edge of the parent View (adjust as needed).
    width: '50%',
    height: '100%',
    justifyContent: 'center',
  },

  ViewButton: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: 'bold',
  },

  ViewButtonContainer: {
    width: '42%',
    height: 40,
    backgroundColor: GlobalStyles.Colors.primary200,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 20,
    marginLeft: 60,
  },
});

export default OfferDetailSection;
