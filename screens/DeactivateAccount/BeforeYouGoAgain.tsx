import {View, Text, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import RowWithRadioButton from '../MyProfile/RowWithRadioButton';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import IconWithText from './IconWithText';
import BottomSheet from '../MyProfile/BottomSheet';

export default function BeforeYouGoAgain() {
    const [isSheetVisible, setSheetVisible] = useState(false);

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title={'Deactivate Your Account'} />
      <Text style={styles.subText}>We are sorry to see you go</Text>
      <View style={styles.container}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.title}>Deleting your account will do the following:</Text>
        </View>
        <View style={{marginTop: 40, width: '100%'}}>
        <IconWithText text="Log you out on all devices" />
        <IconWithText text="Delete all of your account information" />
        <IconWithText text="Delete all you OMNIS Score progress" />
        </View>
      </View>
      <CompleteButton text='Deactivate Account'           
      onPress={() => setSheetVisible(true)}
 />
      <BottomSheet
        isVisible={isSheetVisible}
        title="Your account was deactivated"
        subText="Thank you for being with us!"
        button1Text="Goodbye!"
        button1Color={GlobalStyles.Colors.primary200}
        onButton1Press={() => {
          console.log('Button 1 pressed');
          setSheetVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  subText: {
    fontSize: 13,
    color: GlobalStyles.Colors.accent100,
  },
  container: {
    flexDirection: 'column',
    width: '98%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600', // Semibold
    color: 'white',
  },
  inputBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    color: 'black',
  },
});
