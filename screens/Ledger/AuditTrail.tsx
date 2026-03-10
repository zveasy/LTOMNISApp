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
import {useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

type AuditTrailRouteParams = {
  AuditTrail: {loanId: string};
};

interface AuditEntry {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  details: string;
  hashReference: string;
}

const AuditTrail: React.FC = () => {
  const route = useRoute<RouteProp<AuditTrailRouteParams, 'AuditTrail'>>();
  const {loanId} = route.params;
  const token = useSelector((state: AppState) => state.token);

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/ledger/audit?loanId=${loanId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching audit trail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditTrail();
  }, [loanId, token.token]);

  const handleExport = () => {
    Alert.alert('Export', 'Export functionality coming soon.');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventIcon = (eventType: string): string => {
    switch (eventType.toLowerCase()) {
      case 'created':
      case 'loan_created':
        return 'add-circle-outline';
      case 'funded':
      case 'loan_funded':
        return 'wallet-outline';
      case 'payment':
      case 'repayment':
        return 'cash-outline';
      case 'signed':
      case 'signature':
        return 'create-outline';
      case 'amended':
      case 'amendment':
        return 'document-text-outline';
      case 'disputed':
      case 'dispute':
        return 'alert-circle-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'defaulted':
        return 'close-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Audit Trail" showBackArrow={true} />
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
      <ScreenTitle
        title="Audit Trail"
        showBackArrow={true}
        showRightIcon={true}
        rightIconType="Ionicons"
        rightIconName="share-outline"
        onRightIconPress={handleExport}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.loanIdCard}>
          <Text style={styles.loanIdLabel}>Loan ID</Text>
          <Text style={styles.loanIdValue}>{loanId}</Text>
        </View>

        {entries.length === 0 ? (
          <Text style={styles.noDataText}>No audit entries found.</Text>
        ) : (
          <View style={styles.timeline}>
            {entries.map((entry, index) => (
              <View key={entry.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineIconWrapper}>
                    <Icon
                      name={getEventIcon(entry.eventType)}
                      size={18}
                      color={GlobalStyles.Colors.primary200}
                    />
                  </View>
                  {index < entries.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.eventType}>{entry.eventType}</Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(entry.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.actor}>By: {entry.actor}</Text>
                  <Text style={styles.details}>{entry.details}</Text>
                  <View style={styles.hashRow}>
                    <Icon
                      name="link-outline"
                      size={12}
                      color={GlobalStyles.Colors.accent110}
                    />
                    <Text style={styles.hashText} numberOfLines={1}>
                      {entry.hashReference}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Icon
            name="download-outline"
            size={20}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.exportButtonText}>Export Audit Trail</Text>
        </TouchableOpacity>

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
  loanIdCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  loanIdLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 12,
    marginBottom: 4,
  },
  loanIdValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 40,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    width: 36,
    alignItems: 'center',
  },
  timelineIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(189,174,141,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(189,174,141,0.3)',
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 14,
    marginLeft: 12,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventType: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timestamp: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
  },
  actor: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    marginBottom: 4,
  },
  details: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
    marginLeft: 4,
    flex: 1,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    height: 56,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
  },
  exportButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AuditTrail;
