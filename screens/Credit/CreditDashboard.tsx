import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';
import {HomeStackParamList} from '../../App';

const getScoreColor = (score: number): string => {
  if (score < 35) return '#E53935';
  if (score < 50) return '#FDD835';
  if (score < 70) return '#43A047';
  return GlobalStyles.Colors.primary200;
};

const getTierLabel = (tier: number): string => {
  const labels: Record<number, string> = {
    1: 'Tier 1 — New',
    2: 'Tier 2 — Building',
    3: 'Tier 3 — Established',
    4: 'Tier 4 — Trusted',
    5: 'Tier 5 — Elite',
  };
  return labels[tier] ?? `Tier ${tier}`;
};

type CreditSummary = {
  score: number;
  tier: number;
  paymentsConfirmed: number;
  totalRepaid: number;
  onTimeRate: number;
  creditAge: string;
  platformBreakdown: {platform: string; count: number}[];
};

export default function CreditDashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await api.get('/credit/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching credit summary:', error);
      setSummary({
        score: 0,
        tier: 1,
        paymentsConfirmed: 0,
        totalRepaid: 0,
        onTimeRate: 0,
        creditAge: '0 months',
        platformBreakdown: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="OMNIS Credit" showBackArrow />
        <ActivityIndicator
          size="large"
          color={GlobalStyles.Colors.primary200}
          style={{marginTop: 40}}
        />
      </SafeAreaView>
    );
  }

  const score = summary?.score ?? 0;
  const scoreColor = getScoreColor(score);

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="OMNIS Credit" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Score Circle */}
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, {borderColor: scoreColor}]}>
            <Text style={[styles.scoreNumber, {color: scoreColor}]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>OMNIS Score</Text>
          </View>
        </View>

        {/* Trust Tier */}
        <View style={styles.tierContainer}>
          <Icon
            name="shield-checkmark-outline"
            size={20}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.tierText}>
            {getTierLabel(summary?.tier ?? 1)}
          </Text>
        </View>

        {/* Key Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {summary?.paymentsConfirmed ?? 0}
            </Text>
            <Text style={styles.statLabel}>Payments{'\n'}Confirmed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${(summary?.totalRepaid ?? 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total{'\n'}Repaid</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(summary?.onTimeRate ?? 0).toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>On-Time{'\n'}Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {summary?.creditAge ?? '0m'}
            </Text>
            <Text style={styles.statLabel}>Credit{'\n'}Age</Text>
          </View>
        </View>

        {/* Platform Breakdown */}
        {(summary?.platformBreakdown ?? []).length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Platform Usage</Text>
            {summary!.platformBreakdown.map((item, index) => {
              const maxCount = Math.max(
                ...summary!.platformBreakdown.map(p => p.count),
                1,
              );
              const barWidth = (item.count / maxCount) * 100;
              return (
                <View key={index} style={styles.platformRow}>
                  <Text style={styles.platformLabel}>{item.platform}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {width: `${barWidth}%`},
                      ]}
                    />
                  </View>
                  <Text style={styles.platformCount}>{item.count}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreditReport')}>
          <Icon
            name="document-text-outline"
            size={20}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.actionButtonText}>View Full Report</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={GlobalStyles.Colors.accent110}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreditHistory')}>
          <Icon
            name="time-outline"
            size={20}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.actionButtonText}>View History</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={GlobalStyles.Colors.accent110}
          />
        </TouchableOpacity>

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
  scoreContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
  },
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(189,174,141,0.15)',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tierText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
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
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  platformLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    width: 80,
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  bar: {
    height: 8,
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 4,
  },
  platformCount: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    width: 30,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
  },
  actionButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});
