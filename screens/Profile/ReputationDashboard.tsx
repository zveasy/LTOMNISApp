import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import TrustBadges from '../../assets/constants/Components/TrustBadges';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import {useNavigation} from '@react-navigation/native';

interface ScoreChange {
  date: string;
  change: number;
  reason: string;
}

interface ReputationData {
  omnisScore: number;
  trustTier: string;
  repaymentStreak: number;
  defaultCount: number;
  activeObligations: number;
  completedObligations: number;
  onTimeRate: number;
  scoreHistory: ScoreChange[];
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return GlobalStyles.Colors.primary400;
  if (score >= 60) return GlobalStyles.Colors.primary200;
  if (score >= 40) return '#FFA500';
  return GlobalStyles.Colors.primary300;
};

const ReputationDashboard: React.FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const userId = useSelector((state: AppState) => state.user?.userId);
  const navigation = useNavigation<any>();

  const [reputationData, setReputationData] = useState<ReputationData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/user/reputation',
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setReputationData(response.data);
      } catch (error) {
        console.error('Error fetching reputation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle
          title="Reputation"
          showBackArrow={true}
          showRightIcon={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  const score = reputationData?.omnisScore ?? 0;
  const scoreColor = getScoreColor(score);

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Reputation"
        showBackArrow={true}
        showRightIcon={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, {borderColor: scoreColor}]}>
            <Text style={[styles.scoreNumber, {color: scoreColor}]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>OMNIS Score</Text>
          </View>
          <View style={styles.trustTierContainer}>
            <Icon
              name="shield-check"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.trustTierText}>
              {reputationData?.trustTier ?? 'Unranked'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="fire"
              label="Repayment Streak"
              value={`${reputationData?.repaymentStreak ?? 0}`}
            />
            <MetricCard
              icon="alert-circle"
              label="Defaults"
              value={`${reputationData?.defaultCount ?? 0}`}
              valueColor={
                (reputationData?.defaultCount ?? 0) > 0
                  ? GlobalStyles.Colors.primary300
                  : GlobalStyles.Colors.primary400
              }
            />
            <MetricCard
              icon="progress-clock"
              label="Active Obligations"
              value={`${reputationData?.activeObligations ?? 0}`}
            />
            <MetricCard
              icon="check-circle"
              label="Completed"
              value={`${reputationData?.completedObligations ?? 0}`}
              valueColor={GlobalStyles.Colors.primary400}
            />
            <MetricCard
              icon="clock-check"
              label="On-Time Rate"
              value={`${Math.round(reputationData?.onTimeRate ?? 0)}%`}
            />
          </View>
        </View>

        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Trust Badges</Text>
          {userId ? (
            <TrustBadges userId={userId} />
          ) : (
            <Text style={styles.placeholderText}>
              Sign in to view your badges
            </Text>
          )}
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Score History</Text>
          {reputationData?.scoreHistory &&
          reputationData.scoreHistory.length > 0 ? (
            reputationData.scoreHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text style={styles.historyReason}>{entry.reason}</Text>
                </View>
                <Text
                  style={[
                    styles.historyChange,
                    {
                      color:
                        entry.change >= 0
                          ? GlobalStyles.Colors.primary400
                          : GlobalStyles.Colors.primary300,
                    },
                  ]}>
                  {entry.change >= 0 ? '+' : ''}
                  {entry.change}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No score history yet</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.endorsementsButton}
          onPress={() =>
            navigation.navigate('Endorsements', {
              userId,
              isOwnProfile: true,
            })
          }>
          <Icon
            name="message-star"
            size={20}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.endorsementsButtonText}>View Endorsements</Text>
          <Icon
            name="chevron-right"
            size={20}
            color={GlobalStyles.Colors.primary100}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const MetricCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}> = ({icon, label, value, valueColor}) => (
  <View style={styles.metricCard}>
    <Icon
      name={icon}
      size={22}
      color={GlobalStyles.Colors.primary200}
    />
    <Text
      style={[
        styles.metricValue,
        valueColor ? {color: valueColor} : undefined,
      ]}>
      {value}
    </Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary120,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: GlobalStyles.Colors.accent300,
    marginTop: 2,
  },
  trustTierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: GlobalStyles.Colors.primary120,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trustTierText: {
    fontSize: 14,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary500,
    marginLeft: 8,
  },
  metricsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary500,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary500,
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: GlobalStyles.Colors.accent300,
    marginTop: 4,
    textAlign: 'center',
  },
  badgesSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.Colors.accent250,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: GlobalStyles.Colors.accent300,
  },
  historyReason: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary500,
    marginTop: 2,
  },
  historyChange: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: GlobalStyles.Colors.accent300,
    textAlign: 'center',
    paddingVertical: 20,
  },
  endorsementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.primary200,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  endorsementsButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    flex: 1,
    textAlign: 'center',
  },
});

export default ReputationDashboard;
