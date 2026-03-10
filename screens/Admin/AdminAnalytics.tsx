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
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

interface TopLender {
  name: string;
  amount: number;
}

interface TopCommunity {
  name: string;
  members: number;
  loans: number;
}

interface AnalyticsData {
  totalActiveLoans: number;
  totalLent: number;
  totalRepaid: number;
  repaymentRate: number;
  defaultRate: number;
  userGrowthThisMonth: number;
  topLenders: TopLender[];
  topCommunities: TopCommunity[];
  averageLoanSize: number;
  averageTerm: number;
}

export default function AdminAnalytics() {
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    totalActiveLoans: 0,
    totalLent: 0,
    totalRepaid: 0,
    repaymentRate: 0,
    defaultRate: 0,
    userGrowthThisMonth: 0,
    topLenders: [],
    topCommunities: [],
    averageLoanSize: 0,
    averageTerm: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/analytics',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  }, [fetchAnalytics]);

  const renderMetricCard = (
    label: string,
    value: string | number,
    icon: string,
    color: string,
  ) => (
    <View style={styles.metricCard}>
      <Icon name={icon} size={22} color={color} />
      <Text style={[styles.metricValue, {color}]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Analytics" showBackArrow />
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
      <ScreenTitle title="Analytics" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Active Loans',
            data.totalActiveLoans,
            'cash-outline',
            GlobalStyles.Colors.primary200,
          )}
          {renderMetricCard(
            'Total Lent',
            `$${data.totalLent.toLocaleString()}`,
            'trending-up-outline',
            GlobalStyles.Colors.primary400,
          )}
          {renderMetricCard(
            'Total Repaid',
            `$${data.totalRepaid.toLocaleString()}`,
            'checkmark-done-outline',
            GlobalStyles.Colors.primary400,
          )}
          {renderMetricCard(
            'Repayment Rate',
            `${data.repaymentRate}%`,
            'checkmark-circle-outline',
            GlobalStyles.Colors.primary400,
          )}
          {renderMetricCard(
            'Default Rate',
            `${data.defaultRate}%`,
            'close-circle-outline',
            GlobalStyles.Colors.primary300,
          )}
          {renderMetricCard(
            'User Growth',
            `+${data.userGrowthThisMonth}`,
            'person-add-outline',
            GlobalStyles.Colors.primary200,
          )}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCardWide}>
            <Text style={styles.cardTitle}>Avg Loan Size</Text>
            <Text style={styles.cardValue}>
              ${data.averageLoanSize.toLocaleString()}
            </Text>
          </View>
          <View style={styles.metricCardWide}>
            <Text style={styles.cardTitle}>Avg Term</Text>
            <Text style={styles.cardValue}>{data.averageTerm} months</Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Top 5 Lenders</Text>
          {data.topLenders.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.topLenders.slice(0, 5).map((lender, index) => (
              <View key={index} style={styles.listRow}>
                <View style={styles.rankCircle}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.listName}>{lender.name}</Text>
                <Text style={styles.listValue}>
                  ${lender.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Top 5 Communities</Text>
          {data.topCommunities.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.topCommunities.slice(0, 5).map((community, index) => (
              <View key={index} style={styles.listRow}>
                <View style={styles.rankCircle}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.communityInfo}>
                  <Text style={styles.listName}>{community.name}</Text>
                  <Text style={styles.communityMeta}>
                    {community.members} members · {community.loans} loans
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  metricCardWide: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  cardTitle: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginBottom: 6,
  },
  cardValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },
  listTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    fontWeight: 'bold',
  },
  listName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  listValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: 'bold',
  },
  communityInfo: {
    flex: 1,
  },
  communityMeta: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
    marginTop: 2,
  },
});
