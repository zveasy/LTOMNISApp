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
import Icon from 'react-native-vector-icons/Ionicons';

type DisputeScreenRouteParams = {
  DisputeScreen: {contractId?: string; loanId?: string};
};

interface Dispute {
  id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

const DISPUTE_TYPES = [
  {label: 'Payment Not Received', value: 'payment_not_received'},
  {label: 'Incorrect Amount', value: 'incorrect_amount'},
  {label: 'Unauthorized', value: 'unauthorized'},
  {label: 'Other', value: 'other'},
];

const DisputeScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<DisputeScreenRouteParams, 'DisputeScreen'>>();
  const contractId = route.params?.contractId;
  const loanId = route.params?.loanId;
  const token = useSelector((state: AppState) => state.token);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  useEffect(() => {
    fetchDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/disputes/my',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setDisputes(response.data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoadingDisputes(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a dispute type.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/disputes/create',
        {
          type: selectedType,
          description: description.trim(),
          contractId,
          loanId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Dispute submitted successfully.');
      setSelectedType(null);
      setDescription('');
      fetchDisputes();
    } catch (error) {
      console.error('Error submitting dispute:', error);
      Alert.alert('Error', 'Failed to submit dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return GlobalStyles.Colors.primary400;
      case 'pending':
        return GlobalStyles.Colors.primary200;
      case 'rejected':
        return GlobalStyles.Colors.primary300;
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const renderDisputeItem = ({item}: {item: Dispute}) => (
    <View style={styles.disputeItem}>
      <View style={styles.disputeHeader}>
        <Text style={styles.disputeType}>
          {DISPUTE_TYPES.find(t => t.value === item.type)?.label ?? item.type}
        </Text>
        <Text
          style={[styles.disputeStatus, {color: getStatusColor(item.status)}]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.disputeDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.disputeDate}>{item.createdAt}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="File a Dispute" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {(contractId || loanId) && (
          <View style={styles.card}>
            <Text style={styles.referenceLabel}>
              Related {contractId ? 'Contract' : 'Loan'} ID
            </Text>
            <Text style={styles.referenceValue}>{contractId ?? loanId}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dispute Type</Text>
          {DISPUTE_TYPES.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeOption,
                selectedType === type.value && styles.typeOptionSelected,
              ]}
              onPress={() => setSelectedType(type.value)}>
              <View
                style={[
                  styles.radio,
                  selectedType === type.value && styles.radioSelected,
                ]}>
                {selectedType === type.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.typeLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={GlobalStyles.Colors.accent100}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Icon
              name="cloud-upload-outline"
              size={24}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.uploadText}>Upload Evidence (Coming Soon)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedType || !description.trim() || submitting) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSubmitDispute}
          disabled={!selectedType || !description.trim() || submitting}>
          {submitting ? (
            <ActivityIndicator color={GlobalStyles.Colors.primary100} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Dispute</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.existingTitle}>My Disputes</Text>
        {loadingDisputes ? (
          <ActivityIndicator
            size="small"
            color={GlobalStyles.Colors.primary200}
            style={styles.disputeLoader}
          />
        ) : disputes.length === 0 ? (
          <Text style={styles.noDisputesText}>No disputes filed yet.</Text>
        ) : (
          disputes.map(item => (
            <View key={item.id}>{renderDisputeItem({item})}</View>
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
  referenceLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginBottom: 4,
  },
  referenceValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(189,174,141,0.1)',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: GlobalStyles.Colors.primary200,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  typeLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    minHeight: 120,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
  },
  uploadText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    marginLeft: 8,
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
  existingTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  disputeLoader: {
    marginVertical: 20,
  },
  noDisputesText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  disputeItem: {
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
  disputeStatus: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  disputeDescription: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginBottom: 8,
  },
  disputeDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default DisputeScreen;
