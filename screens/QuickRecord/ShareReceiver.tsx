import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import axios from 'axios';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import {parsePaymentFromText, DetectedPayment} from '../../services/PaymentDetection';
import {AppState} from '../../ReduxStore';
import {HomeStackParamList} from '../../App';

type ShareReceiverParams = {
  ShareReceiver: {
    sharedText?: string;
    sharedImageUri?: string;
  };
};

export default function ShareReceiver() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<ShareReceiverParams, 'ShareReceiver'>>();
  const token = useSelector((state: AppState) => state.token);

  const sharedText = route.params?.sharedText || '';
  const sharedImageUri = route.params?.sharedImageUri || '';

  const [detected, setDetected] = useState<DetectedPayment | null>(null);
  const [platform, setPlatform] = useState('');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'sent' | 'received'>('sent');
  const [counterparty, setCounterparty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sharedText) {
      const result = parsePaymentFromText(sharedText, 'share');
      if (result) {
        setDetected(result);
        setPlatform(result.platform);
        setAmount(result.amount?.toString() || '');
        setDirection(result.direction);
        setCounterparty(result.counterparty || '');
      }
    }
  }, [sharedText]);

  const handleRecord = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/payment/quick-record',
        {
          platform,
          amount: parseFloat(amount) || 0,
          currency: 'USD',
          direction,
          counterparty: counterparty || null,
          referenceId: null,
          rawText: sharedText || '',
          detectedAt: new Date().toISOString(),
          confidence: detected ? detected.confidence : 0.5,
        },
        {headers: {Authorization: `Bearer ${token.token}`}},
      );
      if (navigation.canGoBack()) navigation.goBack();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle showBackArrow={true} title="Record Payment" />
      <ScrollView contentContainerStyle={styles.content}>
        {sharedImageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{uri: sharedImageUri}} style={styles.sharedImage} resizeMode="contain" />
            <Text style={styles.imageHint}>
              Enter the payment details from this screenshot
            </Text>
          </View>
        ) : sharedText ? (
          <View style={styles.sharedTextBox}>
            <Text style={styles.sharedTextLabel}>Shared content:</Text>
            <Text style={styles.sharedText} numberOfLines={4}>
              {sharedText}
            </Text>
          </View>
        ) : null}

        {detected && (
          <View style={styles.detectedBanner}>
            <Text style={styles.detectedText}>
              Detected: {detected.platform} {detected.direction} ${detected.amount}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Platform</Text>
        <TextInput
          style={styles.input}
          value={platform}
          onChangeText={setPlatform}
          placeholder="e.g. Venmo, Zelle, PayPal"
          placeholderTextColor="rgba(255,255,255,0.4)"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Direction</Text>
        <View style={styles.directionRow}>
          <Pressable
            style={[styles.directionBtn, direction === 'sent' && styles.directionActive]}
            onPress={() => setDirection('sent')}>
            <Text style={[styles.directionText, direction === 'sent' && styles.directionTextActive]}>
              Sent
            </Text>
          </Pressable>
          <Pressable
            style={[styles.directionBtn, direction === 'received' && styles.directionActive]}
            onPress={() => setDirection('received')}>
            <Text style={[styles.directionText, direction === 'received' && styles.directionTextActive]}>
              Received
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Counterparty</Text>
        <TextInput
          style={styles.input}
          value={counterparty}
          onChangeText={setCounterparty}
          placeholder="Name of person"
          placeholderTextColor="rgba(255,255,255,0.4)"
        />

        <Pressable
          style={[styles.recordButton, submitting && styles.buttonDisabled]}
          onPress={handleRecord}
          disabled={submitting}>
          <Text style={styles.recordButtonText}>
            {submitting ? 'Recording...' : 'Record Payment'}
          </Text>
        </Pressable>
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
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sharedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  sharedTextBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sharedTextLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 4,
  },
  sharedText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  detectedBanner: {
    backgroundColor: 'rgba(0,131,95,0.15)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detectedText: {
    color: GlobalStyles.Colors.primary400,
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  directionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  directionActive: {
    borderColor: GlobalStyles.Colors.primary200,
    backgroundColor: 'rgba(189,174,141,0.15)',
  },
  directionText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '600',
  },
  directionTextActive: {
    color: GlobalStyles.Colors.primary200,
  },
  recordButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  recordButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
});
