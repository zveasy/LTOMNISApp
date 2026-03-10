import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import FeedTopTabs from './FeedTopTabs';
import Header from './Header';
import {StackScreenProps} from '@react-navigation/stack';
import {FeedStackParamList} from '../../App';
import {useDispatch, useSelector} from 'react-redux';
import {AppState, setFirstName} from '../../ReduxStore';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';

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

// Using FeedStackParamList defined in App.tsx
/* type MyFeedStackParamList = {
  MyFeedScreen: {
    prop1?: Type1;
    prop2?: Type2;
  };
  // Add other screens if you have params for them
}; */

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
  StackScreenProps<FeedStackParamList, 'MyFeedScreen'>
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
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Header
            firstName={firstName}
            lastName={lastName}
            avatarImage={avatarImage}
          />
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('PostSearchFilter')}>
          <Feather
            name="search"
            size={22}
            color={GlobalStyles.Colors.primary100}
          />
        </TouchableOpacity>
      </View>
      <FeedTopTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  searchButton: {
    padding: 10,
    marginRight: 10,
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
