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
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

type ReportData = {
  personalInfo: {
    name: string;
    email: string;
    memberSince: string;
  };
  score: number;
  tier: number;
  paymentHistory: {
    date: string;
    amount: number;
    status: string;
    platform: string;
  }[];
  loanHistory: {
    date: string;
    amount: number;
    status: string;
    lender: string;
  }[];
  stats: {
    totalPayments: number;
    totalBorrowed: number;
    totalRepaid: number;
    onTimeRate: number;
    defaultRate: number;
  };
};

export default function CreditReport() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/credit/report');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching credit report:', error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleShare = () => {
    Alert.alert(
      'Share Report',
      'Report sharing will be available in a future update.',
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Credit Report" showBackArrow />
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
      <ScreenTitle title="Credit Report" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {report?.personalInfo?.name ?? 'N/A'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {report?.personalInfo?.email ?? 'N/A'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {report?.personalInfo?.memberSince ?? 'N/A'}
            </Text>
          </View>
        </View>

        {/* Score & Tier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score & Tier</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                {report?.score ?? 0}
              </Text>
            </View>
            <View style={styles.tierInfo}>
              <Text style={styles.tierLabel}>Trust Tier</Text>
              <Text style={styles.tierValue}>Tier {report?.tier ?? 1}</Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {(report?.paymentHistory ?? []).length === 0 ? (
            <Text style={styles.emptyRowText}>No payment history</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Date</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Amount</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>
                  Platform
                </Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Status</Text>
              </View>
              {report!.paymentHistory.slice(0, 10).map((p, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, {flex: 2}]}>{p.date}</Text>
                  <Text style={[styles.tableCell, {flex: 2}]}>
                    ${p.amount.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCellCapitalize, {flex: 2}]}>
                    {p.platform}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        flex: 2,
                        color:
                          p.status === 'confirmed'
                            ? GlobalStyles.Colors.primary400
                            : GlobalStyles.Colors.accent110,
                      },
                    ]}>
                    {p.status}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Loan History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan History</Text>
          {(report?.loanHistory ?? []).length === 0 ? (
            <Text style={styles.emptyRowText}>No loan history</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Date</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Amount</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Lender</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>Status</Text>
              </View>
              {report!.loanHistory.slice(0, 10).map((l, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, {flex: 2}]}>{l.date}</Text>
                  <Text style={[styles.tableCell, {flex: 2}]}>
                    ${l.amount.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, {flex: 2}]}>{l.lender}</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        flex: 2,
                        color:
                          l.status === 'completed'
                            ? GlobalStyles.Colors.primary400
                            : GlobalStyles.Colors.accent110,
                      },
                    ]}>
                    {l.status}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Summary Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary Statistics</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Payments</Text>
            <Text style={styles.infoValue}>
              {report?.stats?.totalPayments ?? 0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Borrowed</Text>
            <Text style={styles.infoValue}>
              ${(report?.stats?.totalBorrowed ?? 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Repaid</Text>
            <Text style={styles.infoValue}>
              ${(report?.stats?.totalRepaid ?? 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>On-Time Rate</Text>
            <Text style={styles.infoValue}>
              {(report?.stats?.onTimeRate ?? 0).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Default Rate</Text>
            <Text style={styles.infoValue}>
              {(report?.stats?.defaultRate ?? 0).toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon
            name="share-outline"
            size={20}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.shareButtonText}>Share Report</Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
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
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
  },
  infoValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(189,174,141,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBadgeText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 24,
    fontWeight: 'bold',
  },
  tierInfo: {
    marginLeft: 16,
  },
  tierLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
  },
  tierValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tableHeaderCell: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 11,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  tableCell: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 12,
  },
  tableCellCapitalize: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  emptyRowText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  shareButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
