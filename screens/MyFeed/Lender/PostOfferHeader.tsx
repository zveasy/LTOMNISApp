import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FeedStackParamList} from '../../../App';
import GlobalStyles from '../../../assets/constants/colors';
import StarCircle from '../../../assets/constants/Components/Buttons/StarCircle';
import CustomOfferBlock from '../../../assets/constants/Components/CustomOfferBlock';
import SmallOfferDetailsVThree from '../../../assets/constants/Components/SmallOfferDetailsVThree';
import {ParticipantDetails} from './ParticipantDetails';

type Participant = {
  name: string;
  avatarUri?: string;
};

// Add type for the props
type PostOfferHeaderProps = {
  avatar?: string;
  firstName: string;
  lastName: string;
  number: number;
  title: string;
  totalAmount: number;
  progress: number;
  participants: Participant[]; // add this line
  description?: string;
  buttonText: string;
  interestPercentage: number;
};

// Pass the props to the function
export default function PostOfferHeader({
  avatar,
  firstName,
  lastName,
  number,
  title,
  progress,
  totalAmount,
  participants,
  description,
  buttonText,
  interestPercentage,
}: PostOfferHeaderProps) {
  const progressBarRef = useRef<View>(null);
  const calculatedProgressBarWidth =
    (Number(progress) / Number(totalAmount)) * 100;
  console.log('THESE LOGSSS ', totalAmount);
  console.log('this is description', description);

  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.setNativeProps({
        style: {width: calculatedProgressBarWidth + '%'},
      });
    }
  }, [calculatedProgressBarWidth]);

  return (
    <View style={{flexDirection: 'column', width: '100%', alignSelf: 'center'}}>
      <View style={styles.header}>
        <Avatar
          size={25}
          rounded
          source={avatar ? {uri: avatar} : undefined}
          title={`${firstName.charAt(0)}${lastName.charAt(0)}`}
          containerStyle={
            avatar
              ? {backgroundColor: GlobalStyles.Colors.primary800} // style when avatar is provided
              : {backgroundColor: 'blue'} // style when avatar is not provided
          }
        />
        <Text style={styles.NameTitle}>{`${firstName} ${lastName}`}</Text>
        <View style={styles.right}>
          <Text style={styles.textNumber}>{number}</Text>
          <Text style={styles.textScore}>Score</Text>
        </View>
      </View>
      <View style={styles.titleAmountRow}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.amountText}>{`$${totalAmount}`}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={{flexDirection: 'row', width: '100%'}}>
          <View
            ref={progressBarRef}
            style={{
              height: '100%',
              backgroundColor: GlobalStyles.Colors.primary200,
              borderRadius: 6,
            }}
          />
        </View>
      </View>
      <ParticipantDetails participants={participants} />
      <CustomOfferBlock
        data={[
          {leftText: 'Loan amount', rightText: `$${totalAmount}`},
          {leftText: 'Interest rate', rightText: `${interestPercentage.toFixed(2)}%`},
          {isDivider: true},
          {leftText: 'Remaining', rightText: `$${totalAmount - progress}`},
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          alignSelf: 'center',
          marginTop: 5,
          flexWrap: 'wrap',
        }}>
        <Text>"{description}"</Text>
      </View>
      <Pressable
        style={[
          styles.SignButton,
          {backgroundColor: GlobalStyles.Colors.primary200},
        ]}
        onPress={() => {
          navigation.navigate('PostDetails');
        }}>
        <Text style={styles.SignButtonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  textNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary100,
  },
  textScore: {
    fontSize: 12,
    color: GlobalStyles.Colors.primary100,
  },
  right: {
    marginLeft: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: GlobalStyles.Colors.primary200,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  NameTitle: {
    fontSize: 14,
    marginLeft: 10,
    marginVertical: 5,
    color: GlobalStyles.Colors.primary500,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 18,
    backgroundColor: 'rgba(120,120,128,0.08)',
    padding: 5, // Padding around the progress bar
    borderRadius: 6,
    marginTop: 20,
    width: '90%', // Set the width of the progress bar container to 80%
    alignSelf: 'center', // Center the progress bar container
  },
  amountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  progressText: {
    fontSize: 22,
    color: GlobalStyles.Colors.primary800,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 14,
    color: GlobalStyles.Colors.accent120,
  },
  offerContainer: {
    backgroundColor: GlobalStyles.Colors.primary200,
    width: '40%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  offerText: {
    fontSize: 18, // Change fontSize to a number
    color: GlobalStyles.Colors.primary100,
    fontWeight: 'bold',
  },
  titleAmountRow: {
    flexDirection: 'row', // arrange title and amount in one row
    justifyContent: 'space-between', // separate title and amount
    alignItems: 'center', // center align items vertically
    padding: 10, // add some padding
    width: '90%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 22, // set font size to 22 as specified
    color: GlobalStyles.Colors.primary800, // set the color
    fontWeight: '600',
  },
  amountText: {
    fontSize: 22, // set font size to 22 as specified
    color: GlobalStyles.Colors.primary800, // set the color
    fontWeight: '600',
  },
  SignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 48,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 80,
    alignSelf: 'center',
  },
  SignButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
