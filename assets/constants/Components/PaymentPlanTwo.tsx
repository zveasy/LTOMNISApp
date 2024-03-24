import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Divider} from 'react-native-elements';
import {t} from 'i18next';
import GlobalStyles from '../colors';
import StarCircle from './Buttons/StarCircle';

type OfferBigContainerProps = {
  title: string;
  fullNumber: number;
  offerId: string;
  onSelect: any;
  monthDuration?: number;
  isSelected: any;
  users: {
    firstNameLetter: string;
    lastNameLetter: string;
    userName: string;
    amount: number;
    interest: number;
  }[];
};

const PaymentPlanBoxTwo: React.FC<OfferBigContainerProps> = ({
  title,
  offerId,
  fullNumber,
  users = [],
  onSelect,
  isSelected,
}) => {
  const monthDuration = Number(title.split(' ')[0]);
  const [isChosen, setIsChosen] = useState(false);

  const calculateMonthlyPayment = (
    amount: number,
    interest: number,
    duration: number,
  ): number => {
    const interestDecimal = interest / 100;
    const totalWithInterest = amount * (1 + interestDecimal);
    return totalWithInterest / duration;
  };

  let monthlyPayment = 0;
  if (users.length > 0) {
    monthlyPayment = calculateMonthlyPayment(
      fullNumber,
      users[0].interest,
      monthDuration,
    );
  }

  const getRewardPointsBasedOnMonths = (months: number) => {
    switch (months) {
      case 3:
        return 250;
      case 6:
        return 500;
      case 12:
        return 800;
      default:
        return 100;
    }
  };

  const calculateStartPayDate = () => {
    const currentDate = new Date();
    const twoWeeksLater = new Date(
      currentDate.getTime() + 14 * 24 * 60 * 60 * 1000,
    ); // Add 14 days
    const day = twoWeeksLater.getDate();
    const month = twoWeeksLater.getMonth() + 1; // JavaScript months are 0-based
    const year = twoWeeksLater.getFullYear();
    return `${day < 10 ? '0' + day : day}.${
      month < 10 ? '0' + month : month
    }.${year}`;
  };

  const startPayDate = calculateStartPayDate();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainerTitle}>
        <Text style={styles.TitleOfferLeftText}>{monthDuration} months</Text>
        <View style={styles.rewardPointsContainer}>
          <StarCircle iconName="star-four-points-outline" />
          <Text style={styles.TitleOfferRightText}>
            {getRewardPointsBasedOnMonths(Number(title.split(' ')[0]))}
          </Text>
        </View>
      </View>
      {users.map((user, index) => {
        const monthlyPayment = calculateMonthlyPayment(
          fullNumber,
          user.interest,
          monthDuration,
        );
        return (
          <View key={index} style={styles.userContainer}>
            <Text style={styles.TextInRoles}>{user.interest}% interest</Text>
            <Divider orientation="vertical" width={1} />
            <Text style={styles.NumberInRoles}>{startPayDate}</Text>
          </View>
        );
      })}

      <Divider
        width={1}
        style={styles.divider}
        color={GlobalStyles.Colors.accent250}
      />
      <View style={styles.innerContainerBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.monthlyAmount}>{`$${monthlyPayment.toFixed(
            2,
          )}`}</Text>
          <Text style={styles.perMonth}>{t('perMonth')}</Text>
        </View>
        <Pressable
          onPress={() => {
            const newIsChosen = !isChosen;
            setIsChosen(newIsChosen);
            if (newIsChosen) {
              const planDetails = {
                title,
                offerId,
                startPayDate: startPayDate,
                monthDuration: monthDuration,
                monthlyPayment,
              };
              console.log('Selecting Plan:', planDetails);
              onSelect(planDetails);
            }
          }}
          style={({pressed}) => [
            styles.viewButtonBefore,
            isChosen && styles.selectedButtonBefore,
            pressed && styles.pressedButtonBefore,
          ]}>
          <Text
            style={[
              styles.viewButton,
              isChosen && styles.selectedButtonTextStyle,
            ]}>
            {isChosen ? t('Chosen') : t('Choose')}
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
  viewButton: {
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
    borderRadius: 20,
  },
  selectedButtonTextStyle: {
    color: GlobalStyles.Colors.primary100,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  viewButtonBefore: {
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.primary200,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  selectedButtonBefore: {
    backgroundColor: GlobalStyles.Colors.primary200,
    color: GlobalStyles.Colors.primary200,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  pressedButtonBefore: {
    color: GlobalStyles.Colors.primary200,
  },
});

export default PaymentPlanBoxTwo;

