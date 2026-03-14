import React, { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../../assets/constants/colors';
import ListItemWithRadial, {
  ListItemProps,
} from '../../../../assets/constants/Components/ListItemWithRadial';
import CompleteButton from '../../../../assets/constants/Components/Buttons/CompleteButton';
import { useDispatch, useSelector } from 'react-redux';
import { hideTabBar} from '../../../../tabBarSlice';
import { AppState } from '../../../../ReduxStore';
import axios from 'axios';

interface LedgerEvent {
  id: string;
  event_type: string;
  description: string;
  amount: number;
  created_at: string;
}

const OfferTransactionHistory: React.FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedgerEvents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/ledger/journal',
          { headers: { Authorization: `Bearer ${token?.token}` } },
        );
        setEvents(response.data?.events || response.data || []);
      } catch (error) {
        console.error('Failed to fetch ledger events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLedgerEvents();
  }, [token]);

  const formatCurrency = (value: string) => {
    const sign = ['+', '-'].includes(value[0]) ? value[0] : '';
    const amountValue = value.replace('$', '').trim();
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const processedData: ListItemProps[] = events.map(event => ({
    radialType: 'radio' as const,
    topTextLeft: event.description || event.event_type,
    topTextRight: formatCurrency(`${event.amount >= 0 ? '+' : '-'}$${Math.abs(event.amount)}`),
    bottomTextLeft: event.event_type,
    bottomTextRight: event.created_at ? formatDate(event.created_at) : '',
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.Background}>
        <ScreenTitle title="Offer Transaction History" showBackArrow={true} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={GlobalStyles.Colors.primary200} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Offer Transaction History"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <FlatList
            data={processedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItemWithRadial {...item} />}
            ListEmptyComponent={
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: GlobalStyles.Colors.primary200}}>No transactions found</Text>
              </View>
            }
          />
        </View>
      </View>
      <CompleteButton
        text="Download Summary"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
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
    width: '100%',
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default OfferTransactionHistory;
