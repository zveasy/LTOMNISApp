import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

type CreditEvent = {
  id: string;
  date: string;
  eventType: string;
  description: string;
  scoreChange: number;
  platform?: string;
};

export default function CreditHistory() {
  const [events, setEvents] = useState<CreditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get('/credit/history');
      setEvents(response.data?.events ?? response.data ?? []);
    } catch (error) {
      console.error('Error fetching credit history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  }, [fetchHistory]);

  const renderEvent = ({item}: {item: CreditEvent}) => {
    const isPositive = item.scoreChange >= 0;
    return (
      <View style={styles.eventCard}>
        <View style={styles.timelineContainer}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isPositive
                  ? GlobalStyles.Colors.primary400
                  : GlobalStyles.Colors.primary300,
              },
            ]}
          />
          <View style={styles.line} />
        </View>
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text
              style={[
                styles.scoreChange,
                {
                  color: isPositive
                    ? GlobalStyles.Colors.primary400
                    : GlobalStyles.Colors.primary300,
                },
              ]}>
              {isPositive ? '+' : ''}
              {item.scoreChange}
            </Text>
          </View>
          <Text style={styles.eventType}>{item.eventType}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
          {item.platform && (
            <View style={styles.platformTag}>
              <Icon
                name="apps-outline"
                size={12}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.platformText}>{item.platform}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Credit History" showBackArrow />
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
      <ScreenTitle title="Credit History" showBackArrow />
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="time-outline"
              size={64}
              color={GlobalStyles.Colors.accent110}
            />
            <Text style={styles.emptyText}>No credit history yet</Text>
            <Text style={styles.emptySubtext}>
              Make payments through your linked platforms to start building your
              credit history.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  eventCard: {
    flexDirection: 'row',
    marginTop: 4,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  scoreChange: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventType: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
  },
  eventDescription: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  platformTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(189,174,141,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  platformText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 11,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});
