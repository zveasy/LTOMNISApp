import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../assets/constants/colors';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PoolActivity {
  id: string;
  type: 'contribution' | 'request' | 'withdrawal';
  memberName: string;
  amount: number;
  date: string;
  reason?: string;
}

interface PoolMember {
  id: string;
  name: string;
  contribution: number;
}

interface PoolRules {
  maxRequestAmount: number;
  minContribution: number;
  approvalRequired: boolean;
}

export default function SharedPool() {
  const route = useRoute<any>();
  const groupId = route.params?.groupId;
  const token = useSelector((state: AppState) => state.token);

  const [poolBalance, setPoolBalance] = useState(0);
  const [activities, setActivities] = useState<PoolActivity[]>([]);
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [poolRules, setPoolRules] = useState<PoolRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributeAmount, setContributeAmount] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [showContribute, setShowContribute] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const fetchPoolData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/group/${groupId}/pool`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setPoolBalance(response.data.balance ?? 0);
      setActivities(response.data.activities ?? []);
      setMembers(response.data.members ?? []);
      setPoolRules(response.data.rules ?? null);
    } catch (error) {
      console.error('Error fetching pool data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolData();
  }, []);

  const handleContribute = async () => {
    const amount = parseFloat(contributeAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/group/${groupId}/pool`,
        {type: 'contribution', amount},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setPoolBalance(prev => prev + amount);
      setContributeAmount('');
      setShowContribute(false);
      Alert.alert('Success', `Contributed $${amount.toFixed(2)} to the pool.`);
      fetchPoolData();
    } catch (error) {
      console.error('Error contributing:', error);
      Alert.alert('Error', 'Failed to contribute.');
    }
  };

  const handleRequestFromPool = async () => {
    const amount = parseFloat(requestAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!requestReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for the request.');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/group/${groupId}/pool`,
        {type: 'request', amount, reason: requestReason},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setRequestAmount('');
      setRequestReason('');
      setShowRequest(false);
      Alert.alert('Success', 'Request submitted for approval.');
      fetchPoolData();
    } catch (error) {
      console.error('Error requesting from pool:', error);
      Alert.alert('Error', 'Failed to submit request.');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'arrow-down-circle';
      case 'request':
        return 'arrow-up-circle';
      case 'withdrawal':
        return 'remove-circle';
      default:
        return 'ellipse';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return GlobalStyles.Colors.primary400;
      case 'request':
        return GlobalStyles.Colors.primary200;
      case 'withdrawal':
        return GlobalStyles.Colors.primary300;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle
          title="Shared Pool"
          showBackArrow={true}
          onBackPress={() => {}}
        />
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
      <ScreenTitle
        title="Shared Pool"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Pool Balance</Text>
          <Text style={styles.balanceAmount}>
            ${poolBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.contributeActionButton]}
            onPress={() => {
              setShowContribute(!showContribute);
              setShowRequest(false);
            }}>
            <Ionicons
              name="add-circle"
              size={20}
              color={GlobalStyles.Colors.primary100}
            />
            <Text style={styles.actionButtonText}>Contribute</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.requestActionButton]}
            onPress={() => {
              setShowRequest(!showRequest);
              setShowContribute(false);
            }}>
            <Ionicons
              name="hand-left"
              size={20}
              color={GlobalStyles.Colors.primary100}
            />
            <Text style={styles.actionButtonText}>Request from Pool</Text>
          </Pressable>
        </View>

        {showContribute && (
          <View style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>Contribute to Pool</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="decimal-pad"
                value={contributeAmount}
                onChangeText={setContributeAmount}
              />
            </View>
            <Pressable
              style={styles.submitInputButton}
              onPress={handleContribute}>
              <Text style={styles.submitInputButtonText}>Contribute</Text>
            </Pressable>
          </View>
        )}

        {showRequest && (
          <View style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>Request from Pool</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="decimal-pad"
                value={requestAmount}
                onChangeText={setRequestAmount}
              />
            </View>
            <TextInput
              style={styles.reasonInput}
              placeholder="Reason for request"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={requestReason}
              onChangeText={setRequestReason}
              multiline
            />
            <Pressable
              style={styles.submitInputButton}
              onPress={handleRequestFromPool}>
              <Text style={styles.submitInputButtonText}>Submit Request</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        ) : (
          activities.map(activity => (
            <View key={activity.id} style={styles.activityRow}>
              <Ionicons
                name={getActivityIcon(activity.type)}
                size={24}
                color={getActivityColor(activity.type)}
              />
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.memberName}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
                {activity.reason && (
                  <Text style={styles.activityReason}>{activity.reason}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.activityAmount,
                  {color: getActivityColor(activity.type)},
                ]}>
                {activity.type === 'contribution' ? '+' : '-'}$
                {activity.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Members & Contributions</Text>
        {members.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberContribution}>
              ${member.contribution.toFixed(2)}
            </Text>
          </View>
        ))}

        {poolRules && (
          <>
            <Text style={styles.sectionTitle}>Pool Rules</Text>
            <View style={styles.rulesCard}>
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>Max Request Amount</Text>
                <Text style={styles.ruleValue}>
                  ${poolRules.maxRequestAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>Min Contribution</Text>
                <Text style={styles.ruleValue}>
                  ${poolRules.minContribution.toFixed(2)}
                </Text>
              </View>
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>Approval Required</Text>
                <Text style={styles.ruleValue}>
                  {poolRules.approvalRequired ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollViewContainer: {
    paddingHorizontal: 5,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  balanceLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 40,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  contributeActionButton: {
    backgroundColor: GlobalStyles.Colors.primary400,
  },
  requestActionButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  actionButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  inputCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  inputCardTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dollarSign: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    paddingVertical: 10,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 12,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitInputButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitInputButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginTop: 2,
  },
  activityReason: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  memberName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
  },
  memberContribution: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
  },
  rulesCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  ruleLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  ruleValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
});
