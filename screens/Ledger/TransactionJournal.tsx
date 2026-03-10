import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

interface JournalEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  amount: number;
  runningBalance: number;
}

interface GroupedEvents {
  date: string;
  events: JournalEvent[];
}

const EVENT_CONFIG: Record<
  string,
  {icon: string; color: string; label: string}
> = {
  loan_created: {
    icon: 'add-circle-outline',
    color: '#4A90D9',
    label: 'Loan Created',
  },
  loan_funded: {
    icon: 'wallet-outline',
    color: '#4A90D9',
    label: 'Loan Funded',
  },
  repayment_scheduled: {
    icon: 'calendar-outline',
    color: '#4A90D9',
    label: 'Repayment Scheduled',
  },
  repayment_marked_paid: {
    icon: 'checkmark-circle-outline',
    color: '#00835F',
    label: 'Payment Made',
  },
  repayment_late: {
    icon: 'alert-circle-outline',
    color: '#EB0000',
    label: 'Late Payment',
  },
  loan_completed: {
    icon: 'trophy-outline',
    color: '#00835F',
    label: 'Loan Completed',
  },
  loan_defaulted: {
    icon: 'close-circle-outline',
    color: '#EB0000',
    label: 'Loan Defaulted',
  },
  adjustment_applied: {
    icon: 'create-outline',
    color: '#BDAE8D',
    label: 'Adjustment Applied',
  },
};

const TransactionJournal: React.FC = () => {
  const token = useSelector((state: AppState) => state.token);

  const [events, setEvents] = useState<JournalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJournal = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/ledger/journal',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching journal:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJournal();
    setRefreshing(false);
  }, [fetchJournal]);

  const groupEventsByDate = (eventsList: JournalEvent[]): GroupedEvents[] => {
    const groups: Record<string, JournalEvent[]> = {};
    eventsList.forEach(event => {
      const date = event.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, groupEvents]) => ({date, events: groupEvents}));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventConfig = (type: string) => {
    return (
      EVENT_CONFIG[type] ?? {
        icon: 'ellipse-outline',
        color: GlobalStyles.Colors.accent100,
        label: type.replace(/_/g, ' '),
      }
    );
  };

  const groupedEvents = groupEventsByDate(events);

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Transaction Journal" showBackArrow={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Transaction Journal" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {groupedEvents.length === 0 ? (
          <Text style={styles.noDataText}>No journal entries yet.</Text>
        ) : (
          groupedEvents.map(group => (
            <View key={group.date}>
              <Text style={styles.dateHeader}>{formatDate(group.date)}</Text>
              {group.events.map(event => {
                const config = getEventConfig(event.type);
                return (
                  <View key={event.id} style={styles.eventItem}>
                    <View
                      style={[
                        styles.eventIcon,
                        {backgroundColor: config.color + '20'},
                      ]}>
                      <Icon name={config.icon} size={20} color={config.color} />
                    </View>
                    <View style={styles.eventContent}>
                      <View style={styles.eventTopRow}>
                        <Text style={styles.eventType}>{config.label}</Text>
                        <Text
                          style={[styles.eventAmount, {color: config.color}]}>
                          {event.amount >= 0 ? '+' : ''}$
                          {Math.abs(event.amount).toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.eventDescription} numberOfLines={2}>
                        {event.description}
                      </Text>
                      <View style={styles.eventBottomRow}>
                        <Text style={styles.eventTime}>
                          {formatTime(event.timestamp)}
                        </Text>
                        <Text style={styles.runningBalance}>
                          Balance: ${event.runningBalance.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  noDataText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 40,
  },
  dateHeader: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventType: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
  eventAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  eventDescription: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginBottom: 6,
  },
  eventBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  runningBalance: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TransactionJournal;
