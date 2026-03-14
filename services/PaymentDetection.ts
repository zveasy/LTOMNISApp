import {NativeModules, NativeEventEmitter, Platform, PermissionsAndroid} from 'react-native';

// Native module interfaces (implemented in native code)
const {OMNISNotificationListener, OMNISSmsReader} = NativeModules;

export interface DetectedPayment {
  platform: string;
  amount: number | null;
  currency: string;
  direction: 'sent' | 'received';
  counterparty: string | null;
  referenceId: string | null;
  rawText: string;
  detectedAt: string;
  confidence: number; // 0-1
}

// Payment app notification patterns
const PAYMENT_PATTERNS: {platform: string; packages: string[]; smsPatterns: RegExp[]; notifPatterns: RegExp[]}[] = [
  {
    platform: 'venmo',
    packages: ['com.venmo'],
    smsPatterns: [/Venmo:?\s.*\$[\d,.]+/i],
    notifPatterns: [
      /(?:paid you|you paid)\s+\$?([\d,.]+)/i,
      /(\w+)\s+paid you\s+\$?([\d,.]+)/i,
      /You paid\s+(\w+)\s+\$?([\d,.]+)/i,
    ],
  },
  {
    platform: 'zelle',
    packages: ['com.zellepay.zelle'],
    smsPatterns: [/Zelle.*\$[\d,.]+/i, /payment.*sent.*\$[\d,.]+/i],
    notifPatterns: [
      /(?:sent|received)\s+\$?([\d,.]+)/i,
      /(\w+)\s+sent you\s+\$?([\d,.]+)/i,
    ],
  },
  {
    platform: 'cashapp',
    packages: ['com.squareup.cash'],
    smsPatterns: [/Cash App.*\$[\d,.]+/i],
    notifPatterns: [
      /(?:sent|received)\s+\$?([\d,.]+)/i,
      /(\w+)\s+(?:sent you|paid)\s+\$?([\d,.]+)/i,
    ],
  },
  {
    platform: 'paypal',
    packages: ['com.paypal.android.p2pmobile'],
    smsPatterns: [/PayPal.*\$[\d,.]+/i],
    notifPatterns: [
      /(?:sent|received)\s+\$?([\d,.]+)/i,
      /You (?:sent|received)\s+\$?([\d,.]+)/i,
    ],
  },
  {
    platform: 'applepay',
    packages: ['com.apple.mobilepayments'],
    smsPatterns: [/Apple\s*(?:Pay|Cash).*\$[\d,.]+/i],
    notifPatterns: [/(?:sent|received)\s+\$?([\d,.]+)/i],
  },
  {
    platform: 'remitly',
    packages: ['com.remitly.androidapp'],
    smsPatterns: [/Remitly.*(?:\$|USD|EUR|GBP)[\d,.]+/i],
    notifPatterns: [/transfer.*(?:\$|USD)?([\d,.]+)/i],
  },
  {
    platform: 'wise',
    packages: ['com.transferwise.android'],
    smsPatterns: [/Wise.*(?:\$|USD|EUR|GBP)[\d,.]+/i],
    notifPatterns: [/(?:sent|received).*(?:\$|USD)?([\d,.]+)/i],
  },
  {
    platform: 'worldremit',
    packages: ['com.worldremit.android'],
    smsPatterns: [/WorldRemit.*(?:\$|USD)[\d,.]+/i],
    notifPatterns: [/transfer.*(?:\$|USD)?([\d,.]+)/i],
  },
];

export function parsePaymentFromText(text: string, source: 'notification' | 'sms' | 'share'): DetectedPayment | null {
  for (const pattern of PAYMENT_PATTERNS) {
    const patterns = source === 'sms' ? pattern.smsPatterns : pattern.notifPatterns;
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match) {
        // Extract amount
        const amountMatch = text.match(/\$\s*([\d,]+\.?\d*)/);
        const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

        // Determine direction
        const isSent = /(?:you paid|you sent|sent to|payment sent)/i.test(text);
        const isReceived = /(?:paid you|sent you|received|you received)/i.test(text);
        const direction = isSent ? 'sent' : isReceived ? 'received' : 'sent';

        // Extract counterparty name
        const nameMatch = text.match(/(?:(?:to|from|paid|by)\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
        const counterparty = nameMatch ? nameMatch[1] : null;

        return {
          platform: pattern.platform,
          amount,
          currency: 'USD',
          direction,
          counterparty,
          referenceId: null,
          rawText: text,
          detectedAt: new Date().toISOString(),
          confidence: amount ? 0.9 : 0.6,
        };
      }
    }
  }
  return null;
}

export function parsePaymentFromPackage(packageName: string, title: string, text: string): DetectedPayment | null {
  const pattern = PAYMENT_PATTERNS.find(p => p.packages.includes(packageName));
  if (!pattern) return null;

  const combined = `${title} ${text}`;
  const result = parsePaymentFromText(combined, 'notification');
  if (result) {
    result.platform = pattern.platform;
    result.confidence = 0.95;
  }
  return result;
}

// Event listener setup
let notificationEmitter: NativeEventEmitter | null = null;
let paymentCallback: ((payment: DetectedPayment) => void) | null = null;

export function startListening(onPaymentDetected: (payment: DetectedPayment) => void): () => void {
  paymentCallback = onPaymentDetected;

  if (Platform.OS === 'android' && OMNISNotificationListener) {
    notificationEmitter = new NativeEventEmitter(OMNISNotificationListener);
    const sub = notificationEmitter.addListener('onNotificationPosted', (event: {packageName: string; title: string; text: string}) => {
      const payment = parsePaymentFromPackage(event.packageName, event.title, event.text);
      if (payment && paymentCallback) {
        paymentCallback(payment);
      }
    });
    OMNISNotificationListener.startListening();
    return () => {
      sub.remove();
      OMNISNotificationListener.stopListening();
    };
  }

  return () => {};
}

export async function requestNotificationAccess(): Promise<boolean> {
  if (Platform.OS === 'android' && OMNISNotificationListener) {
    return OMNISNotificationListener.requestAccess();
  }
  return false;
}

export async function checkNotificationAccess(): Promise<boolean> {
  if (Platform.OS === 'android' && OMNISNotificationListener) {
    return OMNISNotificationListener.hasAccess();
  }
  return false;
}

export async function readRecentSMS(count: number = 50): Promise<DetectedPayment[]> {
  if (Platform.OS !== 'android' || !OMNISSmsReader) return [];

  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) return [];

  try {
    const messages: {body: string; date: number}[] = await OMNISSmsReader.readRecent(count);
    const payments: DetectedPayment[] = [];
    for (const msg of messages) {
      const payment = parsePaymentFromText(msg.body, 'sms');
      if (payment) {
        payment.detectedAt = new Date(msg.date).toISOString();
        payments.push(payment);
      }
    }
    return payments;
  } catch {
    return [];
  }
}

export {PAYMENT_PATTERNS};
