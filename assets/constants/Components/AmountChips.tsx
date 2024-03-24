import React from 'react';
import { Chip } from 'react-native-elements';
import GlobalStyles from '../colors';

interface AmountChipsProps {
    label: string;
    selected: boolean;
    onPress: () => void;
  }
  
  const AmountChips: React.FC<AmountChipsProps> = ({ label, selected, onPress }) => (
  <Chip
    title={label}
    type={selected ? 'solid' : 'outline'}
    containerStyle={{ margin: 5 }}
    buttonStyle={{ 
      borderColor: GlobalStyles.Colors.primary100,
      backgroundColor: selected ? GlobalStyles.Colors.primary200 : 'white',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 2,
    }}
    titleStyle={{ color: selected ? 'white' : GlobalStyles.Colors.primary800, fontWeight: '600', fontSize: 14 }}
    onPress={onPress}
  />
);

export default AmountChips;
