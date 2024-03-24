import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import React from 'react';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import {SafeAreaView} from 'react-native';
import TextInputComponent from '../../../assets/constants/Components/TextInputComponent';
import TextInputComponentWithAdd from '../../../assets/constants/Components/TextInputComponentWithAdd';
import ToggleButton from '../../../assets/constants/Components/ToggleButton';
import {Switch} from 'react-native';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import CostPercentageComponent from '../../../assets/constants/Components/CostPercentageComponent';
import {SpotlightStackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const GroupBill = () => {
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [splitMethod, setSplitMethod] = React.useState('Equal');
  const navigation =
    useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();
  const users = [
    {firstName: 'User1', lastName: 'A', type: 'custom', avatar: true},
    {firstName: 'User2', lastName: 'B', type: 'custom', avatar: true},
    // ...add more users
  ];

  const totalAmount = 120.2;
  const equalSplit = (totalAmount / users.length).toFixed(2);
  const equalPercentage = (100 / users.length).toFixed(2);

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Create a group bill"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={{marginTop: 20, alignSelf: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              color: 'rgba(256, 256, 256, 0.5)',
              fontSize: 16,
            }}>
            Total Amount
          </Text>
          <Text style={{color: GlobalStyles.Colors.primary100, fontSize: 48}}>
            $120.20
          </Text>
        </View>
        <TextInputComponent
          title="Title"
          placeholder="Your custom placeholder here"
          keyboardType="default"
          onChangeText={text => console.log(text)}
        />
        <TextInputComponent
          title="Description"
          placeholder="Write a short description"
          keyboardType="default"
          onChangeText={text => console.log(text)}
          inputHeight={110}
        />

        <TextInputComponentWithAdd
          title="Participants"
          keyboardType="default"
          onChangeText={text => console.log(text)}
          isAmount={true}
        />

        <ToggleButton
          title="Split the bill"
          toggleTexts={['Equal', 'Custom']}
          onToggle={activeText => {
            setSplitMethod(activeText);
            console.log('Toggled:', activeText);
          }}
        />
        <View style={{width: '98%', alignSelf: 'center', marginTop: 8}}>
          <>
            {splitMethod === 'Equal' ? (
              <CostPercentageComponent
                costTitle={`Cost`}
                percentageTitle={`Percentage`}
                costPlaceholder={equalSplit}
                percentagePlaceholder={equalPercentage}
                avatar={false}
              />
            ) : (
              users.map((user, index) => (
                <CostPercentageComponent
                  key={index}
                  costTitle="Cost"
                  percentageTitle="Percentage"
                  firstName={user.firstName}
                  lastName={user.lastName}
                  type={user.type}
                  avatar={user.avatar}
                />
              ))
            )}
          </>
        </View>

        <View style={styles.featured}>
          <Text style={styles.featuredText}>Set a deadline</Text>
          <Switch
            trackColor={{
              false: '#767577',
              true: GlobalStyles.Colors.primary200,
            }}
            thumbColor={isFeatured ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsFeatured(!isFeatured)}
            value={isFeatured}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CompleteButton
            text="Create bill"
            color={GlobalStyles.Colors.primary200}
            onPress={() => {
              navigation.pop(3);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupBill;

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  featured: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  scrollViewContainer: {
    flexDirection: 'column',
    paddingHorizontal: 5, // Added padding to prevent content from going off-screen
    paddingBottom: 5, // Padding at the bottom to allow for some space at the end of the scroll
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '20%', // Gives some space from the above component
  },
});
