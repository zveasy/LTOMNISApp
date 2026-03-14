import {View, Text, StyleSheet, SafeAreaView, Switch} from 'react-native';
import React from 'react';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import Feather from 'react-native-vector-icons/Feather';
import TextInputComponent from '../../../assets/constants/Components/TextInputComponent';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import {Divider} from 'react-native-elements';
import TextInputComponentWithAdd from '../../../assets/constants/Components/TextInputComponentWithAdd';
import ToggleButton from '../../../assets/constants/Components/ToggleButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppState } from '../../../ReduxStore';

export default function MakeAGroupScreen() {
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [groupTitle, setGroupTitle] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [loanVisibility, setLoanVisibility] = React.useState(false);
  const [poolEnabled, setPoolEnabled] = React.useState(false);
  const [maxLoanAmount, setMaxLoanAmount] = React.useState('');
  const token = useSelector((state: AppState) => state.token);

  const VisibilityExposure = async () => {
    try {
      const submissionData = {
        title: groupTitle,
        description: groupDescription,
        isPrivate: isPrivate, 
        isFeatured: isFeatured,
        loanVisibility: loanVisibility,
        poolEnabled: poolEnabled,
        maxLoanAmount: parseFloat(maxLoanAmount) || 0,
      };

      console.log('Submitting the following data:', submissionData);

      const options = {
        method: 'POST',
        url: 'http://localhost:8080/api/omnis/group/creategroup',
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: submissionData,
      };
      const res = await axios(options);
      console.log('Response from options:', res.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Make a group"
        showBackArrow={true}
        onBackPress={() => {
          
        }}
      />
      <TextInputComponent
        title="Title"
        placeholder="Enter group name"
        keyboardType="default"
        onChangeText={text => setGroupTitle(text)}
      />
      <TextInputComponent
        title="Description"
        placeholder="Write a short description"
        keyboardType="default"
        onChangeText={text => setGroupDescription(text)}
        inputHeight={110}
      />
      <TextInputComponentWithAdd
        title="Tag Friends"
        keyboardType="default"
        onChangeText={text => console.log(text)}
        isAmount={true}
      />
      <View style={styles.uploadImage}>
        <Text style={styles.uploadImageText}>Upload Image</Text>
        <Feather
          name={'upload'}
          size={20}
          color={GlobalStyles.Colors.primary200}
        />
      </View>
      <Divider
        width={2}
        color={'rgba(256,256,256,0.04)'}
        style={{width: '90%', borderRadius: 10, alignSelf: 'center'}}
      />
      <ToggleButton
        title="Visibility"
        toggleTexts={['Private', 'Public']}
        onToggle={activeText => {
          setIsPrivate(activeText === 'Public');
          console.log('Visibility:', activeText);
        }}
      />

      <ToggleButton
        title="Exposure"
        toggleTexts={['Regular', 'Featured']}
        onToggle={activeText => {
          setIsFeatured(activeText === 'Featured');
          console.log('Exposure:', activeText);
        }}
      />

      <Divider
        width={2}
        color={'rgba(256,256,256,0.04)'}
        style={{width: '90%', borderRadius: 10, alignSelf: 'center', marginTop: 16}}
      />

      <View style={styles.toggleSection}>
        <Text style={styles.toggleSectionTitle}>Loan Visibility</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleRowText}>
            Members can see loan requests from other members
          </Text>
          <Switch
            trackColor={{
              false: '#767577',
              true: GlobalStyles.Colors.primary200,
            }}
            thumbColor={loanVisibility ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setLoanVisibility(!loanVisibility)}
            value={loanVisibility}
          />
        </View>
      </View>

      <View style={styles.toggleSection}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleRowText}>Pool Enabled</Text>
          <Switch
            trackColor={{
              false: '#767577',
              true: GlobalStyles.Colors.primary200,
            }}
            thumbColor={poolEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setPoolEnabled(!poolEnabled)}
            value={poolEnabled}
          />
        </View>
      </View>

      <TextInputComponent
        title="Max Loan Amount for Group Members"
        placeholder="Enter max loan amount"
        keyboardType="numeric"
        onChangeText={text => setMaxLoanAmount(text)}
        isAmount={true}
      />

      <CompleteButton
        text="Submit"
        color={GlobalStyles.Colors.primary200}
        onPress={VisibilityExposure}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  uploadImage: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadImageText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  featured: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
  },
  toggleSection: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
  },
  toggleSectionTitle: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleRowText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
});
