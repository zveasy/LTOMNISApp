import React, {useState} from 'react';
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
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

type DigitalSignatureRouteParams = {
  DigitalSignature: {
    contractId: string;
    borrowerName?: string;
    lenderName?: string;
    principal?: number;
    interestRate?: number;
  };
};

const DigitalSignature: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<DigitalSignatureRouteParams, 'DigitalSignature'>>();
  const {contractId, borrowerName, lenderName, principal, interestRate} =
    route.params;
  const token = useSelector((state: AppState) => state.token);

  const [fullName, setFullName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSign = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name.');
      return;
    }
    if (!consentChecked) {
      Alert.alert('Error', 'You must provide consent before signing.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/contract/${contractId}/sign`,
        {
          fullName: fullName.trim(),
          dateSigned: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setSigned(true);
    } catch (error) {
      console.error('Error signing contract:', error);
      Alert.alert('Error', 'Failed to sign contract. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (signed) {
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Icon
              name="checkmark"
              size={48}
              color={GlobalStyles.Colors.primary100}
            />
          </View>
          <Text style={styles.successTitle}>Contract Signed!</Text>
          <Text style={styles.successSubtitle}>
            Your signature has been recorded successfully.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Sign Contract" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {(borrowerName || lenderName || principal) && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contract Summary</Text>
            {borrowerName && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Borrower</Text>
                <Text style={styles.summaryValue}>{borrowerName}</Text>
              </View>
            )}
            {lenderName && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Lender</Text>
                <Text style={styles.summaryValue}>{lenderName}</Text>
              </View>
            )}
            {principal !== undefined && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Principal</Text>
                <Text style={styles.summaryValue}>
                  ${principal?.toFixed(2)}
                </Text>
              </View>
            )}
            {interestRate !== undefined && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Interest Rate</Text>
                <Text style={styles.summaryValue}>{interestRate}%</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.agreementText}>
            By signing below, you agree to the terms of this contract. This
            digital signature is legally binding and represents your full
            consent to the loan agreement terms.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Full Name (Typed Signature)</Text>
          <TextInput
            style={styles.signatureInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full legal name"
            placeholderTextColor={GlobalStyles.Colors.accent100}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Date</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setConsentChecked(!consentChecked)}>
          <View
            style={[styles.checkbox, consentChecked && styles.checkboxChecked]}>
            {consentChecked && (
              <Icon
                name="checkmark"
                size={16}
                color={GlobalStyles.Colors.primary100}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I consent to signing this contract digitally and acknowledge that
            this signature is legally binding.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signButton,
            (!fullName.trim() || !consentChecked || submitting) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSign}
          disabled={!fullName.trim() || !consentChecked || submitting}>
          {submitting ? (
            <ActivityIndicator color={GlobalStyles.Colors.primary100} />
          ) : (
            <Text style={styles.signButtonText}>Sign & Accept</Text>
          )}
        </TouchableOpacity>

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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  summaryLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  summaryValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  agreementText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  signatureInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontStyle: 'italic',
  },
  dateText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  checkboxLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  signButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  signButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: GlobalStyles.Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  successSubtitle: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default DigitalSignature;
