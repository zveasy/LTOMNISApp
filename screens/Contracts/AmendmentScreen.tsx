import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

type AmendmentScreenRouteParams = {
  AmendmentScreen: {
    contractId: string;
    currentAmount?: number;
    currentTerm?: number;
    currentInterestRate?: number;
  };
};

interface PendingAmendment {
  id: string;
  proposedAmount?: number;
  proposedTerm?: number;
  proposedInterestRate?: number;
  reason: string;
  status: string;
  createdAt: string;
}

const AmendmentScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<AmendmentScreenRouteParams, 'AmendmentScreen'>>();
  const {contractId, currentAmount, currentTerm, currentInterestRate} =
    route.params;
  const token = useSelector((state: AppState) => state.token);

  const [newAmount, setNewAmount] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [amendments, setAmendments] = useState<PendingAmendment[]>([]);
  const [loadingAmendments, setLoadingAmendments] = useState(true);

  useEffect(() => {
    fetchAmendments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAmendments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/contract/${contractId}/amendments`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
          },
        },
      );
      setAmendments(response.data);
    } catch (error) {
      console.error('Error fetching amendments:', error);
    } finally {
      setLoadingAmendments(false);
    }
  };

  const handleSubmitAmendment = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the amendment.');
      return;
    }
    if (!newAmount && !newTerm && !newInterestRate) {
      Alert.alert('Error', 'Please propose at least one change.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/contract/${contractId}/amend`,
        {
          proposedAmount: newAmount ? parseFloat(newAmount) : undefined,
          proposedTerm: newTerm ? parseInt(newTerm, 10) : undefined,
          proposedInterestRate: newInterestRate
            ? parseFloat(newInterestRate)
            : undefined,
          reason: reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Amendment request submitted successfully.');
      setNewAmount('');
      setNewTerm('');
      setNewInterestRate('');
      setReason('');
      fetchAmendments();
    } catch (error) {
      console.error('Error submitting amendment:', error);
      Alert.alert('Error', 'Failed to submit amendment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return GlobalStyles.Colors.primary400;
      case 'pending':
        return GlobalStyles.Colors.primary200;
      case 'rejected':
        return GlobalStyles.Colors.primary300;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const renderCurrentTermsRow = (label: string, value: string) => (
    <View style={styles.termsRow}>
      <Text style={styles.termsLabel}>{label}</Text>
      <Text style={styles.termsValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Request Amendment" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current Contract Terms</Text>
          {renderCurrentTermsRow(
            'Amount',
            `$${currentAmount?.toFixed(2) ?? 'N/A'}`,
          )}
          {renderCurrentTermsRow(
            'Term',
            currentTerm ? `${currentTerm} months` : 'N/A',
          )}
          {renderCurrentTermsRow(
            'Interest Rate',
            currentInterestRate !== undefined
              ? `${currentInterestRate}%`
              : 'N/A',
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Proposed Changes</Text>

          <Text style={styles.inputLabel}>New Amount</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.textInput}
              value={newAmount}
              onChangeText={setNewAmount}
              placeholder="Leave blank to keep current"
              placeholderTextColor={GlobalStyles.Colors.accent100}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>New Term (months)</Text>
          <TextInput
            style={styles.textInputFull}
            value={newTerm}
            onChangeText={setNewTerm}
            placeholder="Leave blank to keep current"
            placeholderTextColor={GlobalStyles.Colors.accent100}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>New Interest Rate (%)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newInterestRate}
              onChangeText={setNewInterestRate}
              placeholder="Leave blank to keep current"
              placeholderTextColor={GlobalStyles.Colors.accent100}
              keyboardType="numeric"
            />
            <Text style={styles.inputSuffix}>%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reason for Amendment</Text>
          <TextInput
            style={styles.textArea}
            value={reason}
            onChangeText={setReason}
            placeholder="Explain why you're requesting this amendment..."
            placeholderTextColor={GlobalStyles.Colors.accent100}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!reason.trim() || submitting) && styles.buttonDisabled,
          ]}
          onPress={handleSubmitAmendment}
          disabled={!reason.trim() || submitting}>
          {submitting ? (
            <ActivityIndicator color={GlobalStyles.Colors.primary100} />
          ) : (
            <Text style={styles.submitButtonText}>Request Amendment</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.pendingTitle}>Pending Amendments</Text>
        {loadingAmendments ? (
          <ActivityIndicator
            size="small"
            color={GlobalStyles.Colors.primary200}
            style={styles.loader}
          />
        ) : amendments.length === 0 ? (
          <Text style={styles.noDataText}>No pending amendments.</Text>
        ) : (
          amendments.map(amendment => (
            <View key={amendment.id} style={styles.amendmentItem}>
              <View style={styles.amendmentHeader}>
                <Text style={styles.amendmentDate}>{amendment.createdAt}</Text>
                <Text
                  style={[
                    styles.amendmentStatus,
                    {color: getStatusColor(amendment.status)},
                  ]}>
                  {amendment.status}
                </Text>
              </View>
              {amendment.proposedAmount !== undefined && (
                <Text style={styles.amendmentDetail}>
                  New Amount: ${amendment.proposedAmount.toFixed(2)}
                </Text>
              )}
              {amendment.proposedTerm !== undefined && (
                <Text style={styles.amendmentDetail}>
                  New Term: {amendment.proposedTerm} months
                </Text>
              )}
              {amendment.proposedInterestRate !== undefined && (
                <Text style={styles.amendmentDetail}>
                  New Rate: {amendment.proposedInterestRate}%
                </Text>
              )}
              <Text style={styles.amendmentReason}>{amendment.reason}</Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  termsLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  termsValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  inputLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputPrefix: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 18,
    marginRight: 4,
  },
  inputSuffix: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 18,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    height: 48,
  },
  textInputFull: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    height: 48,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  pendingTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  noDataText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  amendmentItem: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  amendmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amendmentDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  amendmentStatus: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  amendmentDetail: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    marginBottom: 4,
  },
  amendmentReason: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginTop: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AmendmentScreen;
