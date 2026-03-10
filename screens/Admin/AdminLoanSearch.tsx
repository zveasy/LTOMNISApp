import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

interface LoanResult {
  id: string;
  borrowerName: string;
  lenderName: string;
  amount: number;
  status: 'active' | 'delinquent' | 'defaulted' | 'completed';
  dueDate: string;
}

const STATUS_FILTERS = [
  'all',
  'active',
  'delinquent',
  'defaulted',
  'completed',
];

export default function AdminLoanSearch() {
  const token = useSelector((state: AppState) => state.token);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState<LoanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const searchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/loans/search',
        {
          params: {
            q: query.trim(),
            status: activeFilter === 'all' ? undefined : activeFilter,
          },
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setResults(response.data || []);
    } catch (error) {
      console.error('Error searching loans:', error);
      Alert.alert('Error', 'Failed to search loans.');
    } finally {
      setLoading(false);
    }
  }, [query, activeFilter, token.token]);

  const handleLoanAction = async (
    loanId: string,
    action: 'force_complete' | 'mark_defaulted' | 'apply_adjustment',
  ) => {
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/loans/${loanId}/action`,
        {action},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', `Loan action "${action}" completed.`);
      setModalVisible(false);
      searchLoans();
    } catch (error) {
      console.error('Error performing loan action:', error);
      Alert.alert('Error', 'Failed to perform action.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return GlobalStyles.Colors.primary400;
      case 'delinquent':
        return '#FFC107';
      case 'defaulted':
        return GlobalStyles.Colors.primary300;
      case 'completed':
        return GlobalStyles.Colors.primary200;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Loan Management" showBackArrow />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search-outline"
            size={20}
            color={GlobalStyles.Colors.accent100}
          />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Loan ID, user name, or status..."
            placeholderTextColor={GlobalStyles.Colors.accent100}
            onSubmitEditing={searchLoans}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={searchLoans}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}>
        {STATUS_FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}>
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={GlobalStyles.Colors.primary200}
          style={{marginTop: 40}}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>No loans found.</Text>
          ) : (
            results.map(loan => (
              <TouchableOpacity
                key={loan.id}
                style={styles.loanCard}
                onPress={() => {
                  setSelectedLoan(loan);
                  setModalVisible(true);
                }}>
                <View style={styles.loanHeader}>
                  <Text style={styles.loanId}>#{loan.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusColor(loan.status)},
                    ]}>
                    <Text style={styles.statusBadgeText}>{loan.status}</Text>
                  </View>
                </View>
                <View style={styles.loanDetails}>
                  <View style={styles.loanParty}>
                    <Text style={styles.partyLabel}>Borrower</Text>
                    <Text style={styles.partyName}>{loan.borrowerName}</Text>
                  </View>
                  <Icon
                    name="arrow-forward"
                    size={16}
                    color={GlobalStyles.Colors.accent110}
                  />
                  <View style={styles.loanParty}>
                    <Text style={styles.partyLabel}>Lender</Text>
                    <Text style={styles.partyName}>{loan.lenderName}</Text>
                  </View>
                </View>
                <View style={styles.loanFooter}>
                  <Text style={styles.loanAmount}>
                    ${loan.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.loanDue}>Due: {loan.dueDate}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{height: 40}} />
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Loan Detail</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={GlobalStyles.Colors.primary100}
                />
              </TouchableOpacity>
            </View>
            {selectedLoan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Loan ID</Text>
                  <Text style={styles.detailValue}>{selectedLoan.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Borrower</Text>
                  <Text style={styles.detailValue}>
                    {selectedLoan.borrowerName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lender</Text>
                  <Text style={styles.detailValue}>
                    {selectedLoan.lenderName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>
                    ${selectedLoan.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: getStatusColor(selectedLoan.status)},
                    ]}>
                    {selectedLoan.status}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>{selectedLoan.dueDate}</Text>
                </View>

                <Text style={styles.actionsTitle}>Admin Actions</Text>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: GlobalStyles.Colors.primary400},
                  ]}
                  onPress={() =>
                    handleLoanAction(selectedLoan.id, 'force_complete')
                  }
                  disabled={actionLoading}>
                  <Text style={styles.actionBtnText}>Force Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: GlobalStyles.Colors.primary300,
                      marginTop: 10,
                    },
                  ]}
                  onPress={() =>
                    handleLoanAction(selectedLoan.id, 'mark_defaulted')
                  }
                  disabled={actionLoading}>
                  <Text style={styles.actionBtnText}>Mark Defaulted</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: GlobalStyles.Colors.primary200,
                      marginTop: 10,
                    },
                  ]}
                  onPress={() =>
                    handleLoanAction(selectedLoan.id, 'apply_adjustment')
                  }
                  disabled={actionLoading}>
                  <Text style={styles.actionBtnText}>Apply Adjustment</Text>
                </TouchableOpacity>
                {actionLoading && (
                  <ActivityIndicator
                    color={GlobalStyles.Colors.primary200}
                    style={{marginTop: 12}}
                  />
                )}
                <View style={{height: 30}} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    paddingVertical: 12,
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
  filterScroll: {
    maxHeight: 50,
    marginTop: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  filterChipText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: GlobalStyles.Colors.primary100,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  loanCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanId: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loanDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loanParty: {
    flex: 1,
  },
  partyLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
  },
  partyName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  loanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loanDue: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: GlobalStyles.Colors.primary800,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  detailValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
});
