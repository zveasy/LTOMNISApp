import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

interface PendingPayment {
  id: string;
  borrowerName: string;
  amount: number;
  dateMarkedPaid: string;
  proofImageUrl: string | null;
  referenceNumber?: string;
}

export default function LenderConfirmReceipt() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingConfirmations();
  }, []);

  const fetchPendingConfirmations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payment/pending_confirmations');
      setPayments(response.data?.payments ?? []);
    } catch (error) {
      console.error('Error fetching pending confirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (paymentId: string) => {
    try {
      setConfirmingId(paymentId);
      await api.post('/payment/confirm_receipt', {paymentId});
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      Alert.alert('Confirmed', 'Payment has been confirmed as received.');
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Failed to confirm payment. Please try again.');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDispute = (paymentId: string) => {
    navigation.navigate('PaymentDispute', {disputeId: paymentId});
  };

  const handleViewProof = (_proofImageUrl: string) => {
    Alert.alert('Payment Proof', 'Viewing proof image', [
      {text: 'Close', style: 'cancel'},
    ]);
  };

  const renderPaymentItem = ({item}: {item: PendingPayment}) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {item.borrowerName
              .split(' ')
              .map(n => n[0])
              .join('')}
          </Text>
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.borrowerName}>{item.borrowerName}</Text>
          <Text style={styles.paymentDate}>
            Marked paid: {item.dateMarkedPaid}
          </Text>
        </View>
        <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
      </View>

      {item.referenceNumber && (
        <View style={styles.referenceRow}>
          <Text style={styles.referenceLabel}>Ref:</Text>
          <Text style={styles.referenceValue}>{item.referenceNumber}</Text>
        </View>
      )}

      {/* Proof Thumbnail */}
      {item.proofImageUrl && (
        <TouchableOpacity
          style={styles.proofRow}
          onPress={() => handleViewProof(item.proofImageUrl!)}>
          <Image
            source={{uri: item.proofImageUrl}}
            style={styles.proofThumbnail}
          />
          <View style={styles.viewProofLabel}>
            <Icon
              name="eye-outline"
              size={16}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.viewProofText}>View Proof</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.disputeButton}
          onPress={() => handleDispute(item.id)}>
          <Text style={styles.disputeButtonText}>Dispute</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            confirmingId === item.id && {opacity: 0.6},
          ]}
          onPress={() => handleConfirm(item.id)}
          disabled={confirmingId === item.id}>
          {confirmingId === item.id ? (
            <ActivityIndicator
              size="small"
              color={GlobalStyles.Colors.primary100}
            />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Received</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Confirm Payment" showBackArrow />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={GlobalStyles.Colors.primary200}
          style={{marginTop: 40}}
        />
      ) : payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="checkmark-circle-outline"
            size={64}
            color={GlobalStyles.Colors.accent110}
          />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptyText}>
            No pending payments to confirm right now.
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  paymentCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(189,174,141,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  borrowerName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  paymentDate: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 2,
  },
  paymentAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 20,
    fontWeight: 'bold',
  },
  referenceRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  referenceLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginRight: 6,
  },
  referenceValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  proofThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  viewProofLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  viewProofText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  disputeButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disputeButtonText: {
    color: GlobalStyles.Colors.primary300,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: GlobalStyles.Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
