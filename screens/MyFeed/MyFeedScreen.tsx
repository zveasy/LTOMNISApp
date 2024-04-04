import {View, StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import FeedTopTabs from './FeedTopTabs';
import Header from './Header';
import {StackScreenProps} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppState, setFirstName} from '../../ReduxStore';
import axios from 'axios';

type Type1 = {
  property: string;
};

type Type2 = {
  property: string;
};

export type MyFeedScreenProps = {
  MyFeedScreen: {
    prop1?: Type1;
    prop2?: Type2;
  };
};

type MyFeedStackParamList = {
  MyFeedScreen: {
    prop1?: Type1;
    prop2?: Type2;
  };
  // Add other screens if you have params for them
};

let defaultValue1: Type1 = {
  property: 'defaultValue1',
};

let defaultValue2: Type2 = {
  property: 'defaultValue2',
};

export type MyFeedScreenNavigationProps = StackScreenProps<
  MyFeedScreenProps,
  'MyFeedScreen'
>;

const MyFeedScreen: React.FC<
  StackScreenProps<MyFeedStackParamList, 'MyFeedScreen'>
> = ({navigation, route}) => {
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');

  const firstName = useSelector((state: AppState) => state.userFirstLast.firstName) 
  const lastName = useSelector((state: AppState) => state.userFirstLast.lastName) 
  console.log('this is Feed Screen F', firstName)

  const {} = route.params || {}; // default to an empty object if route.params is undefined

  const avatarImage = ''; // Assuming you'd get this from props or somewhere else

  return (
    <SafeAreaView style={styles.background}>
      <Header
        firstName={firstName}
        lastName={lastName}
        avatarImage={avatarImage}
      />
      <FeedTopTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  whiteBackground: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    flex: 1,
    alignItems: 'center',
  },
  TitleOfferText: {
    fontSize: 16,
  },
});

export default MyFeedScreen;
