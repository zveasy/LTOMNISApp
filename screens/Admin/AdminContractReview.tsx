import React, {useEffect, useState, useCallback} from 'react';
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
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

interface PendingContract {
  id: string;
  parties: string[];
  amount: number;
  terms: string;
  createdAt: string;
}

export default function AdminContractReview() {
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contracts, setContracts] = useState<PendingContract[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<PendingContract | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContracts = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/contracts/pending',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setContracts(response.data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContracts();
    setRefreshing(false);
  }, [fetchContracts]);

  const handleAction = async (
    contractId: string,
    action: 'approve' | 'reject' | 'request_changes',
  ) => {
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/contracts/${contractId}/review`,
        {action, notes: reviewNotes},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', `Contract ${action} completed.`);
      setSelectedContract(null);
      setReviewNotes('');
      fetchContracts();
    } catch (error) {
      console.error('Error reviewing contract:', error);
      Alert.alert('Error', 'Failed to review contract.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Contract Review" showBackArrow />
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
      <ScreenTitle title="Contract Review" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {contracts.length === 0 ? (
          <Text style={styles.emptyText}>No contracts pending review.</Text>
        ) : (
          contracts.map(contract => (
            <View key={contract.id}>
              <TouchableOpacity
                style={[
                  styles.contractCard,
                  selectedContract?.id === contract.id &&
                    styles.contractCardSelected,
                ]}
                onPress={() =>
                  setSelectedContract(
                    selectedContract?.id === contract.id ? null : contract,
                  )
                }>
                <View style={styles.contractHeader}>
                  <Text style={styles.contractId}>#{contract.id}</Text>
                  <Text style={styles.contractDate}>{contract.createdAt}</Text>
                </View>
                <Text style={styles.contractParties}>
                  {contract.parties.join(' & ')}
                </Text>
                <View style={styles.contractMeta}>
                  <Text style={styles.contractAmount}>
                    ${contract.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.contractTerms} numberOfLines={1}>
                    {contract.terms}
                  </Text>
                </View>
              </TouchableOpacity>

              {selectedContract?.id === contract.id && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Reviewer Notes</Text>
                  <TextInput
                    style={styles.reviewInput}
                    value={reviewNotes}
                    onChangeText={setReviewNotes}
                    placeholder="Add notes for this review..."
                    placeholderTextColor={GlobalStyles.Colors.accent100}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  <View style={styles.reviewActions}>
                    <TouchableOpacity
                      style={[
                        styles.reviewBtn,
                        {backgroundColor: GlobalStyles.Colors.primary400},
                      ]}
                      onPress={() => handleAction(contract.id, 'approve')}
                      disabled={actionLoading}>
                      <Icon
                        name="checkmark"
                        size={18}
                        color={GlobalStyles.Colors.primary100}
                      />
                      <Text style={styles.reviewBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.reviewBtn,
                        {backgroundColor: GlobalStyles.Colors.primary300},
                      ]}
                      onPress={() => handleAction(contract.id, 'reject')}
                      disabled={actionLoading}>
                      <Icon
                        name="close"
                        size={18}
                        color={GlobalStyles.Colors.primary100}
                      />
                      <Text style={styles.reviewBtnText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.reviewBtn,
                        {backgroundColor: GlobalStyles.Colors.primary200},
                      ]}
                      onPress={() =>
                        handleAction(contract.id, 'request_changes')
                      }
                      disabled={actionLoading}>
                      <Icon
                        name="create-outline"
                        size={18}
                        color={GlobalStyles.Colors.primary100}
                      />
                      <Text style={styles.reviewBtnText}>Changes</Text>
                    </TouchableOpacity>
                  </View>
                  {actionLoading && (
                    <ActivityIndicator
                      color={GlobalStyles.Colors.primary200}
                      style={{marginTop: 8}}
                    />
                  )}
                </View>
              )}
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
    paddingTop: 16,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  contractCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
  },
  contractCardSelected: {
    borderColor: GlobalStyles.Colors.primary200,
    borderWidth: 1,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contractId: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
  },
  contractDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  contractParties: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  contractMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contractTerms: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  reviewSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewLabel: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 10,
  },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  reviewBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    fontWeight: '600',
  },
});
