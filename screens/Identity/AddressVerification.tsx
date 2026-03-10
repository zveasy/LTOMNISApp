import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import CustomLabelledTextInput from '../../assets/constants/Components/CustomLabelledTextInput';
import {AppState} from '../../ReduxStore';

type AddressStatus = 'idle' | 'pending' | 'verified' | 'rejected';

export default function AddressVerification() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AddressStatus>('idle');

  const token = useSelector((state: AppState) => state.token);

  const handleSubmit = async () => {
    if (!street || !city || !addressState || !postalCode || !country) {
      Alert.alert('Missing Fields', 'Please fill in all address fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/identity/verify_address',
        {
          street,
          city,
          state: addressState,
          postalCode,
          country,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      setStatus(response.data.status || 'pending');
      Alert.alert(
        'Submitted',
        'Your address has been submitted for verification.',
      );
    } catch (error) {
      console.error('Address verification error:', error);
      Alert.alert('Error', 'Failed to verify address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return 'transparent';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Verify Address" showBackArrow={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        {status !== 'idle' && (
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
            <Ionicons
              name={
                status === 'verified'
                  ? 'checkmark-circle'
                  : status === 'rejected'
                  ? 'close-circle'
                  : 'time'
              }
              size={18}
              color="#FFFFFF"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        )}

        <CustomLabelledTextInput
          label="Street Address"
          placeholder="123 Main Street"
          onChangeText={setStreet}
          value={street}
        />
        <CustomLabelledTextInput
          label="City"
          placeholder="City"
          onChangeText={setCity}
          value={city}
        />
        <CustomLabelledTextInput
          label="State / Province"
          placeholder="State"
          onChangeText={setAddressState}
          value={addressState}
        />
        <CustomLabelledTextInput
          label="Postal Code"
          placeholder="12345"
          onChangeText={setPostalCode}
          value={postalCode}
          keyboardType="number-pad"
        />
        <CustomLabelledTextInput
          label="Country"
          placeholder="Country"
          onChangeText={setCountry}
          value={country}
        />

        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Verify Address</Text>
            )}
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    paddingBottom: 40,
  },
  statusBadge: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  submitContainer: {
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 56,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
