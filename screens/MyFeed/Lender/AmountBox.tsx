import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';

type InputType = 'dollar' | 'percentage';

interface AmountBoxProps {
  title: string;
  inputType: InputType;
  inputValue: string;
  onInputChange?: (value: string) => void;
  onAmountChange: (value: number) => void;
  editable?: boolean; 
  style?: object; 
}

export const AmountBox: React.FC<AmountBoxProps> = ({
  title,
  inputType,
  inputValue,
  onInputChange,
  onAmountChange,
  editable = true,
}) => {
  const placeholder = inputType === 'dollar' ? '$0.00' : '0';

  const handleChange = (text: string) => {
    // Preserve decimals but remove other non-numeric characters.
    const cleanedText = text.replace(/[^0-9.]/g, '');

    // If more than one decimal point, reject the input
    if ((cleanedText.match(/\./g) || []).length > 1) {
      return;
    }

    // Ensure two numbers after the decimal point
    const parts = cleanedText.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }

    onInputChange?.(cleanedText); // Update the parent's state

    if (onAmountChange) {
      onAmountChange(parseFloat(cleanedText));
    }
  };

  return (
    <View style={[styles.container, !editable && styles.disabledContainer]}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.box, {flexDirection: 'row', alignItems: 'center'}]}>
        <TextInput
          value={inputValue} // Use the prop here
          onChangeText={handleChange}
          style={[styles.amountText, {flex: 1}]}
          keyboardType="numeric"
          placeholder={placeholder}
          editable={editable} 
        />
        {inputType === 'percentage' && <Text style={{paddingRight: 5}}>%</Text>}
      </View>
    </View>
  );
};

// ... (Rest of the styles)


const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingStart: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
    color: GlobalStyles.Colors.primary100,
  },
  box: {
    width: '96%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: GlobalStyles.Colors.primary100,
    borderRadius: 10,
  },
  amountText: {
    fontSize: 16,
  },
  disabledContainer: {
    opacity: 0.5,
  },
});
