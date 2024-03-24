import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import GlobalStyles from '../colors';

type ResetSubmitProps = {
  onResetPress: () => void;
  onSubmitPress: () => void;
};



const ResetSubmit: React.FC<ResetSubmitProps> = ({ onResetPress, onSubmitPress }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onResetPress}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={onSubmitPress}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 20,
  },
  button: {
    width: '48%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: GlobalStyles.Colors.primary600,
  },
  submitButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetSubmit;
