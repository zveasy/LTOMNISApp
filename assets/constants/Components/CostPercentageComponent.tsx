import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Avatar, Divider} from 'react-native-elements';
import GlobalStyles from '../colors';

interface CostPercentageComponentProps {
  costTitle: string;
  percentageTitle: string;
  costPlaceholder?: string;
  percentagePlaceholder?: string;
  onCostChange?: (text: string) => void;
  onPercentageChange?: (text: string) => void;
  avatar?: boolean;
  firstName?: string; // Add firstName prop
  lastName?: string; // Add lastName prop
  type?: string; // Add type prop to distinguish between custom and equal
}

const CostPercentageComponent: React.FC<CostPercentageComponentProps> = ({
  costTitle,
  percentageTitle,
  onCostChange,
  onPercentageChange,
  avatar = false,
  firstName = '', // Add default value for firstName
  lastName = '', // Add default value for lastName
  type = 'equal', // Default value is 'equal'
  costPlaceholder = '',
  percentagePlaceholder = '',
}) => {
  const firstNameLetter = firstName.charAt(0);
  const lastNameLetter = lastName.charAt(0);

  const [costValue, setCostValue] = useState('');
  const [percentageValue, setPercentageValue] = useState('');

  useEffect(() => {
    setCostValue(costPlaceholder);
    setPercentageValue(percentagePlaceholder);
  }, [costPlaceholder, percentagePlaceholder]);

  return (
    <View style={styles.container}>
      {avatar && (
        <View style={styles.avatarContainer}>
          <Avatar
            size={25}
            rounded
            title={
              firstName && lastName
                ? `${firstNameLetter}${lastNameLetter}`
                : 'NA'
            }
            containerStyle={{backgroundColor: GlobalStyles.Colors.primary100}}
            titleStyle={{
              color: GlobalStyles.Colors.primary210,
              fontWeight: 'bold',
              fontSize: 9,
            }}
          />
          <Text
            style={{
              left: 8,
              color: GlobalStyles.Colors.primary100,
              fontSize: 16,
              fontWeight: '500',
            }}>
            {firstName} {lastName}
          </Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <View style={styles.column}>
          <Text style={styles.title}>{costTitle}</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputSymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder={costValue}
              keyboardType="numeric"
              onChangeText={onCostChange}
            />
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.title}>{percentageTitle}</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputSymbol}>%</Text>
            <TextInput
              style={styles.input}
              placeholder={percentageValue}
              keyboardType="numeric"
              onChangeText={onPercentageChange}
            />
          </View>
        </View>
      </View>
      {type === 'custom' && (
        <Divider
          width={1}
          color={GlobalStyles.Colors.accent200}
          style={styles.divider}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '90%',
    alignSelf: 'center',
  },
  column: {
    width: '45%',
    alignItems: 'flex-start',
  },
  title: {
    marginBottom: 4,
    color: GlobalStyles.Colors.accent100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderColor: GlobalStyles.Colors.primary210,
    borderWidth: 1,
    padding: 8,
    height: 40,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 4,
    paddingTop: 2, // Adding left padding to create space between the symbol and the input text
  },
  inputSymbol: {
    padding: 4,
    fontSize: 16,
    color: GlobalStyles.Colors.primary210,
    alignItems: 'center',
  },
  avatarContainer: {
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    marginTop: 20,
  },
});

export default CostPercentageComponent;
