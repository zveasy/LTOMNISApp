import {View, Text, SafeAreaView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import {StyleSheet} from 'react-native';
import GlobalStyles from '../../../../assets/constants/colors';
import PaymentPlanBox from '../../../../assets/constants/Components/PaymentPlanBox';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {t} from 'i18next';
import {HomeStackParamList} from '../../../../App';


type ChoosePaymentPlanScreenProps = {
  route: RouteProp<HomeStackParamList, 'ChoosePaymentPlanScreen'>;
};

// Notes: http://localhost:8080/api/omnis/paymentplan/create

type PlanDetailsType = {
  offerId: string;
  interestPercentage: number;
  term: number;
  monthlyPayment: number;
  totalAmount: number;
  postCurrentAmount: number;
};

const ChoosePaymentPlanScreen: React.FC<ChoosePaymentPlanScreenProps> = ({
  route,
}) => {
  const {offerId, interestPercentage, totalAmount, postCurrentAmount, postTotalAmount, totalWithInterest, firstName, lastName} = route.params;
  const [selectedPlan, setSelectedPlan] = useState<PlanDetailsType | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const handleSelectPlan = (planDetails: PlanDetailsType) => {
    if (selectedPlan && selectedPlan.term === planDetails.term) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(planDetails);
    }
  };

console.log('firstName + lastName', firstName + ' ' + lastName)

  // useEffect to navigate when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      navigation.navigate('PaymentChosenScreen', {
        ...selectedPlan,
        offerId: offerId,
        firstName: firstName,
        lastName: lastName,
        postCurrentAmount: postCurrentAmount,
        postTotalAmount: postTotalAmount,
        totalWithInterest: totalWithInterest,
        interestPercentage: interestPercentage,
      });
    }
  }, [selectedPlan, navigation, offerId, interestPercentage]);

  return (
    <View style={styles.Background}>
      <View style={styles.contentContainer}>
        <ScreenTitle
          title={t('choosePaymentPlan')}
          showBackArrow={true}
          onBackPress={() => {
            navigation.goBack();
          }}
        />
        <View
          style={{
            backgroundColor: GlobalStyles.Colors.primary100,
            borderRadius: 24,
            flex: 1,
          }}>
          {[3, 6, 12].map(duration => (
            <PaymentPlanBox
              key={duration}
              term={duration}
              offerId={offerId}
              fullNumber={totalAmount}
              isSelected={selectedPlan?.term === duration}
              onSelect={handleSelectPlan}
              users={[
                {
                  interest: interestPercentage,
                  amount: totalAmount,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ChoosePaymentPlanScreen;

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
    paddingTop: 60,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
  },
});
