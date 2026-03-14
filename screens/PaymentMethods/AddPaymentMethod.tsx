import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

const PLATFORMS = [
  {id: 'zelle', name: 'Zelle', icon: 'flash-outline', placeholder: 'Phone or email'},
  {id: 'venmo', name: 'Venmo', icon: 'logo-venmo', placeholder: '@username'},
  {id: 'paypal', name: 'PayPal', icon: 'logo-paypal', placeholder: 'Email or phone'},
  {id: 'cashapp', name: 'Cash App', icon: 'cash-outline', placeholder: '$cashtag'},
  {id: 'applepay', name: 'Apple Pay', icon: 'logo-apple', placeholder: 'Phone or email'},
  {id: 'remitly', name: 'Remitly', icon: 'send-outline', placeholder: 'Phone or email'},
  {id: 'wise', name: 'Wise', icon: 'swap-horizontal-outline', placeholder: 'Email'},
  {id: 'worldremit', name: 'WorldRemit', icon: 'globe-outline', placeholder: 'Phone or email'},
  {id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline', placeholder: 'Handle or identifier'},
];

export default function AddPaymentMethod() {
  const navigation = useNavigation<any>();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedPlatformData = PLATFORMS.find(p => p.id === selectedPlatform);

  const handleSave = async () => {
    if (!selectedPlatform) {
      Alert.alert('Error', 'Please select a payment platform.');
      return;
    }
    if (!handle.trim()) {
      Alert.alert('Error', 'Please enter your payment handle.');
      return;
    }

    try {
      setSaving(true);
      await api.post('/payment-methods', {
        platform: selectedPlatform,
        handle: handle.trim(),
        displayName: displayName.trim() || undefined,
      });
      Alert.alert('Success', 'Payment method added!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Add Payment Method" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Select Platform</Text>
        <View style={styles.gridContainer}>
          {PLATFORMS.map(platform => (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformCard,
                selectedPlatform === platform.id && styles.platformCardSelected,
              ]}
              onPress={() => setSelectedPlatform(platform.id)}>
              <Icon
                name={platform.icon}
                size={28}
                color={
                  selectedPlatform === platform.id
                    ? GlobalStyles.Colors.primary200
                    : GlobalStyles.Colors.accent110
                }
              />
              <Text
                style={[
                  styles.platformName,
                  selectedPlatform === platform.id &&
                    styles.platformNameSelected,
                ]}>
                {platform.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlatform && (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>
              Your {selectedPlatformData?.name} Handle
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={handle}
                onChangeText={setHandle}
                placeholder={selectedPlatformData?.placeholder ?? 'Enter handle'}
                placeholderTextColor={GlobalStyles.Colors.accent110}
              />
            </View>

            <Text style={styles.inputLabel}>Display Name (Optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="e.g. Personal, Business"
                placeholderTextColor={GlobalStyles.Colors.accent110}
              />
            </View>
          </View>
        )}

        <View style={{height: 120}} />
      </ScrollView>

      {selectedPlatform && (
        <TouchableOpacity
          style={[styles.saveButton, saving && {opacity: 0.6}]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      )}
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
  sectionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  platformCardSelected: {
    borderColor: GlobalStyles.Colors.primary200,
    backgroundColor: 'rgba(189,174,141,0.15)',
  },
  platformName: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  platformNameSelected: {
    color: GlobalStyles.Colors.primary200,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 24,
  },
  inputLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  textInput: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 15,
    padding: 0,
  },
  saveButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
