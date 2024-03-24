import {color} from '@rneui/base';
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import GlobalStyles from '../colors';
import AcceptAndDecline from './Buttons/AcceptAndDecline';
import {t} from 'i18next';

type BottomSheetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
};

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isVisible,
  onClose,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <View style={styles.content}>
        <Text style={styles.bigTitle}>{t('areYouSure')}</Text>
        <Text style={styles.bigTitle}>{t('acceptThsOffer')}</Text>
        <Text style={styles.subText}>
          {t('thisOfferCovers')}
        </Text>
        <Text style={styles.subText}>
          {t('offerForPost')}
        </Text>
        <AcceptAndDecline onAccept={onAccept} onDecline={onDecline} />
      </View>
    </Modal>
  );
};

const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    height: (2 / 5) * height,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, // Space for the AcceptAndDecline component
  },
  bigTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    marginTop: 10,
    color: GlobalStyles.Colors.primary700,
  },
});

export default BottomSheetModal;
