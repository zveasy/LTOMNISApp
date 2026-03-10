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
import Icon from 'react-native-vector-icons/Ionicons';

type ContractViewRouteParams = {
  ContractView: {contractId: string};
};

interface ContractData {
  id: string;
  borrowerName: string;
  lenderName: string;
  principal: number;
  interestRate: number;
  totalRepayment: number;
  monthlyAmount: number;
  numberOfMonths: number;
  dueDates: string[];
  lateFeePercentage: number;
  governingTerms: string;
  needsSigning: boolean;
}

const ContractView: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ContractViewRouteParams, 'ContractView'>>();
  const {contractId} = route.params;
  const token = useSelector((state: AppState) => state.token);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/contract/${contractId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setContract(response.data);
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId, token.token]);

  const handleDownloadPDF = async () => {
    try {
      await axios.get(
        `http://localhost:8080/api/omnis/contract/${contractId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      Alert.alert('Success', 'PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF');
    }
  };

  const handleSignContract = () => {
    (navigation as any).navigate('DigitalSignature', {contractId});
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
        <ScreenTitle title="Loan Contract" showBackArrow={true} />
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
      <ScreenTitle title="Loan Contract" showBackArrow={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contract Details</Text>
          {renderRow('Loan ID', contract?.id ?? '-')}
          {renderRow('Borrower', contract?.borrowerName ?? '-')}
          {renderRow('Lender', contract?.lenderName ?? '-')}
          {renderRow(
            'Principal',
            `$${contract?.principal?.toFixed(2) ?? '0.00'}`,
          )}
          {renderRow(
            'Interest Rate',
            `${contract?.interestRate?.toFixed(1) ?? '0'}%`,
          )}
          {renderRow(
            'Total Repayment',
            `$${contract?.totalRepayment?.toFixed(2) ?? '0.00'}`,
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Repayment Terms</Text>
          {renderRow(
            'Monthly Amount',
            `$${contract?.monthlyAmount?.toFixed(2) ?? '0.00'}`,
          )}
          {renderRow(
            'Number of Months',
            String(contract?.numberOfMonths ?? '-'),
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Due Dates</Text>
          {contract?.dueDates?.map((date, index) => (
            <Text key={index} style={styles.dueDateText}>
              Payment {index + 1}: {date}
            </Text>
          ))}
          {(!contract?.dueDates || contract.dueDates.length === 0) && (
            <Text style={styles.dueDateText}>No due dates available</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Late Fee Terms</Text>
          {renderRow(
            'Late Fee',
            `${contract?.lateFeePercentage ?? 0}% of payment`,
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Governing Terms</Text>
          <Text style={styles.termsText}>
            {contract?.governingTerms ?? 'No governing terms specified.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.pdfButton} onPress={handleDownloadPDF}>
          <Icon
            name="download-outline"
            size={20}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.pdfButtonText}>Download PDF</Text>
        </TouchableOpacity>

        {contract?.needsSigning && (
          <TouchableOpacity
            style={styles.signButton}
            onPress={handleSignContract}>
            <Text style={styles.signButtonText}>Sign Contract</Text>
          </TouchableOpacity>
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
  dueDateText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    paddingVertical: 4,
  },
  termsText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    lineHeight: 20,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    height: 56,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
  },
  pdfButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  bottomSpacer: {
    height: 40,
  },
});

export default ContractView;
