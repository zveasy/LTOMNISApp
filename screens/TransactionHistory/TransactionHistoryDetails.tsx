import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import ListItemWithRadial, {
  ListItemProps,
} from '../../assets/constants/Components/ListItemWithRadial';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'i18next';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import {HomeStackParamList} from '../../App';

type NavigationProp = StackNavigationProp<HomeStackParamList, 'TransactionHistoryDetails'>;

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  counterparty_id: string;
  status: string;
  created_at: string;
}

const TransactionHistoryDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'TransactionHistoryDetails'>>();
  const transactionId = route.params?.transactionId;
  const token = useSelector((state: AppState) => state.token);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/transactions/mytransactions',
          { headers: { Authorization: `Bearer ${token?.token}` } },
        );
        const transactions: Transaction[] = response.data?.transactions || response.data || [];
        const found = transactions.find((tx: Transaction) => tx.id === transactionId);
        setTransaction(found || (transactions.length > 0 ? transactions[0] : null));
      } catch (error) {
        console.error('Failed to fetch transaction details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId, token]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}.${d.getFullYear()}`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.Background}>
        <ScreenTitle title="Transaction Detail" showBackArrow={true} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={GlobalStyles.Colors.primary200} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Transaction Detail"
        showBackArrow={true}
        showRightIcon={true}
        rightIconType="Feather"
        rightIconName="share-2"
        onRightIconPress={() => {}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.transactionTypeText}>Transaction Type</Text>
            <Text style={styles.transactionTypeDetailText}>{transaction?.type || 'N/A'}</Text>
          </View>
          <Divider
            width={1}
            style={styles.dividerStyle}
            color={GlobalStyles.Colors.accent250}
          />
          <View>
            <Text style={styles.transactionTypeText}>Status</Text>
            <Text style={styles.transactionTypeDetailText}>{transaction?.status || 'N/A'}</Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginTop: 10, marginBottom: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Amount</Text>
            <Text style={styles.transactionTypeDetailText}>
              ${transaction?.amount?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginVertical: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Date</Text>
            <Text style={styles.transactionTypeDetailText}>
              {transaction?.created_at ? formatDate(transaction.created_at) : 'N/A'}
            </Text>
          </View>
          <Divider
            color={GlobalStyles.Colors.accent250}
            width={1}
            style={{marginVertical: 8}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.transactionTypeText}>Time</Text>
            <Text style={styles.transactionTypeDetailText}>
              {transaction?.created_at ? formatTime(transaction.created_at) : 'N/A'}
            </Text>
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
