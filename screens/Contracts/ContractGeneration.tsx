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

type ContractGenRouteParams = {
  ContractGeneration: {
    offerId: string;
    lenderName: string;
    borrowerName: string;
    amount: number;
    interestRate: number;
    termMonths: number;
  };
};

const LEGAL_TERMS = `LOAN AGREEMENT TERMS AND CONDITIONS

1. DEFINITIONS
This Loan Agreement ("Agreement") is entered into between the Lender and Borrower identified above. "Principal" refers to the original loan amount. "Interest" refers to the cost of borrowing calculated at the stated rate.

2. REPAYMENT
The Borrower agrees to repay the total amount (Principal + Interest) in equal monthly installments over the agreed term. Payments are due on the same day each month.

3. LATE PAYMENTS
If a payment is not received within 5 days of the due date, a late fee will be assessed as a percentage of the missed payment amount, as specified above.

4. DEFAULT
If the Borrower fails to make three consecutive payments, the loan will be considered in default. The full remaining balance becomes immediately due and payable.

5. PREPAYMENT
The Borrower may prepay the loan in full at any time without penalty.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with applicable local laws.

7. DISPUTE RESOLUTION
Any disputes arising from this Agreement shall first be attempted to be resolved through the platform's dispute resolution process before pursuing external legal remedies.

8. AMENDMENTS
This Agreement may only be amended with the written consent of both parties through the platform's amendment process.`;

const ContractGeneration: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<ContractGenRouteParams, 'ContractGeneration'>>();
  const {offerId, lenderName, borrowerName, amount, interestRate, termMonths} =
    route.params;
  const token = useSelector((state: AppState) => state.token);

  const [lateFeePercentage, setLateFeePercentage] = useState('5');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalRepayment = amount + amount * (interestRate / 100);
  const monthlyPayment = totalRepayment / termMonths;

  const handleGenerate = async () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'You must agree to the terms before proceeding.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/contract/create',
        {
          offerId,
          lateFeePercentage: parseFloat(lateFeePercentage),
          termsAccepted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const contractId = response.data.contractId ?? response.data.id;
      (navigation as any).navigate('ContractView', {contractId});
    } catch (error) {
      console.error('Error generating contract:', error);
      Alert.alert('Error', 'Failed to generate contract. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSummaryRow = (label: string, value: string) => (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Generate Contract" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Loan Summary</Text>
          {renderSummaryRow('Lender', lenderName)}
          {renderSummaryRow('Borrower', borrowerName)}
          {renderSummaryRow('Amount', `$${amount.toFixed(2)}`)}
          {renderSummaryRow('Interest Rate', `${interestRate}%`)}
          {renderSummaryRow('Term', `${termMonths} months`)}
          {renderSummaryRow('Total Repayment', `$${totalRepayment.toFixed(2)}`)}
          {renderSummaryRow('Monthly Payment', `$${monthlyPayment.toFixed(2)}`)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Late Fee Percentage</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={lateFeePercentage}
              onChangeText={setLateFeePercentage}
              keyboardType="numeric"
              placeholder="5"
              placeholderTextColor={GlobalStyles.Colors.accent100}
            />
            <Text style={styles.percentSign}>%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Agreement Terms</Text>
          <ScrollView style={styles.legalScrollView} nestedScrollEnabled={true}>
            <Text style={styles.legalText}>{LEGAL_TERMS}</Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setTermsAccepted(!termsAccepted)}>
          <View
            style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && (
              <Icon
                name="checkmark"
                size={16}
                color={GlobalStyles.Colors.primary100}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the terms and conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.generateButton,
            (!termsAccepted || submitting) && styles.buttonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={!termsAccepted || submitting}>
          {submitting ? (
            <ActivityIndicator color={GlobalStyles.Colors.primary100} />
          ) : (
            <Text style={styles.generateButtonText}>Generate Contract</Text>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    height: 48,
  },
  percentSign: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 18,
  },
  legalScrollView: {
    maxHeight: 200,
  },
  legalText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    lineHeight: 20,
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
  },
  generateButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  generateButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ContractGeneration;
