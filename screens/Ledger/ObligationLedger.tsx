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
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

interface ObligationSummary {
  totalBorrowed: number;
  totalLent: number;
  amountOverdue: number;
  amountRepaid: number;
}

interface Obligation {
  id: string;
  counterpartyName: string;
  principal: number;
  remaining: number;
  nextPaymentDate: string;
  status: string;
}

type FilterTab = 'all' | 'active' | 'completed' | 'overdue';

const ObligationLedger: React.FC = () => {
  const navigation = useNavigation();
  const token = useSelector((state: AppState) => state.token);

  const [summary, setSummary] = useState<ObligationSummary>({
    totalBorrowed: 0,
    totalLent: 0,
    amountOverdue: 0,
    amountRepaid: 0,
  });
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/ledger/obligations',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.summary) {
        setSummary(response.data.summary);
      }
      if (response.data.obligations) {
        setObligations(response.data.obligations);
      }
    } catch (error) {
      console.error('Error fetching obligations:', error);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return GlobalStyles.Colors.primary200;
      case 'completed':
        return GlobalStyles.Colors.primary400;
      case 'overdue':
        return GlobalStyles.Colors.primary300;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const filteredObligations = obligations.filter(obligation => {
    if (activeFilter === 'all') {
      return true;
    }
    return obligation.status.toLowerCase() === activeFilter;
  });

  const renderSummaryCard = (
    label: string,
    value: number,
    iconName: string,
    color: string,
  ) => (
    <View style={styles.summaryCard}>
      <Icon name={iconName} size={24} color={color} />
      <Text style={styles.summaryValue}>${value.toFixed(2)}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );

  const filterTabs: {key: FilterTab; label: string}[] = [
    {key: 'all', label: 'All'},
    {key: 'active', label: 'Active'},
    {key: 'completed', label: 'Completed'},
    {key: 'overdue', label: 'Overdue'},
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="My Obligations" showBackArrow={true} />
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
      <ScreenTitle title="My Obligations" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.summaryRow}>
          {renderSummaryCard(
            'Borrowed',
            summary.totalBorrowed,
            'arrow-down-circle-outline',
            GlobalStyles.Colors.primary200,
          )}
          {renderSummaryCard(
            'Lent',
            summary.totalLent,
            'arrow-up-circle-outline',
            GlobalStyles.Colors.primary400,
          )}
        </View>
        <View style={styles.summaryRow}>
          {renderSummaryCard(
            'Overdue',
            summary.amountOverdue,
            'alert-circle-outline',
            GlobalStyles.Colors.primary300,
          )}
          {renderSummaryCard(
            'Repaid',
            summary.amountRepaid,
            'checkmark-circle-outline',
            GlobalStyles.Colors.primary400,
          )}
        </View>

        <View style={styles.filterRow}>
          {filterTabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                activeFilter === tab.key && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(tab.key)}>
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab.key && styles.filterTabTextActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredObligations.length === 0 ? (
          <Text style={styles.noDataText}>No obligations found.</Text>
        ) : (
          filteredObligations.map(obligation => (
            <TouchableOpacity
              key={obligation.id}
              style={styles.obligationItem}
              onPress={() =>
                (navigation as any).navigate('LoanLifecycle', {
                  loanId: obligation.id,
                })
              }>
              <View style={styles.obligationHeader}>
                <Text style={styles.counterpartyName}>
                  {obligation.counterpartyName}
                </Text>
                <Text
                  style={[
                    styles.obligationStatus,
                    {color: getStatusColor(obligation.status)},
                  ]}>
                  {obligation.status}
                </Text>
              </View>
              <View style={styles.obligationDetails}>
                <View style={styles.obligationDetail}>
                  <Text style={styles.detailLabel}>Principal</Text>
                  <Text style={styles.detailValue}>
                    ${obligation.principal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.obligationDetail}>
                  <Text style={styles.detailLabel}>Remaining</Text>
                  <Text style={styles.detailValue}>
                    ${obligation.remaining.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.nextPaymentRow}>
                <Icon
                  name="calendar-outline"
                  size={14}
                  color={GlobalStyles.Colors.accent100}
                />
                <Text style={styles.nextPaymentText}>
                  Next: {obligation.nextPaymentDate}
                </Text>
              </View>
            </TouchableOpacity>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  summaryValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  filterTabText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: GlobalStyles.Colors.primary100,
  },
  noDataText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 40,
  },
  obligationItem: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  obligationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  counterpartyName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  obligationStatus: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  obligationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  obligationDetail: {
    flex: 1,
  },
  detailLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  nextPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPaymentText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginLeft: 6,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ObligationLedger;
