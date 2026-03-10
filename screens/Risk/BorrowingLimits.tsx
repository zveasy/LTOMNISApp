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

interface LimitChange {
  date: string;
  oldLimit: number;
  newLimit: number;
  reason: string;
}

interface BorrowingLimitsData {
  currentTier: number;
  maxLoanAmount: number;
  currentBorrowed: number;
  nextTierRequirement: number;
  progressToNextTier: number;
  requirements: string[];
  limitHistory: LimitChange[];
}

export default function BorrowingLimits() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BorrowingLimitsData>({
    currentTier: 3,
    maxLoanAmount: 5000,
    currentBorrowed: 1750,
    nextTierRequirement: 7500,
    progressToNextTier: 67,
    requirements: [
      'Maintain 95%+ on-time payment rate',
      'Complete 10+ successful loan cycles',
      'Account age of 6+ months',
      'No defaults in the last 12 months',
    ],
    limitHistory: [
      {
        date: '2025-01-15',
        oldLimit: 2500,
        newLimit: 5000,
        reason: 'Tier upgrade',
      },
      {
        date: '2024-09-01',
        oldLimit: 1000,
        newLimit: 2500,
        reason: 'Good standing',
      },
    ],
  });

  useEffect(() => {
    fetchBorrowingLimits();
  }, []);

  const fetchBorrowingLimits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/risk/borrowing_limits');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching borrowing limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const utilizationPercent =
    data.maxLoanAmount > 0
      ? Math.round((data.currentBorrowed / data.maxLoanAmount) * 100)
      : 0;

  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) {
      return GlobalStyles.Colors.primary300;
    }
    if (percent >= 50) {
      return '#F5A623';
    }
    return GlobalStyles.Colors.primary400;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Borrowing Limits" showBackArrow />
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
      <ScreenTitle title="Borrowing Limits" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Current Tier & Limit */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current Tier</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>Tier {data.currentTier}</Text>
          </View>
          <Text style={styles.limitAmount}>
            ${data.maxLoanAmount.toLocaleString()}
          </Text>
          <Text style={styles.limitSubtext}>Maximum Loan Amount</Text>
        </View>

        {/* Utilization */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Utilization</Text>
          <View style={styles.utilizationHeader}>
            <Text style={styles.utilizationText}>
              ${data.currentBorrowed.toLocaleString()} / $
              {data.maxLoanAmount.toLocaleString()}
            </Text>
            <Text
              style={[
                styles.utilizationPercent,
                {color: getUtilizationColor(utilizationPercent)},
              ]}>
              {utilizationPercent}%
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${utilizationPercent}%`,
                  backgroundColor: getUtilizationColor(utilizationPercent),
                },
              ]}
            />
          </View>
          <Text style={styles.utilizationHint}>
            {utilizationPercent < 50
              ? 'Good — Low utilization helps maintain your score'
              : utilizationPercent < 80
              ? 'Moderate — Consider paying down before borrowing more'
              : 'High — Reduce borrowing to improve your standing'}
          </Text>
        </View>

        {/* Progress to Next Tier */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress to Next Tier</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Tier {data.currentTier} → Tier {data.currentTier + 1}
            </Text>
            <Text style={styles.progressPercent}>
              {data.progressToNextTier}%
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${data.progressToNextTier}%`,
                  backgroundColor: GlobalStyles.Colors.primary200,
                },
              ]}
            />
          </View>
          <Text style={styles.nextTierLimit}>
            Next tier limit: ${data.nextTierRequirement.toLocaleString()}
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requirements to Increase Limits</Text>
          {data.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.requirementIcon}>
                <Icon
                  name="ellipse-outline"
                  size={14}
                  color={GlobalStyles.Colors.primary200}
                />
              </View>
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Limit History</Text>
          {data.limitHistory.map((change, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDot} />
              {index < data.limitHistory.length - 1 && (
                <View style={styles.historyLine} />
              )}
              <View style={styles.historyContent}>
                <Text style={styles.historyDate}>{change.date}</Text>
                <View style={styles.historyChange}>
                  <Text style={styles.historyOld}>
                    ${change.oldLimit.toLocaleString()}
                  </Text>
                  <Icon
                    name="arrow-forward"
                    size={14}
                    color={GlobalStyles.Colors.primary200}
                  />
                  <Text style={styles.historyNew}>
                    ${change.newLimit.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.historyReason}>{change.reason}</Text>
              </View>
            </View>
          ))}
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
  heroCard: {
    backgroundColor: 'rgba(189,174,141,0.15)',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  heroLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    marginBottom: 8,
  },
  tierBadge: {
    backgroundColor: GlobalStyles.Colors.primary200,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  tierBadgeText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: 'bold',
  },
  limitAmount: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 36,
    fontWeight: 'bold',
  },
  limitSubtext: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
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
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  utilizationText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
  },
  utilizationPercent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  utilizationHint: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
  },
  progressPercent: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextTierLimit: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requirementIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  requirementText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GlobalStyles.Colors.primary200,
    marginTop: 4,
    marginRight: 14,
    zIndex: 1,
  },
  historyLine: {
    position: 'absolute',
    left: 4,
    top: 14,
    bottom: -16,
    width: 2,
    backgroundColor: 'rgba(189,174,141,0.3)',
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginBottom: 4,
  },
  historyChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  historyOld: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  historyNew: {
    color: GlobalStyles.Colors.primary400,
    fontSize: 15,
    fontWeight: 'bold',
  },
  historyReason: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
});
