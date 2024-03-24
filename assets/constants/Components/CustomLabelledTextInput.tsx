import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import GlobalStyles from '../colors';

interface Props {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'phone-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  autoCorrect?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string; // for validation errors
}

const CustomLabelledTextInput: React.FC<Props> = ({
  label,
  placeholder,
  onChangeText,
  value,
  keyboardType = 'default',
  autoCorrect = false,
  autoCapitalize = 'sentences',
  error,
}) => {
  // State to track focus
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.textInput,
          isFocused ? styles.textInputFocused : null,
          value ? styles.textActive : null,
          error ? styles.errorBorder : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor={GlobalStyles.Colors.primary100}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 8,
    width: '90%',
  },
  labelContainer: {
    marginBottom: 4,
  },
  labelText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
  },
  errorBorder: {
    borderColor: GlobalStyles.Colors.primary300,
  },
  errorText: {
    color: GlobalStyles.Colors.primary300,
    marginTop: 4,
    fontSize: 12,
  },
  textInput: {
    borderColor: GlobalStyles.Colors.accent100,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 12,
    color: GlobalStyles.Colors.primary100,
    fontWeight: '500', // Default font weight
    fontSize: 16,
  },
  textInputFocused: {
    fontWeight: 'bold', // Font weight when input is focused
  },
});

export default CustomLabelledTextInput;
