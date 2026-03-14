import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import {StyleSheet} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {SafeAreaView} from 'react-native';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import CustomPaymentBlock, { OfferStatus } from '../../assets/constants/Components/CustomPaymentBlock';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';

interface PaymentReminder {
  firstname: string;
  lastname: string;
  status: OfferStatus;
  payments: Array<{leftText: string; rightText: string}>;
}

export default function PaymentStatus() {
  const token = useSelector((state: AppState) => state.token);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/omnis/payment/reminders',
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setReminders(res.data ?? []);
      } catch (err: any) {
        console.error('Error fetching payment reminders:', err);
        setError(err.response?.data?.error || 'Failed to load payment reminders');
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.Background}>
        <ScreenTitle
          title="Payment Status"
          showBackArrow={true}
          onBackPress={() => {}}
          showRightIcon={true}
          rightIconType="MaterialCommunityIcons"
          rightIconName="bell-plus-outline"
          onRightIconPress={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalStyles.Colors.primary200} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.Background}>
        <ScreenTitle
          title="Payment Status"
          showBackArrow={true}
          onBackPress={() => {}}
          showRightIcon={true}
          rightIconType="MaterialCommunityIcons"
          rightIconName="bell-plus-outline"
          onRightIconPress={() => {}}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Payment Status"
        showBackArrow={true}
        onBackPress={() => {}}
        showRightIcon={true}
        rightIconType="MaterialCommunityIcons"
        rightIconName="bell-plus-outline"
        onRightIconPress={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {reminders.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>No payment reminders</Text>
          </View>
        ) : (
          reminders.map((reminder, index) => (
            <CustomPaymentBlock
              key={index}
              firstname={reminder.firstname}
              lastname={reminder.lastname}
              status={reminder.status}
              data={reminder.payments}
            />
          ))
        )}
      </ScrollView>
      <CompleteButton
        text="Make a payment"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
});
