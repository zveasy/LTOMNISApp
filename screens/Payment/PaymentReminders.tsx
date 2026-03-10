import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

interface Reminder {
  id: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  counterparty: string;
  reminderEnabled: boolean;
}

interface ReminderPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export default function PaymentReminders() {
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [preferences, setPreferences] = useState<ReminderPreferences>({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payment/reminders');
      setReminders(response.data?.reminders ?? []);
      if (response.data?.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === id ? {...r, reminderEnabled: !r.reminderEnabled} : r,
      ),
    );
  };

  const togglePreference = (key: keyof ReminderPreferences) => {
    setPreferences(prev => ({...prev, [key]: !prev[key]}));
  };

  const getStatusColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) {
      return GlobalStyles.Colors.primary300;
    }
    if (daysUntilDue <= 3) {
      return GlobalStyles.Colors.primary300;
    }
    if (daysUntilDue <= 7) {
      return '#F5A623';
    }
    return GlobalStyles.Colors.primary400;
  };

  const getStatusLabel = (daysUntilDue: number) => {
    if (daysUntilDue < 0) {
      return `${Math.abs(daysUntilDue)}d overdue`;
    }
    if (daysUntilDue === 0) {
      return 'Due today';
    }
    return `${daysUntilDue}d left`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Payment Reminders" showBackArrow />
        <ActivityIndicator
          size="large"
          color={GlobalStyles.Colors.primary200}
          style={{marginTop: 40}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Payment Reminders" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Reminder Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Preferences</Text>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Icon
                name="mail-outline"
                size={20}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.preferenceLabel}>Email</Text>
            </View>
            <Switch
              value={preferences.email}
              onValueChange={() => togglePreference('email')}
              trackColor={{
                false: 'rgba(255,255,255,0.2)',
                true: GlobalStyles.Colors.primary200,
              }}
              thumbColor={GlobalStyles.Colors.primary100}
            />
          </View>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Icon
                name="notifications-outline"
                size={20}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.preferenceLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={preferences.push}
              onValueChange={() => togglePreference('push')}
              trackColor={{
                false: 'rgba(255,255,255,0.2)',
                true: GlobalStyles.Colors.primary200,
              }}
              thumbColor={GlobalStyles.Colors.primary100}
            />
          </View>
          <View style={[styles.preferenceRow, {borderBottomWidth: 0}]}>
            <View style={styles.preferenceLeft}>
              <Icon
                name="chatbubble-outline"
                size={20}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.preferenceLabel}>SMS</Text>
            </View>
            <Switch
              value={preferences.sms}
              onValueChange={() => togglePreference('sms')}
              trackColor={{
                false: 'rgba(255,255,255,0.2)',
                true: GlobalStyles.Colors.primary200,
              }}
              thumbColor={GlobalStyles.Colors.primary100}
            />
          </View>
        </View>

        {/* Upcoming Payments */}
        <Text style={styles.sectionLabel}>Upcoming Payments</Text>
        {reminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Icon
              name="calendar-outline"
              size={40}
              color={GlobalStyles.Colors.accent110}
            />
            <Text style={styles.emptyText}>No upcoming payments</Text>
          </View>
        ) : (
          reminders.map(reminder => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${getStatusColor(
                        reminder.daysUntilDue,
                      )}20`,
                    },
                  ]}>
                  <View
                    style={[
                      styles.statusDot,
                      {backgroundColor: getStatusColor(reminder.daysUntilDue)},
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {color: getStatusColor(reminder.daysUntilDue)},
                    ]}>
                    {getStatusLabel(reminder.daysUntilDue)}
                  </Text>
                </View>
                <Switch
                  value={reminder.reminderEnabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{
                    false: 'rgba(255,255,255,0.2)',
                    true: GlobalStyles.Colors.primary200,
                  }}
                  thumbColor={GlobalStyles.Colors.primary100}
                />
              </View>
              <View style={styles.reminderBody}>
                <View style={styles.reminderDetails}>
                  <Text style={styles.reminderCounterparty}>
                    {reminder.counterparty}
                  </Text>
                  <Text style={styles.reminderDueDate}>
                    Due: {reminder.dueDate}
                  </Text>
                </View>
                <Text style={styles.reminderAmount}>
                  ${reminder.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  cardTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    marginLeft: 12,
  },
  sectionLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 4,
  },
  reminderCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reminderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderDetails: {
    flex: 1,
  },
  reminderCounterparty: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '500',
  },
  reminderDueDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginTop: 4,
  },
  reminderAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 30,
    marginTop: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    marginTop: 10,
  },
});
