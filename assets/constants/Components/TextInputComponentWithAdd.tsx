import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Chip} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { SpotlightStackParamList } from '../../../App';
import GlobalStyles from '../colors';

interface TextInputComponentWithAddProps {
  title: string;
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'number-pad'
    | 'decimal-pad'
    | 'email-address'
    | 'phone-pad';
  onChangeText?: (text: string) => void;
  inputHeight?: number;
  isAmount?: boolean;
  chips?: string[]; // Added chips property as optional
}

const TextInputComponentWithAdd: React.FC<TextInputComponentWithAddProps> = ({
  title,
  placeholder = '',
  keyboardType = 'default',
  inputHeight = 50,
  chips: initialChips = [
    '@easy',
    '@user2',
    '@user3',
    '@user2',
    '@user3',
    '@user3',
    '@user2',
  ], // Providing default dummy chips
}) => {
  const [textValue, setTextValue] = useState<string>('');
  const [chips, setChips] = useState<string[]>(initialChips); // Initializing with dummy chips
  const [isValid, setIsValid] = useState<boolean>(true);

  const addChip = (): void => {
    if (textValue.trim()) {
      setChips(prev => [...prev, `@${textValue.trim()}`]);
      setTextValue('');
    }
  };
  const navigation = useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();
  return (
    <View style={styles.customComponentContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
          alignSelf: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text style={styles.titleText}>{title}</Text>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: 'rgba(95, 95, 95, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
          onPressIn={() => navigation.navigate('ChooseFriends')}
            name={'add'}
            size={20}
            color={GlobalStyles.Colors.primary100}
            onPress={addChip}
          />
        </View>
      </View>

      <View
        style={[
          styles.inputField,
          {
            flexDirection: 'column',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start', // Adjusted to align items at the start
            marginBottom: 5,
          }}>
          {chips.map((chip, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                backgroundColor: GlobalStyles.Colors.primary200,
                borderRadius: 16,
                paddingVertical: 4,
                paddingHorizontal: 8,
                margin: 5, // Adjusted margin to add vertical spacing
                alignItems: 'center',
                minWidth: 80,
              }}>
              <Text style={{color: 'white', flexShrink: 1}}>{chip}</Text>
              <Icon
                name="close"
                size={16}
                color="white"
                style={{marginLeft: 8}}
                onPress={() => {
                  setChips(chips.filter((_, chipIndex) => chipIndex !== index));
                }}
              />
            </View>
          ))}
        </View>
        <TextInput
          style={[
            styles.textInput,
            {
              paddingTop: 5,
              minHeight: 5, // Set a minimum height
              maxHeight: 5, // Adjust as necessary
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255, 0.6)"
          keyboardType={keyboardType}
          onChangeText={setTextValue}
          value={textValue}
          multiline // Allow the TextInput to expand over multiple lines
          numberOfLines={10} // Set a max number of lines to prevent it from growing indefinitely
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customComponentContainer: {
    marginBottom: 8,
    alignSelf: 'center',
    width: '98%',
  },
  titleText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
    alignSelf: 'center',
    width: '90%',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    width: '90%',
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },
  textInput: {
    color: '#fff',
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default TextInputComponentWithAdd;
