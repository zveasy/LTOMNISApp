import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import {DetectedPayment} from '../../services/PaymentDetection';
import {usePaymentDetection} from '../../services/PaymentDetectionProvider';
import {AppState} from '../../ReduxStore';
import {HomeStackParamList} from '../../App';

const PLATFORM_LABELS: Record<string, string> = {
  venmo: 'Venmo',
  zelle: 'Zelle',
  cashapp: 'Cash App',
  paypal: 'PayPal',
  applepay: 'Apple Pay',
  remitly: 'Remitly',
  wise: 'Wise',
  worldremit: 'WorldRemit',
};

const AUTO_DISMISS_MS = 30000;

export default function QuickRecordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {detectedPayment, dismissDetection} = usePaymentDetection();
  const token = useSelector((state: AppState) => state.token);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [loans, setLoans] = useState<{id: string; amount: number; counterparty: string}[]>([]);
  const [showLoanPicker, setShowLoanPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissDetection();
      if (navigation.canGoBack()) navigation.goBack();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [dismissDetection, navigation]);

  useEffect(() => {
    if (token.token && detectedPayment) {
      axios
        .get('http://localhost:8080/api/omnis/loan/active', {
          headers: {Authorization: `Bearer ${token.token}`},
        })
        .then(res => {
          if (res.data?.loans) {
            setLoans(res.data.loans);
          }
        })
        .catch(() => {});
    }
  }, [token.token, detectedPayment]);

  if (!detectedPayment) return null;

  const payment: DetectedPayment = detectedPayment;
  const platformLabel = PLATFORM_LABELS[payment.platform] || payment.platform;
  const lowConfidence = payment.confidence < 0.8;

  const matchingLoans = loans.filter(loan => {
    if (!payment.amount) return false;
    const diff = Math.abs(loan.amount - payment.amount);
    return diff / loan.amount < 0.1;
  });

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/payment/quick-record',
        {
          platform: payment.platform,
          amount: payment.amount,
          currency: payment.currency,
          direction: payment.direction,
          counterparty: payment.counterparty,
          referenceId: payment.referenceId,
          rawText: payment.rawText,
          detectedAt: payment.detectedAt,
          confidence: payment.confidence,
          matchedLoanId: selectedLoanId,
        },
        {headers: {Authorization: `Bearer ${token.token}`}},
      );
      dismissDetection();
      if (navigation.canGoBack()) navigation.goBack();
    } catch {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    dismissDetection();
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleEditDetails = () => {
    dismissDetection();
    navigation.navigate('MarkAsPaid', {
      loanId: selectedLoanId || '',
      amountDue: payment.amount || 0,
      counterpartyName: payment.counterparty || '',
      platform: payment.platform,
    });
  };

  return (
    <SafeAreaView style={styles.background}>
      <Animated.View style={[styles.sheet, {opacity: fadeAnim}]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Payment detected!</Text>

          <View style={styles.platformRow}>
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>{platformLabel[0]}</Text>
            </View>
            <Text style={styles.platformName}>{platformLabel}</Text>
          </View>

          {payment.amount !== null && (
            <Text style={styles.amount}>
              ${payment.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </Text>
          )}

          <Text style={styles.direction}>
            {payment.direction === 'sent' ? 'You sent' : 'You received'}
          </Text>

          {payment.counterparty && (
            <Text style={styles.counterparty}>
              {payment.direction === 'sent' ? 'To' : 'From'}: {payment.counterparty}
            </Text>
          )}

          {lowConfidence && (
            <View style={styles.warningRow}>
              <Text style={styles.warningText}>Please verify details</Text>
            </View>
          )}

          {matchingLoans.length > 0 && (
            <View style={styles.loanSection}>
              <Text style={styles.loanSectionTitle}>Match to loan</Text>
              <Pressable
                style={styles.loanPicker}
                onPress={() => setShowLoanPicker(!showLoanPicker)}>
                <Text style={styles.loanPickerText}>
                  {selectedLoanId
                    ? loans.find(l => l.id === selectedLoanId)?.counterparty || 'Selected'
                    : 'Select a loan...'}
                </Text>
              </Pressable>
              {showLoanPicker &&
                matchingLoans.map(loan => (
                  <Pressable
                    key={loan.id}
                    style={styles.loanOption}
                    onPress={() => {
                      setSelectedLoanId(loan.id);
                      setShowLoanPicker(false);
                    }}>
                    <Text style={styles.loanOptionText}>
                      {loan.counterparty} — ${loan.amount}
                    </Text>
                  </Pressable>
                ))}
            </View>
          )}

          <Pressable
            style={[styles.confirmButton, submitting && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={submitting}>
            <Text style={styles.confirmButtonText}>
              {submitting ? 'Recording...' : 'Confirm & Record'}
            </Text>
          </Pressable>

          <Pressable style={styles.dismissButton} onPress={handleDismiss}>
            <Text style={styles.dismissButtonText}>Not a loan payment</Text>
          </Pressable>

          <Pressable onPress={handleEditDetails}>
            <Text style={styles.editLink}>Edit Details</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  platformBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  platformName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  amount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary200,
    marginVertical: 8,
  },
  direction: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  counterparty: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  warningRow: {
    backgroundColor: 'rgba(235,0,0,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    color: GlobalStyles.Colors.primary300,
    fontSize: 14,
    fontWeight: '600',
  },
  loanSection: {
    width: '100%',
    marginBottom: 16,
  },
  loanSectionTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  loanPicker: {
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
    borderRadius: 8,
    padding: 12,
  },
  loanPickerText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  loanOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  loanOptionText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  dismissButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  dismissButtonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  editLink: {
    fontSize: 15,
    color: GlobalStyles.Colors.primary200,
    textDecorationLine: 'underline',
  },
});
