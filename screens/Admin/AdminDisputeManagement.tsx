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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

interface Dispute {
  id: string;
  parties: string[];
  type: string;
  amount: number;
  date: string;
  status: 'open' | 'under_review' | 'resolved';
  history?: string[];
  messages?: string[];
  evidence?: string[];
}

const FILTER_TABS = ['Open', 'Under Review', 'Resolved'];

export default function AdminDisputeManagement() {
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [decisionText, setDecisionText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDisputes = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/disputes',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setDisputes(response.data || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDisputes();
    setRefreshing(false);
  }, [fetchDisputes]);

  const getFilteredDisputes = () => {
    const statusMap: Record<number, string> = {
      0: 'open',
      1: 'under_review',
      2: 'resolved',
    };
    return disputes.filter(d => d.status === statusMap[activeTab]);
  };

  const handleResolve = async (disputeId: string) => {
    if (!decisionText.trim()) {
      Alert.alert('Error', 'Please enter a decision.');
      return;
    }
    if (!selectedOutcome) {
      Alert.alert('Error', 'Please select an outcome.');
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/disputes/${disputeId}/resolve`,
        {
          decision: decisionText.trim(),
          outcome: selectedOutcome,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Dispute resolved.');
      setModalVisible(false);
      setDecisionText('');
      setSelectedOutcome(null);
      fetchDisputes();
    } catch (error) {
      console.error('Error resolving dispute:', error);
      Alert.alert('Error', 'Failed to resolve dispute.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (disputeId: string) => {
    if (!noteText.trim()) {
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/disputes/${disputeId}/note`,
        {note: noteText.trim()},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Note added.');
      setNoteText('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleAssignToSelf = async (disputeId: string) => {
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/disputes/${disputeId}/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Dispute assigned to you.');
      fetchDisputes();
    } catch (error) {
      console.error('Error assigning dispute:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#FFC107';
      case 'under_review':
        return GlobalStyles.Colors.primary200;
      case 'resolved':
        return GlobalStyles.Colors.primary400;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const OUTCOMES = [
    {label: 'Favor Borrower', value: 'favor_borrower'},
    {label: 'Favor Lender', value: 'favor_lender'},
    {label: 'Split', value: 'split'},
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Disputes" showBackArrow />
        <ActivityIndicator
          size="large"
          color={GlobalStyles.Colors.primary200}
          style={{marginTop: 40}}
        />
      </SafeAreaView>
    );
  }

  const filtered = getFilteredDisputes();

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Disputes" showBackArrow />

      <View style={styles.tabBar}>
        {FILTER_TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}>
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No disputes in this category.</Text>
        ) : (
          filtered.map(dispute => (
            <TouchableOpacity
              key={dispute.id}
              style={styles.disputeCard}
              onPress={() => {
                setSelectedDispute(dispute);
                setModalVisible(true);
              }}>
              <View style={styles.disputeHeader}>
                <Text style={styles.disputeType}>{dispute.type}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(dispute.status)},
                  ]}>
                  <Text style={styles.statusBadgeText}>
                    {dispute.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.disputeParties}>
                {dispute.parties.join(' vs ')}
              </Text>
              <View style={styles.disputeFooter}>
                <Text style={styles.disputeAmount}>
                  ${dispute.amount.toLocaleString()}
                </Text>
                <Text style={styles.disputeDate}>{dispute.date}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{height: 40}} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dispute Detail</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={GlobalStyles.Colors.primary100}
                />
              </TouchableOpacity>
            </View>
            {selectedDispute && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{selectedDispute.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Parties</Text>
                  <Text style={styles.detailValue}>
                    {selectedDispute.parties.join(' vs ')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>
                    ${selectedDispute.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: getStatusColor(selectedDispute.status)},
                    ]}>
                    {selectedDispute.status.replace('_', ' ')}
                  </Text>
                </View>

                {selectedDispute.history &&
                  selectedDispute.history.length > 0 && (
                    <View style={styles.historySection}>
                      <Text style={styles.sectionLabel}>History</Text>
                      {selectedDispute.history.map((entry, i) => (
                        <Text key={i} style={styles.historyEntry}>
                          {entry}
                        </Text>
                      ))}
                    </View>
                  )}

                <TouchableOpacity
                  style={styles.assignBtn}
                  onPress={() => handleAssignToSelf(selectedDispute.id)}>
                  <Icon
                    name="person-add-outline"
                    size={18}
                    color={GlobalStyles.Colors.primary100}
                  />
                  <Text style={styles.assignBtnText}>Assign to Self</Text>
                </TouchableOpacity>

                <Text style={styles.sectionLabel}>Add Note</Text>
                <View style={styles.noteRow}>
                  <TextInput
                    style={styles.noteInput}
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Add a note..."
                    placeholderTextColor={GlobalStyles.Colors.accent100}
                  />
                  <TouchableOpacity
                    style={styles.noteBtn}
                    onPress={() => handleAddNote(selectedDispute.id)}>
                    <Icon
                      name="send"
                      size={18}
                      color={GlobalStyles.Colors.primary100}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>Resolve Dispute</Text>
                <View style={styles.outcomesRow}>
                  {OUTCOMES.map(outcome => (
                    <TouchableOpacity
                      key={outcome.value}
                      style={[
                        styles.outcomeChip,
                        selectedOutcome === outcome.value &&
                          styles.outcomeChipActive,
                      ]}
                      onPress={() => setSelectedOutcome(outcome.value)}>
                      <Text
                        style={[
                          styles.outcomeChipText,
                          selectedOutcome === outcome.value &&
                            styles.outcomeChipTextActive,
                        ]}>
                        {outcome.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.decisionInput}
                  value={decisionText}
                  onChangeText={setDecisionText}
                  placeholder="Enter decision text..."
                  placeholderTextColor={GlobalStyles.Colors.accent100}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[
                    styles.resolveBtn,
                    (!decisionText.trim() || !selectedOutcome) &&
                      styles.btnDisabled,
                  ]}
                  onPress={() => handleResolve(selectedDispute.id)}
                  disabled={
                    actionLoading || !decisionText.trim() || !selectedOutcome
                  }>
                  {actionLoading ? (
                    <ActivityIndicator color={GlobalStyles.Colors.primary100} />
                  ) : (
                    <Text style={styles.resolveBtnText}>Resolve</Text>
                  )}
                </TouchableOpacity>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  tabText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: GlobalStyles.Colors.primary100,
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
  disputeCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  disputeType: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
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
  disputeParties: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginBottom: 8,
  },
  disputeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disputeAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disputeDate: {
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
    maxHeight: '90%',
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
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  historySection: {
    marginTop: 16,
  },
  sectionLabel: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  historyEntry: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginBottom: 4,
    paddingLeft: 8,
  },
  assignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  assignBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  noteRow: {
    flexDirection: 'row',
    gap: 10,
  },
  noteInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
  },
  noteBtn: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  outcomeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  outcomeChipActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  outcomeChipText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    fontWeight: '600',
  },
  outcomeChipTextActive: {
    color: GlobalStyles.Colors.primary100,
  },
  decisionInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 12,
  },
  resolveBtn: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolveBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
