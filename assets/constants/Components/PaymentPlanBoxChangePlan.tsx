import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Divider} from 'react-native-elements';
import {HomeStackParamList} from '../../../App';
import GlobalStyles from '../colors';
import StarCircle from './Buttons/StarCircle';

type OfferBigContainerProps = {
  title: string;
  offerNumber: number;
  raiseNumber: number;
  fullNumber: number;
  interestPercentage: number;
  monthDurationPost: number;
  ppm: number;
  rewardNumber: number;
  users: {
    firstNameLetter: string;
    lastNameLetter: string;
    userName: string;
    amount: number;
    interest: number;
  }[];
};

const PaymentPlanBoxChangePlan: React.FC<OfferBigContainerProps> = ({
  title,
  interestPercentage,
  monthDurationPost,
  rewardNumber,
  users = [],
  ppm,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainerTitle}>
        <Text
          style={
            styles.TitleOfferLeftText
          }>{`${monthDurationPost} months`}</Text>
        <View style={styles.rewardPointsContainer}>
          <StarCircle iconName="star-four-points-outline" />
          <Text style={styles.TitleOfferRightText}>{rewardNumber}</Text>
        </View>
      </View>

      {users.map((user, index) => (
        <View key={index} style={styles.userContainer}>
          <Text
            style={
              styles.TextInRoles
            }>{`${interestPercentage}% interest`}</Text>
          <Divider orientation="vertical" width={1} />
          <Text style={styles.NumberInRoles}>TBD</Text>
        </View>
      ))}

      <Divider
        width={1}
        style={styles.divider}
        color={GlobalStyles.Colors.accent250}
      />

      <View style={styles.innerContainerBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.monthlyAmount}>${ppm}</Text>
          <Text style={styles.perMonth}> /month</Text>
        </View>
        <Pressable
          style={[styles.ViewButtonContainer, styles.selectedButtonStyle]}
          onPress={() => {
            navigation.pop(2);
          }}>
          <Text style={[styles.ViewButton, styles.selectedButtonTextStyle]}>
            Change Plan
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 343,
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    marginTop: 16,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  innerContainerTitle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainerBar: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
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
  NumberInRoles: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.accent300,
    textAlign: 'center',
    fontFamily: 'San Francisco',
    fontWeight: '500',
  },
  TextInRoles: {
    fontSize: 14,
    marginLeft: 18,
    marginRight: 8,
    marginBottom: 6,
    color: GlobalStyles.Colors.accent300,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'San Francisco',
  },
  amount: {
    color: GlobalStyles.Colors.primary500,
    fontFamily: 'San Francisco',
    fontSize: 22,
    fontWeight: '500',
  },
  perMonth: {
    color: GlobalStyles.Colors.accent300,
    fontFamily: 'San Francisco',
    fontSize: 14,
    fontWeight: '500',
  },
  ViewButton: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'San Francisco',
    fontWeight: 'bold',
  },
  ViewButtonContainer: {
    width: '40%',
    height: 40,
    borderColor: GlobalStyles.Colors.primary200,
    borderWidth: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between',
  },
  monthlyAmount: {
    color: GlobalStyles.Colors.primary500,
    fontFamily: 'San Francisco',
    fontSize: 22,
    fontWeight: '500',
  },
  selectedButtonStyle: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  selectedButtonTextStyle: {
    color: GlobalStyles.Colors.primary100,
  },
});

export default PaymentPlanBoxChangePlan;
