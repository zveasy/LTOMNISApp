import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../assets/constants/colors';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import {useRoute} from '@react-navigation/native';

type FilterType = 'open' | 'funded' | 'active' | 'completed';

interface LoanRequest {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  date: string;
  status: FilterType;
}

export default function GroupLoanRequests() {
  const route = useRoute<any>();
  const groupId = route.params?.groupId;
  const token = useSelector((state: AppState) => state.token);

  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('open');

  const filters: FilterType[] = ['open', 'funded', 'active', 'completed'];

  const fetchLoanRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/group/${groupId}/loan_requests`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setLoanRequests(response.data.loanRequests ?? []);
    } catch (error) {
      console.error('Error fetching loan requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const filteredRequests = loanRequests.filter(
    req => req.status === activeFilter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return GlobalStyles.Colors.primary200;
      case 'funded':
        return GlobalStyles.Colors.primary400;
      case 'active':
        return '#3498db';
      case 'completed':
        return GlobalStyles.Colors.accent100;
      default:
        return GlobalStyles.Colors.primary600;
    }
  };

  const renderLoanRequest = ({item}: {item: LoanRequest}) => (
    <View style={styles.loanCard}>
      <View style={styles.loanCardHeader}>
        <Text style={styles.borrowerName}>{item.borrowerName}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.loanCardBody}>
        <View style={styles.loanDetail}>
          <Text style={styles.loanLabel}>Amount</Text>
          <Text style={styles.loanValue}>
            ${item.amount?.toFixed(2) ?? '0.00'}
          </Text>
        </View>
        <View style={styles.loanDetail}>
          <Text style={styles.loanLabel}>Purpose</Text>
          <Text style={styles.loanValue} numberOfLines={1}>
            {item.purpose}
          </Text>
        </View>
        <View style={styles.loanDetail}>
          <Text style={styles.loanLabel}>Date</Text>
          <Text style={styles.loanValue}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Group Loans"
        showBackArrow={true}
        onBackPress={() => {}}
      />

      <View style={styles.filterRow}>
        {filters.map(filter => (
          <Pressable
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      ) : filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {activeFilter} loan requests
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderLoanRequest}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CompleteButton
        text="Create Group Loan Request"
        color={GlobalStyles.Colors.primary200}
        onPress={() => {
          console.log('Create group loan request');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: GlobalStyles.Colors.accent116,
  },
  filterButtonActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  filterText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: GlobalStyles.Colors.primary100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loanCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  borrowerName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loanCardBody: {
    gap: 8,
  },
  loanDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
  },
  loanValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    fontWeight: '500',
    maxWidth: '60%',
  },
});
