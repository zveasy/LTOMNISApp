import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {SafeAreaView} from 'react-native';
import {Divider} from 'react-native-elements';
import CardInfoComponent from '../../assets/constants/Components/CardInfoComponent';
import IconButtonComponent from '../../assets/constants/Components/IconButtonComponent';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';

export default function DepositMoneyScreen() {
  const [amount, setAmount] = useState('');

  const handleTrashPress = () => {
    // Handle the trash button press here, e.g., remove the card info
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Deposit money"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.leftAlignedText}>Enter Amount</Text>
        </View>
        <View style={styles.amountButton}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={[styles.textInput, amount ? styles.textActive : null]}
            placeholder="amount"
            placeholderTextColor="rgba(255,255,255, 0.6)"
            keyboardType="numeric"
            onChangeText={text => setAmount(text)}
            value={amount}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.leftAlignedText}>Payment methods</Text>
        </View>
        <CardInfoComponent
          cardType="visa"
          cardNumber="2515"
          onTrashPress={handleTrashPress}
        />
      </View>
      <View style={{marginTop: 16, alignItems: 'center'}}>
        <IconButtonComponent
          backgroundColor="rgba(118,118,128, 0.24)"
          text="Add card"
          iconSet="Ionicons"
          iconName="add"
          textColor={GlobalStyles.Colors.primary200}
          iconColor={GlobalStyles.Colors.primary200}
          onPress={() => {
            // handle button press
          }}
        />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          width: '90%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 24,
          }}>
          <Divider
            style={{flex: 1, height: 1}}
            color={'rgba(256, 256, 256, 0.6)'}
          />
          <Text style={{marginHorizontal: 10, color: 'white'}}>Or</Text>
          <Divider
            style={{flex: 1, height: 1}}
            color={'rgba(256, 256, 256, 0.6)'}
          />
        </View>
      </View>

      <View style={{marginTop: 16, alignItems: 'center'}}>
        <IconButtonComponent
          backgroundColor={GlobalStyles.Colors.primary100}
          text="Apple pay" // This is now optional
          textColor="black"
          iconColor="black"
          onPress={() => {
            // handle button press
          }}
        />
      </View>
      <CompleteButton
        text="Transfer"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20, // to give some padding on the sides
  },
  textContainer: {
    width: '98%',
    alignItems: 'flex-start',
  },
  leftAlignedText: {
    marginBottom: 10,
    color: GlobalStyles.Colors.primary100,
  },
  amountButton: {
    width: '98%',
    height: 50,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    backgroundColor: '#fff',
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 10, // to give some padding inside the button
  },
  dollarSign: {
    color: 'black',
    fontSize: 16,
  },
  textInput: {
    color: 'black',
    fontSize: 16,
    flex: 1, // to take up all the available space
  },
  textActive: {
    color: 'black',
  },
  // ...rest of your styles
});
