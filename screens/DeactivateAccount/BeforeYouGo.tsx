import {View, Text, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import RowWithRadioButton from '../MyProfile/RowWithRadioButton';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export default function BeforeYouGo() {
  const [selectedIndex, setIndex] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle showBackArrow={true} title={'Deactivate Your Account'} />
      <Text style={styles.subText}>We are sorry to see you go</Text>
      <View style={styles.container}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.title}>Before you go...</Text>
          <Text style={styles.title}>
            Why are you deactivating your account?
          </Text>
        </View>
        <View style={{marginTop: 40, width: '100%'}}>
          <RowWithRadioButton
            title="I don't need it anymore"
            isSelected={selectedIndex === 0}
            onSelected={() => setIndex(0)}
          />
          <RowWithRadioButton
            title="I'm switching to someone else"
            isSelected={selectedIndex === 1}
            onSelected={() => setIndex(1)}
          />
          <RowWithRadioButton
            title="Other"
            isSelected={selectedIndex === 2}
            onSelected={() => setIndex(2)}
          />
          {selectedIndex === 2 && (
            <TextInput
              style={styles.inputBox}
              value={otherReason}
              onChangeText={setOtherReason}
              placeholder="Please specify the reason"
            />
          )}
        </View>
      </View>
      <CompleteButton text="Deactivate Account" onPress={() => navigation.navigate('HomeStackNavigator', {screen: 'BeforeYouGoAgain'})} />
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
    fontSize: 16,           // Increase the font size
    height: 50,             // Increase the height
    padding: 10,            // Add some padding for appearance
    borderRadius: 5,
    flexWrap: 'wrap',       // Flex wrap
    width: '100%',          // Assuming you want it to span the width of its parent
    backgroundColor: 'white',
  },
});
