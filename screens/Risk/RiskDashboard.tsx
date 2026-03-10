import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

interface RiskData {
  trustTier: number;
  borrowingLimit: number;
  lendingExposure: number;
  restrictions: string[];
  scoreBreakdown: {
    onTimeRate: number;
    defaultHistory: number;
    accountAge: number;
    communityStanding: number;
  };
}

const TIER_COLORS: Record<number, string> = {
  1: '#FF4444',
  2: '#FF8C00',
  3: '#F5A623',
  4: '#7ED321',
  5: '#00835F',
};

const TIER_LABELS: Record<number, string> = {
  1: 'Starter',
  2: 'Bronze',
  3: 'Silver',
  4: 'Gold',
  5: 'Platinum',
};

export default function RiskDashboard() {
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState<RiskData>({
    trustTier: 3,
    borrowingLimit: 5000,
    lendingExposure: 2500,
    restrictions: [],
    scoreBreakdown: {
      onTimeRate: 92,
      defaultHistory: 0,
      accountAge: 85,
      communityStanding: 78,
    },
  });

  useEffect(() => {
    fetchRiskDashboard();
  }, []);

  const fetchRiskDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/risk/dashboard');
      if (response.data) {
        setRiskData(response.data);
      }
    } catch (error) {
      console.error('Error fetching risk dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTierDots = () => {
    return (
      <View style={styles.tierDotsContainer}>
        {[1, 2, 3, 4, 5].map(tier => (
          <View key={tier} style={styles.tierDotWrapper}>
            <View
              style={[
                styles.tierDot,
                {
                  backgroundColor:
                    tier <= riskData.trustTier
                      ? TIER_COLORS[tier]
                      : 'rgba(255,255,255,0.15)',
                },
                tier === riskData.trustTier && styles.tierDotActive,
              ]}
            />
            <Text
              style={[
                styles.tierLabel,
                tier === riskData.trustTier && {
                  color: TIER_COLORS[tier],
                  fontWeight: 'bold',
                },
              ]}>
              {tier}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderScoreBar = (label: string, value: number, icon: string) => {
    const barColor =
      value >= 80
        ? GlobalStyles.Colors.primary400
        : value >= 50
        ? '#F5A623'
        : GlobalStyles.Colors.primary300;

    return (
      <View style={styles.scoreBarItem}>
        <View style={styles.scoreBarHeader}>
          <View style={styles.scoreBarLeft}>
            <Icon
              name={icon}
              size={18}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.scoreBarLabel}>{label}</Text>
          </View>
          <Text style={[styles.scoreBarValue, {color: barColor}]}>
            {value}%
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {width: `${value}%`, backgroundColor: barColor},
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Risk Overview" showBackArrow />
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
      <ScreenTitle title="Risk Overview" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Trust Tier */}
        <View style={styles.tierCard}>
          <Text style={styles.tierCardTitle}>Trust Tier</Text>
          <View style={styles.tierDisplay}>
            <View
              style={[
                styles.tierCircle,
                {
                  borderColor: TIER_COLORS[riskData.trustTier],
                  shadowColor: TIER_COLORS[riskData.trustTier],
                },
              ]}>
              <Text
                style={[
                  styles.tierNumber,
                  {color: TIER_COLORS[riskData.trustTier]},
                ]}>
                {riskData.trustTier}
              </Text>
            </View>
            <Text style={styles.tierName}>
              {TIER_LABELS[riskData.trustTier]}
            </Text>
          </View>
          {renderTierDots()}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Icon
              name="trending-down-outline"
              size={24}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.metricValue}>
              ${riskData.borrowingLimit.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Borrowing Limit</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon
              name="trending-up-outline"
              size={24}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.metricValue}>
              ${riskData.lendingExposure.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Lending Exposure</Text>
          </View>
        </View>

        {/* Restrictions */}
        {riskData.restrictions.length > 0 && (
          <View style={styles.restrictionsCard}>
            <View style={styles.restrictionsHeader}>
              <Icon
                name="warning-outline"
                size={20}
                color={GlobalStyles.Colors.primary300}
              />
              <Text style={styles.restrictionsTitle}>Active Restrictions</Text>
            </View>
            {riskData.restrictions.map((restriction, index) => (
              <View key={index} style={styles.restrictionItem}>
                <Icon
                  name="close-circle"
                  size={16}
                  color={GlobalStyles.Colors.primary300}
                />
                <Text style={styles.restrictionText}>{restriction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Score Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Risk Score Breakdown</Text>
          {renderScoreBar(
            'On-Time Rate',
            riskData.scoreBreakdown.onTimeRate,
            'time-outline',
          )}
          {renderScoreBar(
            'Default History',
            100 - riskData.scoreBreakdown.defaultHistory,
            'shield-checkmark-outline',
          )}
          {renderScoreBar(
            'Account Age',
            riskData.scoreBreakdown.accountAge,
            'calendar-outline',
          )}
          {renderScoreBar(
            'Community Standing',
            riskData.scoreBreakdown.communityStanding,
            'people-outline',
          )}
        </View>

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
  tierCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  tierCardTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tierDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tierCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tierName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: '600',
  },
  tierDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  tierDotWrapper: {
    alignItems: 'center',
  },
  tierDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  tierDotActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  tierLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  metricValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
  },
  restrictionsCard: {
    backgroundColor: 'rgba(235,0,0,0.08)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(235,0,0,0.2)',
  },
  restrictionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restrictionsTitle: {
    color: GlobalStyles.Colors.primary300,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restrictionText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  breakdownCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  breakdownTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  scoreBarItem: {
    marginBottom: 18,
  },
  scoreBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBarLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    marginLeft: 8,
  },
  scoreBarValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
