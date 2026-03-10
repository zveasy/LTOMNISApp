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

interface LatePayment {
  id: string;
  amount: number;
  daysOverdue: number;
  lateFeeAccrued: number;
  counterparty: string;
  originalDueDate: string;
}

export default function LatePaymentNotice() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [latePayments, setLatePayments] = useState<LatePayment[]>([]);
  const [requestingExtension, setRequestingExtension] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchLatePayments();
  }, []);

  const fetchLatePayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payment/late');
      setLatePayments(response.data?.latePayments ?? []);
    } catch (error) {
      console.error('Error fetching late payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = (payment: LatePayment) => {
    navigation.navigate('PaymentInstructions', {
      obligationId: payment.id,
      amountDue: payment.amount + payment.lateFeeAccrued,
      counterparty: payment.counterparty,
    });
  };

  const handleRequestExtension = async (paymentId: string) => {
    try {
      setRequestingExtension(paymentId);
      await api.post('/payment/request_extension', {paymentId});
      Alert.alert(
        'Extension Requested',
        'Your request for a payment extension has been sent to the lender.',
      );
    } catch (error) {
      console.error('Error requesting extension:', error);
      Alert.alert('Error', 'Failed to request extension. Please try again.');
    } finally {
      setRequestingExtension(null);
    }
  };

  const getSeverityColor = (daysOverdue: number) => {
    return daysOverdue > 7 ? GlobalStyles.Colors.primary300 : '#F5A623';
  };

  const getSeverityLabel = (daysOverdue: number) => {
    return daysOverdue > 7 ? 'Critical' : 'Warning';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Late Payments" showBackArrow />
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
      <ScreenTitle title="Late Payments" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {latePayments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="checkmark-circle-outline"
              size={64}
              color={GlobalStyles.Colors.primary400}
            />
            <Text style={styles.emptyTitle}>No Late Payments</Text>
            <Text style={styles.emptyText}>
              You're all caught up! Keep up the good work.
            </Text>
          </View>
        ) : (
          <>
            {/* Consequences Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Icon
                  name="warning-outline"
                  size={20}
                  color={GlobalStyles.Colors.primary300}
                />
                <Text style={styles.infoTitle}>
                  Consequences of Late Payment
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>
                  Late fees accrue daily on overdue amounts
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>
                  Your trust score and borrowing limits may be reduced
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>
                  Continued late payments may result in account restrictions
                </Text>
              </View>
            </View>

            {/* Late Payments List */}
            {latePayments.map(payment => (
              <View key={payment.id} style={styles.paymentCard}>
                {/* Severity Badge */}
                <View
                  style={[
                    styles.severityBadge,
                    {
                      backgroundColor: `${getSeverityColor(
                        payment.daysOverdue,
                      )}20`,
                    },
                  ]}>
                  <Icon
                    name={
                      payment.daysOverdue > 7
                        ? 'alert-circle'
                        : 'warning-outline'
                    }
                    size={16}
                    color={getSeverityColor(payment.daysOverdue)}
                  />
                  <Text
                    style={[
                      styles.severityText,
                      {color: getSeverityColor(payment.daysOverdue)},
                    ]}>
                    {getSeverityLabel(payment.daysOverdue)} —{' '}
                    {payment.daysOverdue} days overdue
                  </Text>
                </View>

                {/* Payment Details */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Counterparty</Text>
                    <Text style={styles.detailValue}>
                      {payment.counterparty}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount Due</Text>
                    <Text style={styles.detailValueBold}>
                      ${payment.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Late Fee Accrued</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {color: GlobalStyles.Colors.primary300},
                      ]}>
                      +${payment.lateFeeAccrued.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Owed</Text>
                    <Text style={styles.totalValue}>
                      ${(payment.amount + payment.lateFeeAccrued).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.extensionButton,
                      requestingExtension === payment.id && {opacity: 0.6},
                    ]}
                    onPress={() => handleRequestExtension(payment.id)}
                    disabled={requestingExtension === payment.id}>
                    {requestingExtension === payment.id ? (
                      <ActivityIndicator
                        size="small"
                        color={GlobalStyles.Colors.primary200}
                      />
                    ) : (
                      <Text style={styles.extensionButtonText}>
                        Request Extension
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.payNowButton}
                    onPress={() => handleMakePayment(payment)}>
                    <Text style={styles.payNowButtonText}>
                      Make Payment Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
        <View style={{height: 30}} />
      </ScrollView>
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
  infoCard: {
    backgroundColor: 'rgba(235,0,0,0.08)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(235,0,0,0.2)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    color: GlobalStyles.Colors.primary300,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoBullet: {
    color: GlobalStyles.Colors.primary300,
    marginRight: 8,
    fontSize: 14,
  },
  infoText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  paymentCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 14,
  },
  severityText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailsSection: {
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
  },
  detailValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
  },
  detailValueBold: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  totalValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  extensionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extensionButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
  },
  payNowButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payNowButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
