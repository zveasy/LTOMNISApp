import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

type LenderAcceptanceRouteParams = {
  LenderAcceptance: {offerId: string};
};

interface OfferDetails {
  borrowerName: string;
  borrowerAvatar?: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  totalRepayment: number;
  monthlyPayment: number;
  repaymentSchedule: {date: string; amount: number}[];
}

const LenderAcceptance: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<LenderAcceptanceRouteParams, 'LenderAcceptance'>>();
  const {offerId} = route.params;
  const token = useSelector((state: AppState) => state.token);
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/offers/details/${offerId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setOffer(response.data);
      } catch (error) {
        console.error('Error fetching offer details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferDetails();
  }, [offerId, token.token]);

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/contract/lender_accept',
        {offerId},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Offer accepted successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error accepting offer:', error);
      Alert.alert('Error', 'Failed to accept offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    Alert.alert(
      'Decline Offer',
      'Are you sure you want to decline this offer?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              await axios.post(
                'http://localhost:8080/api/omnis/contract/lender_decline',
                {offerId},
                {
                  headers: {
                    Authorization: `Bearer ${token.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                },
              );
              Alert.alert('Declined', 'Offer has been declined.', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error) {
              console.error('Error declining offer:', error);
              Alert.alert('Error', 'Failed to decline offer.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const renderRow = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Review & Accept" showBackArrow={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Review & Accept" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Borrower Information</Text>
          {renderRow('Borrower', offer?.borrowerName ?? '-')}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          {renderRow('Amount', `$${offer?.amount?.toFixed(2) ?? '0.00'}`)}
          {renderRow(
            'Interest Rate',
            `${offer?.interestRate?.toFixed(1) ?? '0'}%`,
          )}
          {renderRow('Term', `${offer?.termMonths ?? '-'} months`)}
          {renderRow(
            'Total Repayment',
            `$${offer?.totalRepayment?.toFixed(2) ?? '0.00'}`,
          )}
          {renderRow(
            'Monthly Payment',
            `$${offer?.monthlyPayment?.toFixed(2) ?? '0.00'}`,
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Repayment Schedule</Text>
          {offer?.repaymentSchedule?.map((item, index) => (
            <View key={index} style={styles.scheduleRow}>
              <Text style={styles.scheduleDate}>{item.date}</Text>
              <Text style={styles.scheduleAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
          {(!offer?.repaymentSchedule ||
            offer.repaymentSchedule.length === 0) && (
            <Text style={styles.noDataText}>No schedule available</Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
            disabled={submitting}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, submitting && styles.buttonDisabled]}
            onPress={handleAccept}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={GlobalStyles.Colors.primary100} />
            ) : (
              <Text style={styles.acceptButtonText}>Accept</Text>
            )}
          </TouchableOpacity>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  rowValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  scheduleDate: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  scheduleAmount: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  noDataText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary600,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  declineButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  acceptButtonText: {
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

export default LenderAcceptance;
