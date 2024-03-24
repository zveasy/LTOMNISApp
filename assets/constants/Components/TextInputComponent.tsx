import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import GlobalStyles from '../colors';

interface TextInputComponentProps {
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
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  title,
  placeholder = '',
  keyboardType = 'default',
  onChangeText,
  inputHeight = 50,
  isAmount = false,
}) => {
  const [textValue, setTextValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleChangeText = (text: string) => {
    if (isAmount) {
      let formattedText = text.replace(/[^0-9.]/g, '');
      if (formattedText.includes('.')) {
        formattedText = formattedText.replace(/\.+/g, '.');
        formattedText = formattedText.replace(/(\.\d{2}).+/g, '$1');
      }
      setIsValid(
        !formattedText.includes('.') ||
          /^(\d+(\.\d{0,2})?)$/.test(formattedText),
      );
      setTextValue(formattedText);
      onChangeText && onChangeText(`$${formattedText}`);
    } else {
      setTextValue(text);
      onChangeText && onChangeText(text);
    }
  };

  return (
    <View style={styles.customComponentContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <View
        style={[
          styles.inputField,
          {
            height: inputHeight,
            borderColor: isValid ? 'rgba(255,255,255, 0.6)' : 'red',
          },
        ]}>
        {isAmount && <Text style={styles.dollarSign}>$</Text>}
        <TextInput
          style={[styles.textInput, {paddingTop: 10}]} // Adding padding to align text to top
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255, 0.6)"
          keyboardType={keyboardType}
          onChangeText={handleChangeText}
          value={textValue}
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
    alignItems: 'flex-start', // Aligning items to start
    paddingVertical: 5, // Adding vertical padding
    width: '90%',
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },
  dollarSign: {
    paddingHorizontal: 10,
    color: '#fff',
    marginTop: 10, // Adding top margin to align with text input
  },
  textInput: {
    color: '#fff',
    flex: 1,
    paddingHorizontal: 10,
    textAlignVertical: 'top', // Aligning text to the top
  },
  // ...rest of your styles
});

export default TextInputComponent;
