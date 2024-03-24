import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';

const {width} = Dimensions.get('window');

type ButtonsRowProps = {
  leftButtonText: string;
  rightButtonText?: string;
  onLeftButtonPress: () => void;
  onRightButtonPress?: () => void;
  isLeftButtonActive: boolean;
  isRightButtonActive?: boolean;
  buttonState: 'add' | 'pending' | 'default'; // New prop to determine the state
};

const ButtonsRow = ({
  leftButtonText,
  rightButtonText,
  onLeftButtonPress,
  onRightButtonPress,
  isLeftButtonActive,
  isRightButtonActive,
  buttonState,
}: ButtonsRowProps) => {
  const getButtonStyle = (buttonType: 'left' | 'right') => {
    switch (buttonState) {
      case 'add':
        return [styles.fullWidthButton, styles.add];
      case 'pending':
        return [styles.fullWidthButton, styles.pending];
      default:
        return [
          styles.button,
          buttonType === 'left' && isLeftButtonActive ? styles.activeButton : styles.inactiveButton,
          buttonType === 'right' && isRightButtonActive ? styles.activeButton : styles.inactiveButton,
        ];
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onLeftButtonPress}
        style={getButtonStyle('left')}>
        <Text style={styles.buttonText}>{leftButtonText}</Text>
      </TouchableOpacity>
      {rightButtonText && onRightButtonPress && (
        <TouchableOpacity
          onPress={onRightButtonPress}
          style={getButtonStyle('right')}>
          <Text style={styles.buttonText}>{rightButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', //
    width: width * 0.85,
    alignSelf: 'center',
    marginVertical: 20,
  },
  button: {
    height: 36,
    width: 156,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  fullWidthButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    padding: 10
  },
  activeButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  inactiveButton: {
    backgroundColor: GlobalStyles.Colors.primary700,
  },
  add: {
    backgroundColor: GlobalStyles.Colors.primary200, // Adjust as needed
  },
  pending: {
    backgroundColor: GlobalStyles.Colors.primary700, // Adjust as needed
    // For a different text color, you would need to adjust the text style conditionally as well
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ButtonsRow;
