import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import GlobalStyles from '../../colors';
import {t} from 'i18next';

type CompleteButtonProps = {
  onAccept: () => void;
  onDecline: () => void;
  acceptButtonStyle?: object;
  acceptText?: string; // New property to hold accept button text
  declineText?: string; // New property to hold decline button text
};

const AcceptAndDecline: React.FC<CompleteButtonProps> = ({
  onAccept,
  onDecline,
  acceptButtonStyle,
  acceptText = t('Accept'), // Default value in case no prop is passed
  declineText = t('Decline'), // Default value in case no prop is passed
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        position: 'absolute', // This is important for positioning the buttons at the bottom
        bottom: 50, // This ensures the buttons are 50 units from the bottom
        left: '5%', // This will center the container with respect to the screen
      }}>
      <Pressable style={styles.LeftButton} onPress={onDecline}>
        <Text style={styles.SignButtonText}>{declineText}</Text>
      </Pressable>
      <Pressable
        style={[styles.RightButton, acceptButtonStyle]}
        onPress={onAccept}>
        <Text
          style={[
            styles.SignButtonText,
            acceptButtonStyle === styles.acceptButtonInactive
              ? styles.textInactive
              : {},
          ]}>
          {acceptText}
        </Text>
      </Pressable>
    </View>
  );
};

export const styles = StyleSheet.create({
  LeftButton: {
    width: '42%',
    height: 56,
    backgroundColor: GlobalStyles.Colors.primary600,
    justifyContent: 'center',
    borderRadius: 16,
  },
  RightButton: {
    width: '42%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
  },

  SignButtonText: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  acceptButtonActive: {
    backgroundColor: GlobalStyles.Colors.primary200, // or your preferred shade of green
  },
  acceptButtonInactive: {
    backgroundColor: 'rgba(189, 174, 141, 0.4)', // or another color to indicate it's not active
  },
  textInactive: {
    opacity: 0.4,
  },
});

export default AcceptAndDecline;
