import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../../assets/constants/colors';
import {useNavigation} from '@react-navigation/native';
import WhiteContainer from './WhiteContainer';
import ActionItem from './ActionItem';

export default function LevelDetails() {
  const navigation = useNavigation(); // Get the navigation object
  console.log(navigation);

  const [subText, setSubText] = useState('Achieve goals and get to another level faster');
  const [title, setTitle] = useState('Goals to Complete this level');

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Levels Details"
        showBackArrow={true}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.whiteBackground}>
        <WhiteContainer
          status="bronze"
          title="Title"
          subtext="Subtext"
          statusVisible={true}
          progress={750}
        />
        <View style={{flexDirection: 'column', padding: 15, width: '100%' }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtext}>{subText}</Text>
          <ActionItem />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  whiteBackground: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    bottom: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24, // Set the font size for the title
    fontWeight: '500'
  },
  subtext: {
    fontSize: 16, // Set the font size for the subtext
  },
});
