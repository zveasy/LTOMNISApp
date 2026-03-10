import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

interface AdminStats {
  activeLoans: number;
  delinquentLoans: number;
  totalUsers: number;
  newUsersThisMonth: number;
  repaymentRate: number;
  defaultRate: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  {label: 'User Search', screen: 'AdminUserSearch', icon: 'people-outline'},
  {label: 'Loan Search', screen: 'AdminLoanSearch', icon: 'cash-outline'},
  {
    label: 'Identity Queue',
    screen: 'AdminIdentityQueue',
    icon: 'id-card-outline',
  },
  {
    label: 'Dispute Queue',
    screen: 'AdminDisputeManagement',
    icon: 'chatbubbles-outline',
  },
  {label: 'Fraud Queue', screen: 'AdminFraudQueue', icon: 'warning-outline'},
  {label: 'Analytics', screen: 'AdminAnalytics', icon: 'bar-chart-outline'},
];

export default function AdminDashboard() {
  const navigation = useNavigation<any>();
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    activeLoans: 0,
    delinquentLoans: 0,
    totalUsers: 0,
    newUsersThisMonth: 0,
    repaymentRate: 0,
    defaultRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/stats',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.stats) {
        setStats(response.data.stats);
      }
      if (response.data.recentActivity) {
        setRecentActivity(response.data.recentActivity.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const renderStatCard = (
    label: string,
    value: string | number,
    icon: string,
    color: string,
  ) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={22} color={color} />
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Admin Dashboard" showBackArrow />
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
      <ScreenTitle title="Admin Dashboard" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'Active Loans',
            stats.activeLoans,
            'cash-outline',
            GlobalStyles.Colors.primary200,
          )}
          {renderStatCard(
            'Delinquent',
            stats.delinquentLoans,
            'alert-circle-outline',
            GlobalStyles.Colors.primary300,
          )}
          {renderStatCard(
            'Total Users',
            stats.totalUsers,
            'people-outline',
            GlobalStyles.Colors.primary100,
          )}
          {renderStatCard(
            'New This Month',
            stats.newUsersThisMonth,
            'person-add-outline',
            GlobalStyles.Colors.primary400,
          )}
          {renderStatCard(
            'Repayment Rate',
            `${stats.repaymentRate}%`,
            'checkmark-circle-outline',
            GlobalStyles.Colors.primary400,
          )}
          {renderStatCard(
            'Default Rate',
            `${stats.defaultRate}%`,
            'close-circle-outline',
            GlobalStyles.Colors.primary300,
          )}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity
              key={action.screen}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.screen)}>
              <Icon
                name={action.icon}
                size={26}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.length === 0 ? (
          <Text style={styles.emptyText}>No recent activity</Text>
        ) : (
          recentActivity.map(item => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityType}>{item.type}</Text>
                <Text style={styles.activityDescription}>
                  {item.description}
                </Text>
                <Text style={styles.activityTime}>{item.timestamp}</Text>
              </View>
            </View>
          ))
        )}

        <View style={{height: 40}} />
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GlobalStyles.Colors.primary200,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  activityType: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
  },
});
