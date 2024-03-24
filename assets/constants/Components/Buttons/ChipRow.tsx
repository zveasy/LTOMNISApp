import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalStyles from '../../colors';

const ChipComponent = ({ chipsData, onSelect }: { chipsData: { id: string, label: string }[], onSelect: (chip: { id: string, label: string }) => void }) => {
    const [selectedChips, setSelectedChips] = useState<string[]>([]);
  
    const toggleSelect = (chip: { id: string, label: string }) => {
      setSelectedChips((prevSelectedChips) => {
        if (prevSelectedChips.includes(chip.id)) {
          return prevSelectedChips.filter((selectedChip) => selectedChip !== chip.id);
        } else {
          return [...prevSelectedChips, chip.id];
        }
      });
  
      onSelect(chip);
    };

  return (
    <View style={styles.chipContainer}>
      {chipsData.map((chip) => (
        <TouchableOpacity
          key={chip.id}
          style={[
            styles.chip,
            selectedChips.includes(chip.id) ? styles.selectedChip : null,
          ]}
          onPress={() => toggleSelect(chip)}
        >
          <Text
            style={[
              styles.chipText,
              selectedChips.includes(chip.id) ? styles.selectedChipText : null,
            ]}
          >
            {chip.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff', // non-selected chip background color
  },
  chipText: {
    color: '#000', // non-selected chip text color
  },
  selectedChip: {
    backgroundColor: GlobalStyles.Colors.primary210, // selected chip background color
  },
  selectedChipText: {
    color: '#fff', // selected chip text color
  },
});

export default ChipComponent;

