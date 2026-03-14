import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

export default function PaymentInstructions({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [obligation, setObligation] = useState<any>(null);

  const loanId = route?.params?.loanId;
  const amountDue = route?.params?.amountDue ?? 171.23;
  const dueDate = route?.params?.dueDate ?? '2025-07-15';
  const counterparty = route?.params?.counterparty ?? 'Zak Veasy';

  useEffect(() => {
    if (loanId) {
      fetchLoanStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId]);

  const fetchLoanStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/omnis/loan/${loanId}/status`);
      setObligation(response.data);
    } catch (error) {
      console.error('Error fetching loan status:', error);
      Alert.alert('Error', 'Failed to load payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    console.log('Copied:', text);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Payment Instructions" showBackArrow />
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
      <ScreenTitle title="Payment Instructions" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Loan Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Due</Text>
            <Text style={styles.summaryValue}>
              ${obligation?.amountDue?.toFixed(2) ?? amountDue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Due Date</Text>
            <Text style={styles.summaryValue}>
              {obligation?.dueDate ?? dueDate}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pay To</Text>
            <Text style={styles.summaryValue}>
              {obligation?.counterparty ?? counterparty}
            </Text>
          </View>
        </View>

        {/* Bank Transfer Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon
              name="business-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.sectionTitle}>Bank Transfer</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Name</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValue}>LTOMNIS Escrow</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard('LTOMNIS Escrow')}>
                <Icon
                  name="copy-outline"
                  size={16}
                  color={GlobalStyles.Colors.accent110}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Routing Number</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValue}>021000021</Text>
              <TouchableOpacity onPress={() => copyToClipboard('021000021')}>
                <Icon
                  name="copy-outline"
                  size={16}
                  color={GlobalStyles.Colors.accent110}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValue}>4829103756</Text>
              <TouchableOpacity onPress={() => copyToClipboard('4829103756')}>
                <Icon
                  name="copy-outline"
                  size={16}
                  color={GlobalStyles.Colors.accent110}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* External Payment Apps */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon
              name="phone-portrait-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.sectionTitle}>External Payment Apps</Text>
          </View>
          <Text style={styles.infoText}>
            You can also pay using Venmo, Zelle, CashApp, or PayPal. Please use
            the recipient's registered email or phone number and include your
            loan reference ID in the notes.
          </Text>
        </View>

        {/* Important Notes */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon
              name="information-circle-outline"
              size={20}
              color={GlobalStyles.Colors.primary300}
            />
            <Text style={styles.sectionTitle}>Important Notes</Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noteText}>
              Bank transfers may take 1-3 business days to process.
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noteText}>
              After making a payment, you must mark it as paid and upload proof
              for confirmation.
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noteText}>
              The lender must confirm receipt before the payment is finalized.
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noteText}>
              Late payments may incur additional fees and affect your trust
              score.
            </Text>
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate('MarkAsPaid', {
            loanId,
            amountDue: obligation?.amountDue ?? amountDue,
            counterpartyName: obligation?.counterparty ?? counterparty,
          })
        }>
        <Text style={styles.primaryButtonText}>I've Made the Payment</Text>
      </TouchableOpacity>
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
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(189,174,141,0.15)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  summaryTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
  },
  summaryValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailRow: {
    marginBottom: 14,
  },
  detailLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginBottom: 4,
  },
  detailValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    lineHeight: 20,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  noteText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  primaryButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
