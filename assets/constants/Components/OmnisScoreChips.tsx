import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ChipData = {
  text: string;
  backgroundColor: string;
};

type OmnisScoreChipsProps = {
  chips: ChipData[];
};

const Chip: React.FC<ChipData> = ({ text, backgroundColor }) => {
  return (
    <View style={[styles.chipContainer, { backgroundColor }]}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
};

const OmnisScoreChips: React.FC<OmnisScoreChipsProps> = ({ chips }) => {
  return (
    <View style={styles.container}>
      {chips.map((chip, index) => (
        <Chip key={index} text={chip.text} backgroundColor={chip.backgroundColor} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: 10,
  },
  chipContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  chipText: {
    color: '#FFFFFF', // Default text color, can be adjusted
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default OmnisScoreChips;
