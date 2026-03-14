import React, {createContext, useContext, useEffect, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../ReduxStore';
import {startListening, DetectedPayment, checkNotificationAccess} from './PaymentDetection';

interface PaymentDetectionContextType {
  detectedPayment: DetectedPayment | null;
  dismissDetection: () => void;
  isListening: boolean;
  hasAccess: boolean;
}

const PaymentDetectionContext = createContext<PaymentDetectionContextType>({
  detectedPayment: null,
  dismissDetection: () => {},
  isListening: false,
  hasAccess: false,
});

export function PaymentDetectionProvider({children}: {children: React.ReactNode}) {
  const [detectedPayment, setDetectedPayment] = useState<DetectedPayment | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const token = useSelector((state: AppState) => state.token);

  useEffect(() => {
    checkNotificationAccess().then(setHasAccess);
  }, []);

  useEffect(() => {
    if (!token.token || !hasAccess) return;

    const cleanup = startListening((payment) => {
      setDetectedPayment(payment);
    });
    setIsListening(true);

    return () => {
      cleanup();
      setIsListening(false);
    };
  }, [token.token, hasAccess]);

  const dismissDetection = useCallback(() => {
    setDetectedPayment(null);
  }, []);

  return (
    <PaymentDetectionContext.Provider value={{detectedPayment, dismissDetection, isListening, hasAccess}}>
      {children}
    </PaymentDetectionContext.Provider>
  );
}

export function usePaymentDetection() {
  return useContext(PaymentDetectionContext);
}
