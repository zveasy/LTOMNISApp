import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../colors';


type TransactionHistoryProps = {
  buttonText: string;
  onPress?: () => void;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ buttonText, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.TransactionHistoryContainer}>
      <IonIcon
        name="timer-outline"
        size={24}
        style={{ alignSelf: 'center' }}
        color={GlobalStyles.Colors.primary200}
      />
      <Text style={styles.TransactionHistoryText}>{buttonText}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  TransactionHistoryContainer: {
    marginVertical: 16,
    marginBottom: 22,
    height: 44,
    flexDirection: 'row',
    width: '90%',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.accent115,
  },
  TransactionHistoryText: {
    alignSelf: 'center',
    fontSize: 16,
    marginLeft: 10,
    color: GlobalStyles.Colors.primary200,
  },
});

export default TransactionHistory;
