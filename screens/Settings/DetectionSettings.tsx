import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import {
  checkNotificationAccess,
  requestNotificationAccess,
  PAYMENT_PATTERNS,
} from '../../services/PaymentDetection';

const SETTINGS_KEY = '@omnis_detection_settings';

interface DetectionPreferences {
  enabled: boolean;
  notificationAccess: boolean;
  smsScanning: boolean;
  autoMatchLoans: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  monitoredPlatforms: Record<string, boolean>;
}

const DEFAULT_PREFS: DetectionPreferences = {
  enabled: true,
  notificationAccess: false,
  smsScanning: false,
  autoMatchLoans: true,
  sensitivity: 'medium',
  monitoredPlatforms: Object.fromEntries(PAYMENT_PATTERNS.map(p => [p.platform, true])),
};

export default function DetectionSettings() {
  const [prefs, setPrefs] = useState<DetectionPreferences>(DEFAULT_PREFS);
  const [hasNotifAccess, setHasNotifAccess] = useState(false);
  const [recentDetections, setRecentDetections] = useState<{platform: string; amount: number | null; detectedAt: string}[]>([]);

  useEffect(() => {
    loadPreferences();
    checkNotificationAccess().then(setHasNotifAccess);
    loadRecentDetections();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setPrefs({...DEFAULT_PREFS, ...JSON.parse(stored)});
      }
    } catch {}
  };

  const savePreferences = async (updated: DetectionPreferences) => {
    setPrefs(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {}
  };

  const loadRecentDetections = async () => {
    try {
      const stored = await AsyncStorage.getItem('@omnis_recent_detections');
      if (stored) {
        setRecentDetections(JSON.parse(stored).slice(0, 10));
      }
    } catch {}
  };

  const handleToggle = (key: keyof DetectionPreferences) => {
    const updated = {...prefs, [key]: !prefs[key as keyof DetectionPreferences]};
    savePreferences(updated as DetectionPreferences);
  };

  const handlePlatformToggle = (platform: string) => {
    const updated = {
      ...prefs,
      monitoredPlatforms: {
        ...prefs.monitoredPlatforms,
        [platform]: !prefs.monitoredPlatforms[platform],
      },
    };
    savePreferences(updated);
  };

  const handleSensitivity = (level: 'low' | 'medium' | 'high') => {
    savePreferences({...prefs, sensitivity: level});
  };

  const handleRequestNotifAccess = async () => {
    const granted = await requestNotificationAccess();
    setHasNotifAccess(granted);
    if (granted) {
      savePreferences({...prefs, notificationAccess: true});
    }
  };

  const platformLabel = (p: string) => {
    const labels: Record<string, string> = {
      venmo: 'Venmo',
      zelle: 'Zelle',
      cashapp: 'Cash App',
      paypal: 'PayPal',
      applepay: 'Apple Pay',
      remitly: 'Remitly',
      wise: 'Wise',
      worldremit: 'WorldRemit',
    };
    return labels[p] || p;
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle showBackArrow={true} title="Payment Detection" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Enable Auto-Detection</Text>
          <Switch
            value={prefs.enabled}
            onValueChange={() => handleToggle('enabled')}
            trackColor={{false: '#555', true: GlobalStyles.Colors.primary200}}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionTitle}>Notification Access</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Status: {hasNotifAccess ? 'Granted' : 'Not Granted'}
          </Text>
          {!hasNotifAccess && (
            <Pressable style={styles.smallButton} onPress={handleRequestNotifAccess}>
              <Text style={styles.smallButtonText}>Grant Access</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.sectionTitle}>Monitored Apps</Text>
        {PAYMENT_PATTERNS.map(p => (
          <View key={p.platform} style={styles.row}>
            <Text style={styles.rowLabel}>{platformLabel(p.platform)}</Text>
            <Switch
              value={prefs.monitoredPlatforms[p.platform] !== false}
              onValueChange={() => handlePlatformToggle(p.platform)}
              trackColor={{false: '#555', true: GlobalStyles.Colors.primary200}}
              thumbColor="#fff"
            />
          </View>
        ))}

        {Platform.OS === 'android' && (
          <>
            <Text style={styles.sectionTitle}>SMS Scanning</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Scan payment SMS</Text>
              <Switch
                value={prefs.smsScanning}
                onValueChange={() => handleToggle('smsScanning')}
                trackColor={{false: '#555', true: GlobalStyles.Colors.primary200}}
                thumbColor="#fff"
              />
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Auto-match to Loans</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Suggest matching loans automatically
          </Text>
          <Switch
            value={prefs.autoMatchLoans}
            onValueChange={() => handleToggle('autoMatchLoans')}
            trackColor={{false: '#555', true: GlobalStyles.Colors.primary200}}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionTitle}>Detection Sensitivity</Text>
        <View style={styles.sensitivityRow}>
          {(['low', 'medium', 'high'] as const).map(level => (
            <Pressable
              key={level}
              style={[
                styles.sensitivityBtn,
                prefs.sensitivity === level && styles.sensitivityActive,
              ]}
              onPress={() => handleSensitivity(level)}>
              <Text
                style={[
                  styles.sensitivityText,
                  prefs.sensitivity === level && styles.sensitivityTextActive,
                ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {recentDetections.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Detections</Text>
            {recentDetections.map((d, i) => (
              <View key={i} style={styles.recentItem}>
                <Text style={styles.recentPlatform}>{platformLabel(d.platform)}</Text>
                <Text style={styles.recentAmount}>
                  {d.amount ? `$${d.amount}` : 'N/A'}
                </Text>
                <Text style={styles.recentDate}>
                  {new Date(d.detectedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary200,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  smallButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: '#1E1E1E',
    fontSize: 13,
    fontWeight: '700',
  },
  sensitivityRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  sensitivityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  sensitivityActive: {
    borderColor: GlobalStyles.Colors.primary200,
    backgroundColor: 'rgba(189,174,141,0.15)',
  },
  sensitivityText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  sensitivityTextActive: {
    color: GlobalStyles.Colors.primary200,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  recentPlatform: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  recentAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  recentDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
});
