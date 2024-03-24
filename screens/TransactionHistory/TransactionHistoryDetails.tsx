import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList, Touchable} from 'react-native';
import {Divider} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import ListItemWithRadial, {
  ListItemProps,
} from '../../assets/constants/Components/ListItemWithRadial';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from '../HomeScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'i18next'

type RootStackParamList = {
  HomeStack: undefined;
  TransactionHistoryDetails: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TransactionHistoryDetails'>;


const TransactionHistoryDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();


  const formatCurrency = (value: string) => {
    const sign = ['+', '-'].includes(value[0]) ? value[0] : '';
    const amountValue = value.replace('$', '').trim(); // remove dollar sign if it exists
    const numericalValue = sign ? amountValue.slice(1) : amountValue;
    const amount = parseFloat(numericalValue);

    if (isNaN(amount)) {
      console.error(`Invalid currency value: ${value}`);
      return value;
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);

    return `${sign}${formattedAmount}`;
  };

  // Data array
  const data: ListItemProps[] = [
    {
      radialType: 'radio',
      iconName: 'coffee',
      topTextLeft: t('TransferTo'),
      topTextRight: '-$171.23',
      bottomTextLeft: t('Pending'),
      bottomTextRight: '06.23.2024 14:00',
    },
    {
      radialType: 'radio',
      topTextLeft: t('TransferTo'),
      topTextRight: '+$100.00',
      bottomTextLeft: t('Completed'),
      bottomTextRight: '05.20.2024 11:15',
    },
    {
      radialType: 'radio',
      imagePath: 'path_to_some_image',
      topTextLeft: t('TransferTo'),
      topTextRight: '+$58.75',
      bottomTextLeft: t('Failed'),
      bottomTextRight: '04.29.2024 09:45',
    },
    {
      radialType: 'radio',
      iconName: 'shopping-cart',
      topTextLeft: t('TransferTo'),
      topTextRight: '-$89.50',
      bottomTextLeft: t('Pending'),
      bottomTextRight: '06.15.2024 16:30',
    },
    {
      radialType: 'radio',
      iconName: 'dollar-sign',
      topTextLeft: t('TransferTo'),
      topTextRight: '+$2000',
      bottomTextLeft: t('Completed'),
      bottomTextRight: '06.01.2024 12:00',
    },
  ];

  // Process the data using the function
  const processedData = data.map(item => ({
    ...item,
    topTextRight: formatCurrency(item.topTextRight),
  }));

  

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Transaction Detail"
        showBackArrow={true}
        showRightIcon={true}
        rightIconType="Feather" // Either 'Ionicons' or 'Feather'
        rightIconName="share-2" // replace with actual Feather icon name
        onRightIconPress={() => {}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.transactionTypeText}>Transaction Type</Text>
            <Text style={styles.transactionTypeDetailText}>Transfer</Text>
          </View>
          <Divider
            width={1}
            style={styles.dividerStyle}
            color={GlobalStyles.Colors.accent250}
          />
          <View>
            <Text style={styles.transactionTypeText}>Bank Account</Text>
            <Text style={styles.transactionTypeDetailText}>15615568518</Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginTop: 10, marginBottom: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Amount</Text>
            <Text style={styles.transactionTypeDetailText}>$214</Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginVertical: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Date</Text>
            <Text style={styles.transactionTypeDetailText}>01.23.2024</Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginVertical: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Time</Text>
            <Text style={styles.transactionTypeDetailText}>15:15</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  contentContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: GlobalStyles.Colors.primary100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
  },
  container: {
    width: '90%',
    marginTop: 30,
    alignSelf: 'center',
  },
  transactionTypeText: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary900,
    fontWeight: '500',
  },
  transactionTypeDetailText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '500',
    marginTop: 5,
  },
  dividerStyle: {
    marginVertical: 10,
  },
  // Add additional styles here for other elements
});

export default TransactionHistoryDetails;
