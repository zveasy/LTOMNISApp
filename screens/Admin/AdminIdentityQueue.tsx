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

interface VerificationItem {
  id: string;
  userName: string;
  type: 'ID' | 'selfie' | 'address';
  submittedDate: string;
  documentUrl?: string;
}

export default function AdminIdentityQueue() {
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [queue, setQueue] = useState<VerificationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/identity/queue',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setQueue(response.data || []);
    } catch (error) {
      console.error('Error fetching identity queue:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQueue();
    setRefreshing(false);
  }, [fetchQueue]);

  const handleReview = async (
    verificationId: string,
    decision: 'approve' | 'reject',
  ) => {
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/identity/${verificationId}/review`,
        {decision, reason},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', `Verification ${decision}d.`);
      setModalVisible(false);
      setReason('');
      setSelectedItem(null);
      fetchQueue();
    } catch (error) {
      console.error('Error reviewing identity:', error);
      Alert.alert('Error', 'Failed to review verification.');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ID':
        return 'id-card-outline';
      case 'selfie':
        return 'camera-outline';
      case 'address':
        return 'home-outline';
      default:
        return 'document-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Identity Review" showBackArrow />
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
      <ScreenTitle title="Identity Review" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {queue.length === 0 ? (
          <Text style={styles.emptyText}>
            No pending verifications in queue.
          </Text>
        ) : (
          queue.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.queueCard}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}>
              <View style={styles.queueIcon}>
                <Icon
                  name={getTypeIcon(item.type)}
                  size={28}
                  color={GlobalStyles.Colors.primary200}
                />
              </View>
              <View style={styles.queueInfo}>
                <Text style={styles.queueName}>{item.userName}</Text>
                <Text style={styles.queueType}>{item.type} Verification</Text>
                <Text style={styles.queueDate}>{item.submittedDate}</Text>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={GlobalStyles.Colors.accent110}
              />
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
              <Text style={styles.modalTitle}>Review Verification</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={GlobalStyles.Colors.primary100}
                />
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User</Text>
                  <Text style={styles.detailValue}>
                    {selectedItem.userName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{selectedItem.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Submitted</Text>
                  <Text style={styles.detailValue}>
                    {selectedItem.submittedDate}
                  </Text>
                </View>

                <View style={styles.documentPlaceholder}>
                  <Icon
                    name="image-outline"
                    size={48}
                    color={GlobalStyles.Colors.accent110}
                  />
                  <Text style={styles.placeholderText}>Document Preview</Text>
                </View>

                <Text style={styles.reasonLabel}>Reason (optional)</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Enter reason for decision..."
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
                    onPress={() => handleReview(selectedItem.id, 'approve')}
                    disabled={actionLoading}>
                    <Icon
                      name="checkmark"
                      size={20}
                      color={GlobalStyles.Colors.primary100}
                    />
                    <Text style={styles.reviewBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.reviewBtn,
                      {backgroundColor: GlobalStyles.Colors.primary300},
                    ]}
                    onPress={() => handleReview(selectedItem.id, 'reject')}
                    disabled={actionLoading}>
                    <Icon
                      name="close"
                      size={20}
                      color={GlobalStyles.Colors.primary100}
                    />
                    <Text style={styles.reviewBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
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
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  queueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(189,174,141,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  queueType: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 13,
    marginTop: 2,
  },
  queueDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
    marginTop: 2,
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
    maxHeight: '85%',
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
  documentPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    marginTop: 8,
  },
  reasonLabel: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 16,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  reviewBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
});
