import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../../../assets/constants/colors';
import SmallOfferDetailsVOne from '../../../../assets/constants/Components/SmallOfferDetailsVOne';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../../App';
import {t} from 'i18next';

type SuccessOfferProps = {
  receivedAmount?: string;
  offerId: string;
  interestPercentage: number;
  monthDuration: number;
  monthlyPayment: number;
  rewardNumber: number;
  fullNumber: number;
  postCurrentAmount: number;
  postTotalAmount: number;
  totalWithInterest: number;
  firstName: string;
  lastName: string;
};

const SuccessOffer: React.FC<SuccessOfferProps> = ({
  receivedAmount = '$15',
}) => {
  const route =
    useRoute<RouteProp<{params: PaymentChosenScreenRouteParams}, 'params'>>();
  const {
    offerId,
    interestPercentage,
    monthDuration,
    monthlyPayment,
    rewardNumber,
    fullNumber,
    postCurrentAmount,
    postTotalAmount,
    totalWithInterest,
    firstName,
    lastName,
  } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const getCurrentDateTimeStamp = () => {
    const now = new Date();

    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const day = now.getDate();
    const year = now.getFullYear();

    const hours = now.getHours(); // 24-hour format
    const minutes = now.getMinutes();

    // Format the month, day, hours, and minutes to ensure two digits
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedMonth}/${formattedDay}/${year}, ${formattedHours}:${formattedMinutes}`;
  };

  const datetimeStamp = getCurrentDateTimeStamp();

  return (
    <SafeAreaView style={styles.Background}>
      <View
        style={{
          flexDirection: 'column',
          width: '90%',
          alignSelf: 'center',
          marginTop: 20,
        }}>
        <ScreenTitle
          showRightIcon={true}
          rightIconType="Feather"
          rightIconName="upload"
          onRightIconPress={() => {}}
        />
        <View style={styles.AlignItems}>
          <Icon
            name="checkmark-circle-outline"
            size={50}
            color={GlobalStyles.Colors.primary200}
          />
        </View>
        <View style={styles.AlignItems}>
          <Text style={{fontSize: 16, color: 'rgba(256,256,256, 0.4)'}}>
            You just received
          </Text>
        </View>
      </View>
      <View>
        <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 48}}>
          {receivedAmount}
        </Text>
      </View>
      <SmallOfferDetailsVOne
        title={t('OfferDetails')}
        rightWords={[
          datetimeStamp.split(', ')[0], // Date part
          datetimeStamp.split(', ')[1], // Time part
          firstName + ' ' + lastName,
          `4%`,
          `$${fullNumber}`,
          `$${monthlyPayment}`,
          `${interestPercentage}%APR, ${monthDuration} months`,
        ]}
      />
      <CompleteButton
        onPress={() => {
          navigation.pop(4);
        }}
        text={t('Done')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  AlignItems: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SuccessOffer;
