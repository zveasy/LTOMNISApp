import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

const PLATFORMS = [
  {id: 'zelle', name: 'Zelle', icon: 'flash-outline'},
  {id: 'venmo', name: 'Venmo', icon: 'logo-venmo'},
  {id: 'paypal', name: 'PayPal', icon: 'logo-paypal'},
  {id: 'cashapp', name: 'Cash App', icon: 'cash-outline'},
  {id: 'applepay', name: 'Apple Pay', icon: 'logo-apple'},
  {id: 'remitly', name: 'Remitly', icon: 'send-outline'},
  {id: 'wise', name: 'Wise', icon: 'swap-horizontal-outline'},
  {id: 'worldremit', name: 'WorldRemit', icon: 'globe-outline'},
  {id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline'},
];

const PAYMENT_METHODS = [
  {id: 'bank_transfer', label: 'Bank Transfer', icon: 'business-outline'},
  {id: 'cash', label: 'Cash', icon: 'cash-outline'},
  {id: 'external_app', label: 'External App', icon: 'phone-portrait-outline'},
  {id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline'},
];

export default function MarkAsPaid({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const loanId = route?.params?.loanId;
  const amountDue = route?.params?.amountDue ?? 171.23;
  const counterpartyName = route?.params?.counterpartyName ?? 'Zak Veasy';
  const preSelectedPlatform = route?.params?.platform ?? null;

  const [paymentAmount, setPaymentAmount] = useState(amountDue.toString());
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(
    preSelectedPlatform,
  );
  const [selectedMethod, setSelectedMethod] = useState(
    preSelectedPlatform ? 'external_app' : 'bank_transfer',
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setSelectedMethod('external_app');
  };

  const handleMarkAsPaid = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/payment/mark_paid', {
        loanId,
        amount: parseFloat(paymentAmount),
        method: selectedMethod,
        platform: selectedPlatform,
        paymentDate,
        referenceNumber,
      });
      Alert.alert('Success', 'Payment has been marked as paid.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error marking as paid:', error);
      Alert.alert('Error', 'Failed to mark payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Mark as Paid" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Obligation Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Obligation Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Paying To</Text>
            <Text style={styles.value}>{counterpartyName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Amount Due</Text>
            <Text style={styles.valueGold}>${amountDue.toFixed(2)}</Text>
          </View>
        </View>

        {/* Platform Used */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platform Used</Text>
          <View style={styles.platformGrid}>
            {PLATFORMS.map(platform => (
              <TouchableOpacity
                key={platform.id}
                style={[
                  styles.platformChip,
                  selectedPlatform === platform.id &&
                    styles.platformChipSelected,
                ]}
                onPress={() => handlePlatformSelect(platform.id)}>
                <Icon
                  name={platform.icon}
                  size={18}
                  color={
                    selectedPlatform === platform.id
                      ? GlobalStyles.Colors.primary200
                      : GlobalStyles.Colors.accent110
                  }
                />
                <Text
                  style={[
                    styles.platformChipText,
                    selectedPlatform === platform.id &&
                      styles.platformChipTextSelected,
                  ]}>
                  {platform.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Amount */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="decimal-pad"
              placeholderTextColor={GlobalStyles.Colors.accent110}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                selectedMethod === method.id && styles.methodItemSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}>
              <View style={styles.methodLeft}>
                <Icon
                  name={method.icon}
                  size={20}
                  color={
                    selectedMethod === method.id
                      ? GlobalStyles.Colors.primary200
                      : GlobalStyles.Colors.accent110
                  }
                />
                <Text
                  style={[
                    styles.methodLabel,
                    selectedMethod === method.id && styles.methodLabelSelected,
                  ]}>
                  {method.label}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected,
                ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Date */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Date</Text>
          <View style={styles.textInputWrapper}>
            <Icon
              name="calendar-outline"
              size={20}
              color={GlobalStyles.Colors.accent110}
            />
            <TextInput
              style={styles.textInput}
              value={paymentDate}
              onChangeText={setPaymentDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={GlobalStyles.Colors.accent110}
            />
          </View>
        </View>

        {/* Reference Number */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reference / Transaction Number</Text>
          <View style={styles.textInputWrapper}>
            <Icon
              name="document-text-outline"
              size={20}
              color={GlobalStyles.Colors.accent110}
            />
            <TextInput
              style={styles.textInput}
              value={referenceNumber}
              onChangeText={setReferenceNumber}
              placeholder="Enter reference number (optional)"
              placeholderTextColor={GlobalStyles.Colors.accent110}
            />
          </View>
        </View>

        {/* Upload Proof */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() =>
            navigation.navigate('UploadProof', {paymentId: loanId})
          }>
          <Icon
            name="cloud-upload-outline"
            size={20}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.uploadButtonText}>Upload Proof of Payment</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={GlobalStyles.Colors.accent110}
          />
        </TouchableOpacity>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Mark as Paid Button */}
      <TouchableOpacity
        style={[styles.primaryButton, submitting && {opacity: 0.6}]}
        onPress={handleMarkAsPaid}
        disabled={submitting}>
        <Text style={styles.primaryButtonText}>
          {submitting ? 'Submitting...' : 'Mark as Paid'}
        </Text>
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  cardTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
  },
  value: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '500',
  },
  valueGold: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  platformChipSelected: {
    borderColor: GlobalStyles.Colors.primary200,
    backgroundColor: 'rgba(189,174,141,0.15)',
  },
  platformChipText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginLeft: 6,
  },
  platformChipTextSelected: {
    color: GlobalStyles.Colors.primary200,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  currencySymbol: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 0,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  methodItemSelected: {
    backgroundColor: 'rgba(189,174,141,0.15)',
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 15,
    marginLeft: 12,
  },
  methodLabelSelected: {
    color: GlobalStyles.Colors.primary100,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.accent110,
    justifyContent: 'center',
    alignItems: 'center',
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
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  textInput: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    marginLeft: 10,
    padding: 0,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189,174,141,0.1)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(189,174,141,0.3)',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
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
