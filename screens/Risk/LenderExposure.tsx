import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

interface BorrowerExposure {
  id: string;
  borrowerName: string;
  amountLent: number;
  percentage: number;
}

interface ExposureData {
  totalAmountLent: number;
  maxSingleBorrowerLimit: number;
  exposurePerBorrower: BorrowerExposure[];
  concentrationWarnings: string[];
  suggestedDiversification: string;
}

export default function LenderExposure() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExposureData>({
    totalAmountLent: 8500,
    maxSingleBorrowerLimit: 5000,
    exposurePerBorrower: [
      {
        id: '1',
        borrowerName: 'Alex Johnson',
        amountLent: 4500,
        percentage: 53,
      },
      {
        id: '2',
        borrowerName: 'Maria Garcia',
        amountLent: 2000,
        percentage: 24,
      },
      {
        id: '3',
        borrowerName: 'James Wilson',
        amountLent: 1200,
        percentage: 14,
      },
      {id: '4', borrowerName: 'Sarah Lee', amountLent: 800, percentage: 9},
    ],
    concentrationWarnings: [
      'Over 50% of your lending is concentrated in one borrower (Alex Johnson)',
    ],
    suggestedDiversification:
      'Consider spreading your lending across more borrowers. Aim for no single borrower to exceed 30% of your total exposure.',
  });

  useEffect(() => {
    fetchExposure();
  }, []);

  const fetchExposure = async () => {
    try {
      setLoading(true);
      const response = await api.get('/risk/lender_exposure');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching lender exposure:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConcentrationColor = (percentage: number) => {
    if (percentage > 50) {
      return GlobalStyles.Colors.primary300;
    }
    if (percentage > 30) {
      return '#F5A623';
    }
    return GlobalStyles.Colors.primary400;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Lending Exposure" showBackArrow />
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
      <ScreenTitle title="Lending Exposure" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Total Exposure */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Amount Lent</Text>
          <Text style={styles.heroAmount}>
            ${data.totalAmountLent.toLocaleString()}
          </Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroRow}>
            <Text style={styles.heroSubLabel}>Max Single-Borrower Limit</Text>
            <Text style={styles.heroSubValue}>
              ${data.maxSingleBorrowerLimit.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Concentration Warnings */}
        {data.concentrationWarnings.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Icon name="warning-outline" size={20} color="#F5A623" />
              <Text style={styles.warningTitle}>Concentration Warning</Text>
            </View>
            {data.concentrationWarnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        )}

        {/* Exposure Per Borrower */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exposure Per Borrower</Text>
          {data.exposurePerBorrower.map(borrower => (
            <View key={borrower.id} style={styles.borrowerItem}>
              <View style={styles.borrowerHeader}>
                <View style={styles.borrowerLeft}>
                  <View style={styles.borrowerAvatar}>
                    <Text style={styles.borrowerAvatarText}>
                      {borrower.borrowerName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.borrowerName}>
                      {borrower.borrowerName}
                    </Text>
                    <Text style={styles.borrowerAmount}>
                      ${borrower.amountLent.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.borrowerPercent,
                    {color: getConcentrationColor(borrower.percentage)},
                  ]}>
                  {borrower.percentage}%
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${borrower.percentage}%`,
                      backgroundColor: getConcentrationColor(
                        borrower.percentage,
                      ),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Diversification Suggestion */}
        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Icon
              name="bulb-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.suggestionTitle}>
              Suggested Diversification
            </Text>
          </View>
          <Text style={styles.suggestionText}>
            {data.suggestedDiversification}
          </Text>
        </View>

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
  heroCard: {
    backgroundColor: 'rgba(189,174,141,0.15)',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  heroLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    marginBottom: 8,
  },
  heroAmount: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 36,
    fontWeight: 'bold',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    marginVertical: 16,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heroSubLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
  },
  heroSubValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 15,
    fontWeight: 'bold',
  },
  warningCard: {
    backgroundColor: 'rgba(245,166,35,0.1)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warningTitle: {
    color: '#F5A623',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  warningText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    lineHeight: 18,
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
    marginBottom: 16,
  },
  borrowerItem: {
    marginBottom: 18,
  },
  borrowerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  borrowerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borrowerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(189,174,141,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  borrowerAvatarText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: 'bold',
  },
  borrowerName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '500',
  },
  borrowerAmount: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    marginTop: 2,
  },
  borrowerPercent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  suggestionCard: {
    backgroundColor: 'rgba(189,174,141,0.1)',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  suggestionText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    lineHeight: 20,
  },
});
