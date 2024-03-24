import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import GlobalStyles from '../../assets/constants/colors';

interface BottomSheetProps {
  isVisible: boolean;
  title?: string;
  subText?: string;
  button1Text?: string;
  button1Color?: string;
  button2Text?: string;
  button2Color?: string;
  onButton1Press?: () => void;
  onButton2Press?: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  title,
  subText,
  button1Text,
  button1Color = 'blue',
  button2Text,
  button2Color = 'green',
  onButton1Press,
  onButton2Press,
}) => {
  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subText && <Text style={styles.subText}>{subText}</Text>}

        {button1Text && (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: button1Color}]}
            onPress={onButton1Press}>
            <Text style={styles.buttonText}>{button1Text}</Text>
          </TouchableOpacity>
        )}

        {button2Text && (
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: button2Color, marginTop: 10},
            ]}
            onPress={onButton2Press}>
            <Text style={styles.buttonText}>{button2Text}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    height: '30%',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    alignSelf: 'flex-start',
    color: GlobalStyles.Colors.primary800
  },
  subText: {
    fontSize: 14,
    marginVertical: 15,
    alignSelf: 'flex-start',
    color: GlobalStyles.Colors.primary800
  },
  button: {
    width: '90%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BottomSheet;
