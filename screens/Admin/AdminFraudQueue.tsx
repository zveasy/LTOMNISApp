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

interface FraudFlag {
  id: string;
  userName: string;
  userId: string;
  flagType: 'duplicate_identity' | 'velocity' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  description: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#FF9800',
  critical: '#F44336',
};

export default function AdminFraudQueue() {
  const token = useSelector((state: AppState) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [queue, setQueue] = useState<FraudFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<FraudFlag | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/fraud/queue',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data || [];
      data.sort((a: FraudFlag, b: FraudFlag) => {
        const order: Record<string, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
      });
      setQueue(data);
    } catch (error) {
      console.error('Error fetching fraud queue:', error);
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

  const handleAction = async (
    flagId: string,
    action: 'investigate' | 'dismiss' | 'suspend_user' | 'ban_user',
  ) => {
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/fraud/${flagId}/action`,
        {action, notes},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', `Action "${action}" completed.`);
      setModalVisible(false);
      setNotes('');
      fetchQueue();
    } catch (error) {
      console.error('Error performing fraud action:', error);
      Alert.alert('Error', 'Failed to perform action.');
    } finally {
      setActionLoading(false);
    }
  };

  const getFlagTypeLabel = (type: string) => {
    switch (type) {
      case 'duplicate_identity':
        return 'Duplicate Identity';
      case 'velocity':
        return 'Velocity';
      case 'suspicious_pattern':
        return 'Suspicious Pattern';
      default:
        return type;
    }
  };

  const getFlagTypeIcon = (type: string) => {
    switch (type) {
      case 'duplicate_identity':
        return 'people-outline';
      case 'velocity':
        return 'speedometer-outline';
      case 'suspicious_pattern':
        return 'eye-outline';
      default:
        return 'flag-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Fraud Queue" showBackArrow />
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
      <ScreenTitle title="Fraud Queue" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {queue.length === 0 ? (
          <Text style={styles.emptyText}>No fraud flags in queue.</Text>
        ) : (
          queue.map(flag => (
            <TouchableOpacity
              key={flag.id}
              style={styles.flagCard}
              onPress={() => {
                setSelectedFlag(flag);
                setModalVisible(true);
              }}>
              <View style={styles.flagHeader}>
                <View style={styles.flagTypeRow}>
                  <Icon
                    name={getFlagTypeIcon(flag.flagType)}
                    size={20}
                    color={SEVERITY_COLORS[flag.severity]}
                  />
                  <Text style={styles.flagType}>
                    {getFlagTypeLabel(flag.flagType)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.severityBadge,
                    {backgroundColor: SEVERITY_COLORS[flag.severity]},
                  ]}>
                  <Text style={styles.severityText}>{flag.severity}</Text>
                </View>
              </View>
              <Text style={styles.flagUser}>{flag.userName}</Text>
              <Text style={styles.flagDescription} numberOfLines={2}>
                {flag.description}
              </Text>
              <Text style={styles.flagDate}>{flag.date}</Text>
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
              <Text style={styles.modalTitle}>Fraud Flag Detail</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={GlobalStyles.Colors.primary100}
                />
              </TouchableOpacity>
            </View>
            {selectedFlag && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User</Text>
                  <Text style={styles.detailValue}>
                    {selectedFlag.userName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Flag Type</Text>
                  <Text style={styles.detailValue}>
                    {getFlagTypeLabel(selectedFlag.flagType)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Severity</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: SEVERITY_COLORS[selectedFlag.severity]},
                    ]}>
                    {selectedFlag.severity}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{selectedFlag.date}</Text>
                </View>
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>
                    {selectedFlag.description}
                  </Text>
                </View>

                <Text style={styles.notesLabel}>Investigation Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Enter investigation notes..."
                  placeholderTextColor={GlobalStyles.Colors.accent100}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Text style={styles.actionsLabel}>Actions</Text>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: GlobalStyles.Colors.primary200},
                  ]}
                  onPress={() => handleAction(selectedFlag.id, 'investigate')}
                  disabled={actionLoading}>
                  <Icon
                    name="search-outline"
                    size={18}
                    color={GlobalStyles.Colors.primary100}
                  />
                  <Text style={styles.actionBtnText}>Investigate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      marginTop: 8,
                    },
                  ]}
                  onPress={() => handleAction(selectedFlag.id, 'dismiss')}
                  disabled={actionLoading}>
                  <Icon
                    name="close-circle-outline"
                    size={18}
                    color={GlobalStyles.Colors.primary100}
                  />
                  <Text style={styles.actionBtnText}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: '#FFC107', marginTop: 8},
                  ]}
                  onPress={() => handleAction(selectedFlag.id, 'suspend_user')}
                  disabled={actionLoading}>
                  <Icon
                    name="pause-circle-outline"
                    size={18}
                    color={GlobalStyles.Colors.primary100}
                  />
                  <Text style={styles.actionBtnText}>Suspend User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: GlobalStyles.Colors.primary300,
                      marginTop: 8,
                    },
                  ]}
                  onPress={() => handleAction(selectedFlag.id, 'ban_user')}
                  disabled={actionLoading}>
                  <Icon
                    name="ban-outline"
                    size={18}
                    color={GlobalStyles.Colors.primary100}
                  />
                  <Text style={styles.actionBtnText}>Ban User</Text>
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
  flagCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagType: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  flagUser: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  flagDescription: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginBottom: 6,
  },
  flagDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
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
  },
  descriptionBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  descriptionText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    lineHeight: 20,
  },
  notesLabel: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 16,
  },
  actionsLabel: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
});
