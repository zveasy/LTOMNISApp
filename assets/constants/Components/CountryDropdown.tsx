import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  // ... more countries
];

interface CountryDropdownProps {
    onValueChange: (value: string | null) => void;
  }
  
  const CountryDropdown: React.FC<CountryDropdownProps> = ({ onValueChange }) => {
  return (
    <RNPickerSelect
      onValueChange={onValueChange}
      items={countries}
      placeholder={{ label: 'Select a country...', value: null }}
    />
  );
};

export default CountryDropdown;
