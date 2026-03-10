import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

type Severity = 'info' | 'warning' | 'critical';

interface RiskFlag {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  createdAt?: string;
}

interface RiskFlagData {
  flags: RiskFlag[];
  isBanned: boolean;
  isSuspended: boolean;
  banReason?: string;
  suspensionReason?: string;
}

const DEFAULT_DATA: RiskFlagData = {
  flags: [],
  isBanned: false,
  isSuspended: false,
};

export default function RiskFlagScreen() {
  const [data, setData] = useState<RiskFlagData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = useSelector((state: AppState) => state.token);

  const fetchFlags = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/identity/risk_flags',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
          },
        },
      );
      setData({
        flags: response.data.flags || [],
        isBanned: response.data.isBanned || false,
        isSuspended: response.data.isSuspended || false,
        banReason: response.data.banReason,
        suspensionReason: response.data.suspensionReason,
      });
    } catch (error) {
      console.error('Error fetching risk flags:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFlags();
    setRefreshing(false);
  }, [fetchFlags]);

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return '#F44336';
      case 'warning':
        return '#FFC107';
      case 'info':
        return '#2196F3';
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  const handleAppeal = () => {
    Alert.alert(
      'Appeal Submitted',
      'Your appeal has been submitted. Our team will review it and get back to you within 5 business days.',
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Account Status" showBackArrow={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  const noFlags =
    data.flags.length === 0 && !data.isBanned && !data.isSuspended;

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Account Status" showBackArrow={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {(data.isBanned || data.isSuspended) && (
          <View style={styles.alertBanner}>
            <Ionicons name="ban" size={32} color="#F44336" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>
                {data.isBanned ? 'Account Banned' : 'Account Suspended'}
              </Text>
              <Text style={styles.alertReason}>
                {data.isBanned
                  ? data.banReason ||
                    'Your account has been permanently banned.'
                  : data.suspensionReason ||
                    'Your account has been temporarily suspended.'}
              </Text>
            </View>
          </View>
        )}

        {(data.isBanned || data.isSuspended) && (
          <TouchableOpacity style={styles.appealButton} onPress={handleAppeal}>
            <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
            <Text style={styles.appealButtonText}>Submit Appeal</Text>
          </TouchableOpacity>
        )}

        {noFlags && (
          <View style={styles.goodStandingContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.goodStandingTitle}>
              Your account is in good standing
            </Text>
            <Text style={styles.goodStandingSubtitle}>
              No risk flags or issues found on your account.
            </Text>
          </View>
        )}

        {data.flags.length > 0 && (
          <View style={styles.flagsSection}>
            <Text style={styles.sectionTitle}>Flags</Text>
            {data.flags.map(flag => (
              <View style={styles.flagCard} key={flag.id}>
                <View style={styles.flagHeader}>
                  <Ionicons
                    name={getSeverityIcon(flag.severity)}
                    size={22}
                    color={getSeverityColor(flag.severity)}
                  />
                  <Text style={styles.flagTitle}>{flag.title}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      {backgroundColor: getSeverityColor(flag.severity)},
                    ]}>
                    <Text style={styles.severityText}>
                      {flag.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.flagDescription}>{flag.description}</Text>
                {flag.createdAt && (
                  <Text style={styles.flagTimestamp}>{flag.createdAt}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    color: '#F44336',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertReason: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    lineHeight: 20,
  },
  appealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    marginBottom: 24,
  },
  appealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  goodStandingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  goodStandingTitle: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  goodStandingSubtitle: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  flagsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  flagCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagTitle: {
    flex: 1,
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  flagDescription: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  flagTimestamp: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
  },
});
