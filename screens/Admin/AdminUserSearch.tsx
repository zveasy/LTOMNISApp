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

interface UserResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  verificationStatus: string;
  omnisScore: number;
}

export default function AdminUserSearch() {
  const token = useSelector((state: AppState) => state.token);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [overrideScore, setOverrideScore] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const searchUsers = useCallback(async () => {
    if (!query.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/admin/users/search',
        {
          params: {q: query.trim()},
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setResults(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users.');
    } finally {
      setLoading(false);
    }
  }, [query, token.token]);

  const handleUserAction = async (
    userId: string,
    action: 'suspend' | 'ban' | 'reinstate',
  ) => {
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/user/${userId}/action`,
        {action},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', `User ${action} successful.`);
      setModalVisible(false);
      searchUsers();
    } catch (error) {
      console.error('Error performing user action:', error);
      Alert.alert('Error', `Failed to ${action} user.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverrideScore = async (userId: string) => {
    if (!overrideScore.trim()) {
      Alert.alert('Error', 'Please enter a score.');
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/admin/user/${userId}/override_score`,
        {score: Number(overrideScore)},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Trust score overridden.');
      setOverrideScore('');
      setModalVisible(false);
      searchUsers();
    } catch (error) {
      console.error('Error overriding score:', error);
      Alert.alert('Error', 'Failed to override score.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return GlobalStyles.Colors.primary400;
      case 'suspended':
        return '#FFC107';
      case 'banned':
        return GlobalStyles.Colors.primary300;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const openUserDetail = (user: UserResult) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="User Management" showBackArrow />
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
            placeholder="Search by name, email, or ID..."
            placeholderTextColor={GlobalStyles.Colors.accent100}
            onSubmitEditing={searchUsers}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={searchUsers}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

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
          {results.length === 0 && query.trim() !== '' && (
            <Text style={styles.emptyText}>No users found.</Text>
          )}
          {results.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => openUserDetail(user)}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusColor(user.status)},
                    ]}>
                    <Text style={styles.statusBadgeText}>{user.status}</Text>
                  </View>
                  <Text style={styles.verificationText}>
                    {user.verificationStatus}
                  </Text>
                </View>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{user.omnisScore}</Text>
                <Text style={styles.scoreLabel}>OMNIS</Text>
              </View>
            </TouchableOpacity>
          ))}
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
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={GlobalStyles.Colors.primary100}
                />
              </TouchableOpacity>
            </View>
            {selectedUser && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: getStatusColor(selectedUser.status)},
                    ]}>
                    {selectedUser.status}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Verification</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.verificationStatus}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>OMNIS Score</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.omnisScore}
                  </Text>
                </View>

                <Text style={styles.actionsTitle}>Account Actions</Text>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, {backgroundColor: '#FFC107'}]}
                    onPress={() => handleUserAction(selectedUser.id, 'suspend')}
                    disabled={actionLoading}>
                    <Text style={styles.actionBtnText}>Suspend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {backgroundColor: GlobalStyles.Colors.primary300},
                    ]}
                    onPress={() => handleUserAction(selectedUser.id, 'ban')}
                    disabled={actionLoading}>
                    <Text style={styles.actionBtnText}>Ban</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {backgroundColor: GlobalStyles.Colors.primary400},
                    ]}
                    onPress={() =>
                      handleUserAction(selectedUser.id, 'reinstate')
                    }
                    disabled={actionLoading}>
                    <Text style={styles.actionBtnText}>Reinstate</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.actionsTitle}>Override Trust Score</Text>
                <View style={styles.overrideRow}>
                  <TextInput
                    style={styles.overrideInput}
                    value={overrideScore}
                    onChangeText={setOverrideScore}
                    placeholder="New score"
                    placeholderTextColor={GlobalStyles.Colors.accent100}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.overrideBtn}
                    onPress={() => handleOverrideScore(selectedUser.id)}
                    disabled={actionLoading}>
                    {actionLoading ? (
                      <ActivityIndicator
                        color={GlobalStyles.Colors.primary100}
                        size="small"
                      />
                    ) : (
                      <Text style={styles.overrideBtnText}>Override</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
  userCard: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
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
  verificationText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  scoreValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 22,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 10,
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
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  overrideRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  overrideInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
  },
  overrideBtn: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  overrideBtnText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
});
