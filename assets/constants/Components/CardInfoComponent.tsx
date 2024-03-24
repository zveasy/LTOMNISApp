import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../colors';
import RadialComponent from './RadialComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import CompleteButton from './Buttons/CompleteButton';

type CardInfoProps = {
  cardType: 'visa' | 'mastercard';
  cardNumber: string;
  onTrashPress: () => void;
};

const CardInfoComponent: React.FC<CardInfoProps> = ({
  cardType,
  cardNumber,
  onTrashPress,
}) => {
  const [isActive, setIsActive] = useState(false);
  const refRBSheet = React.useRef<any>(null);

  const handleOpenSheet = () => {
    refRBSheet.current?.open();
  };

  const handleCloseSheet = () => {
    refRBSheet.current?.close();
  };

  return (
    <View>
      <Pressable
        style={({pressed}) => [
          styles.container,
          isActive ? {borderColor: '#C6A98C', borderWidth: 2} : {},
        ]}
        onPress={() => setIsActive(!isActive)}>
        <RadialComponent type="radio" isActive={isActive} />
        <FontAwesome
          name={cardType === 'visa' ? 'cc-visa' : 'cc-mastercard'}
          size={24}
          color="black"
          style={styles.cardIcon}
        />
        <Text style={styles.cardNumber}>**** {cardNumber}</Text>
        <Icon
          name="trash"
          size={24}
          color="black"
          style={styles.trashIcon}
          onPress={handleOpenSheet}
        />
      </Pressable>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={300}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderRadius: 16,
          },
        }}>
        <View style={{width: '90%', alignSelf: 'center', marginBottom: 30}}>
          <Text style={styles.sheetTitle}>Delete Card</Text>
        </View>
        <View>
          <Pressable
            style={[
              styles.SignButton,
              {backgroundColor: GlobalStyles.Colors.primary200},
            ]}
            onPress={() => {}}>
            <Text style={styles.SignButtonText}>Delete Card</Text>
          </Pressable>
          <Pressable
            style={[
              styles.SignButton,
              {backgroundColor: GlobalStyles.Colors.primary600},
            ]}
            onPress={() => {}}>
            <Text style={styles.SignButtonText}>Cancel</Text>
          </Pressable>
        </View>

        {/* ... any additional content or components you'd like to add */}
      </RBSheet>
    </View>
  );
};
// ... other code

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '98%',
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#C6A98C',
  },
  cardIcon: {
    marginLeft: 5,
  },
  cardNumber: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  trashIcon: {
    marginLeft: 'auto',
    color: GlobalStyles.Colors.primary200,
  },
  sheetTitle: {
    marginTop: 10,
    alignSelf: 'flex-start',
    width: '90%',
    fontSize: 24,
    fontWeight: '500',
  },
  SignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 56,
    backgroundColor: '#BDAE8D',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
  SignButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default CardInfoComponent;
