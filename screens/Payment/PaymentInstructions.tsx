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

type PaymentHandle = {
  platform: string;
  handle: string;
};

const PLATFORM_ICONS: Record<string, string> = {
  zelle: 'flash-outline',
  venmo: 'logo-venmo',
  paypal: 'logo-paypal',
  cashapp: 'cash-outline',
  applepay: 'logo-apple',
  remitly: 'send-outline',
  wise: 'swap-horizontal-outline',
  worldremit: 'globe-outline',
  other: 'ellipsis-horizontal-outline',
};

export default function PaymentInstructions({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [obligation, setObligation] = useState<any>(null);
  const [lenderMethods, setLenderMethods] = useState<PaymentHandle[]>([]);

  const loanId = route?.params?.loanId;
  const amountDue = route?.params?.amountDue ?? 171.23;
  const dueDate = route?.params?.dueDate ?? '2025-07-15';
  const counterparty = route?.params?.counterparty ?? 'Zak Veasy';
  const lenderId = route?.params?.lenderId;

  useEffect(() => {
    if (loanId) {
      fetchLoanStatus();
    }
    if (lenderId) {
      fetchLenderMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId, lenderId]);

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

  const fetchLenderMethods = async () => {
    try {
      const response = await api.get(
        `/payment-methods/user/${lenderId}`,
      );
      setLenderMethods(response.data?.methods ?? response.data ?? []);
    } catch (error) {
      console.error('Error fetching lender payment methods:', error);
    }
  };

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform.toLowerCase()] ?? 'ellipsis-horizontal-outline';

  const lenderName = obligation?.counterparty ?? counterparty;

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
            <Text style={styles.summaryValue}>{lenderName}</Text>
          </View>
        </View>

        {/* Lender Payment Handles */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon
              name="person-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.sectionTitle}>
              Pay {lenderName} through any of these platforms:
            </Text>
          </View>

          {lenderMethods.length > 0 ? (
            lenderMethods.map((method, index) => (
              <View key={index} style={styles.handleRow}>
                <View style={styles.handleLeft}>
                  <View style={styles.handleIconCircle}>
                    <Icon
                      name={getPlatformIcon(method.platform)}
                      size={18}
                      color={GlobalStyles.Colors.primary200}
                    />
                  </View>
                  <View>
                    <Text style={styles.handlePlatform}>
                      {method.platform}
                    </Text>
                    <Text style={styles.handleValue}>{method.handle}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noMethodsText}>
              No payment handles available for this lender. Contact them
              directly.
            </Text>
          )}
        </View>

        {/* Pay via platform buttons */}
        {lenderMethods.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.payViaTitle}>Mark payment as sent</Text>
            {lenderMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.payViaButton}
                onPress={() =>
                  navigation.navigate('MarkAsPaid', {
                    loanId,
                    amountDue: obligation?.amountDue ?? amountDue,
                    counterpartyName: lenderName,
                    platform: method.platform.toLowerCase(),
                  })
                }>
                <Icon
                  name={getPlatformIcon(method.platform)}
                  size={18}
                  color={GlobalStyles.Colors.primary200}
                />
                <Text style={styles.payViaButtonText}>
                  I've paid via {method.platform}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={18}
                  color={GlobalStyles.Colors.accent110}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

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
          <View style={styles.noteItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noteText}>
              Your OMNIS credit score grows with each confirmed on-time payment.
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
            counterpartyName: lenderName,
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
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  handleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(189,174,141,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  handlePlatform: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  handleValue: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginTop: 2,
  },
  noMethodsText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    lineHeight: 20,
  },
  payViaTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  payViaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189,174,141,0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(189,174,141,0.2)',
  },
  payViaButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
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
