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

interface VerificationItem {
  label: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp?: string;
}

interface StatusData {
  idVerification: VerificationItem;
  selfieVerification: VerificationItem;
  addressVerification: VerificationItem;
  overallStatus: 'pending' | 'verified' | 'rejected';
}

const DEFAULT_STATUS: StatusData = {
  idVerification: {label: 'ID Verification', status: 'pending'},
  selfieVerification: {label: 'Selfie Verification', status: 'pending'},
  addressVerification: {label: 'Address Verification', status: 'pending'},
  overallStatus: 'pending',
};

export default function IdentityStatus() {
  const [statusData, setStatusData] = useState<StatusData>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = useSelector((state: AppState) => state.token);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/identity/status',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
          },
        },
      );
      const data = response.data;
      setStatusData({
        idVerification: {
          label: 'ID Verification',
          status: data.idVerification?.status || 'pending',
          timestamp: data.idVerification?.timestamp,
        },
        selfieVerification: {
          label: 'Selfie Verification',
          status: data.selfieVerification?.status || 'pending',
          timestamp: data.selfieVerification?.timestamp,
        },
        addressVerification: {
          label: 'Address Verification',
          status: data.addressVerification?.status || 'pending',
          timestamp: data.addressVerification?.timestamp,
        },
        overallStatus: data.overallStatus || 'pending',
      });
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  }, [fetchStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return GlobalStyles.Colors.accent100;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const allVerified =
    statusData.idVerification.status === 'verified' &&
    statusData.selfieVerification.status === 'verified' &&
    statusData.addressVerification.status === 'verified';

  const hasRejected =
    statusData.idVerification.status === 'rejected' ||
    statusData.selfieVerification.status === 'rejected' ||
    statusData.addressVerification.status === 'rejected';

  const renderCard = (item: VerificationItem) => (
    <View style={styles.card} key={item.label}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={getStatusIcon(item.status)}
          size={24}
          color={getStatusColor(item.status)}
        />
        <Text style={styles.cardTitle}>{item.label}</Text>
      </View>
      <View style={styles.cardBody}>
        <View
          style={[
            styles.statusPill,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusPillText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
        {item.timestamp && (
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Verification Status" showBackArrow={true} />
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
      <ScreenTitle title="Verification Status" showBackArrow={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {allVerified && (
          <View style={styles.fullyVerifiedBanner}>
            <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
            <Text style={styles.fullyVerifiedText}>Fully Verified</Text>
          </View>
        )}

        <View style={styles.overallCard}>
          <Text style={styles.overallLabel}>Overall Status</Text>
          <View
            style={[
              styles.overallPill,
              {backgroundColor: getStatusColor(statusData.overallStatus)},
            ]}>
            <Ionicons
              name={getStatusIcon(statusData.overallStatus)}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.overallPillText}>
              {getStatusLabel(statusData.overallStatus)}
            </Text>
          </View>
        </View>

        {renderCard(statusData.idVerification)}
        {renderCard(statusData.selfieVerification)}
        {renderCard(statusData.addressVerification)}

        {hasRejected && (
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() =>
              Alert.alert(
                'Contact Support',
                'Please email support@ltomnis.com or call 1-800-OMNIS for assistance.',
              )
            }>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  fullyVerifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  fullyVerifiedText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  overallCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  overallLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  overallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  overallPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  card: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  timestampText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    height: 56,
    borderRadius: 16,
    marginTop: 20,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
