import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../colors';
import OfferDetailSectionLender from './OfferDetailSectionLender';
import StarCircle from './Buttons/StarCircle';



interface MediumBigContainerProps {
  targetScreen: string;
  title: string;
  firstName: string;
  lastName: string;
  avatarImage?: string; // Marked as optional
  userName?: string; // Marked as optional
  amount: number;
  interest: number;
  offerId: string;
  timeElapsed: string;
}


const MediumBigContainer: React.FC<MediumBigContainerProps> = ({
    title,
    firstName,
    lastName,
    avatarImage,
    userName,
    amount,
    interest,
    targetScreen,
    timeElapsed,
    offerId,
  }) => {

    const formattedAmount = amount?.toLocaleString() || '0';

    console.log('firstNameLetter', firstName)
    console.log('lastNameLetter', lastName)


    return (
      <View style={styles.container}>
        <View style={styles.innerContainerTitle}>
          <Text style={styles.TitleOfferLeftText}>{title}</Text>
          <View style={styles.rewardPointsContainer}>
            <StarCircle iconName="star-four-points-outline" />
            <Text style={styles.TitleOfferRightText}>300</Text>
          </View>
        </View>
  
        <View style={{ width: '100%', alignSelf: 'center' }}>
          <OfferDetailSectionLender targetScreen={targetScreen}
            offers={[
              {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                amount: amount,
                interest: interest,
                offerId: offerId,
                timeElapsed: timeElapsed,
              },
            ]}
          />
        </View>
      </View>
    );
  };
  
  export default MediumBigContainer;
  

const styles = StyleSheet.create({
  container: {
    width: 343,
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    marginTop: 16,
    paddingBottom: 20,
  },
  innerContainerTitle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 32,
    justifyContent: 'space-between',
  },
  innerContainerBar: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  TitleOfferText: {
    fontSize: 18,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '92%',
    height: 18,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(120,	120, 128, 0.08)',
    alignSelf: 'center',
  },
  progressBar: {
    marginVertical: 4,
    borderRadius: 10,
    height: 10,
    width: '98%',
  },
  TitleOfferRightText: {
    fontSize: 16,
    fontFamily: 'San Francisco',
    fontWeight: '500',
    color: GlobalStyles.Colors.primary510,
  },
  TitleOfferLeftText: {
    fontSize: 18,
    fontFamily: 'San Francisco',
    fontWeight: '500',
    color: GlobalStyles.Colors.primary200,
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
  },
});
