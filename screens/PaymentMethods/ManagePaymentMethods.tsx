import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';
import {HomeStackParamList} from '../../App';

const PLATFORM_ICONS: Record<string, string> = {
  zelle: 'flash-outline',
  venmo: 'logo-venmo',
  paypal: 'logo-paypal',
  cashapp: 'cash-outline',
  applepay: 'logo-apple',
  remitly: 'send-outline',
  wise: 'swap-horizontal-outline',
  worldremit: 'globe-outline',
  other: 'ellipsis-horizontal-outline',
};

type PaymentMethod = {
  id: string;
  platform: string;
  handle: string;
  displayName?: string;
  isPrimary: boolean;
};

export default function ManagePaymentMethods() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMethods = useCallback(async () => {
    try {
      const response = await api.get('/payment-methods');
      setMethods(response.data?.methods ?? response.data ?? []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMethods();
    setRefreshing(false);
  }, [fetchMethods]);

  const handleSetPrimary = async (id: string) => {
    try {
      await api.put(`/payment-methods/${id}/primary`);
      setMethods(prev =>
        prev.map(m => ({...m, isPrimary: m.id === id})),
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to set primary method.');
    }
  };

  const handleDelete = (id: string, platform: string) => {
    Alert.alert(
      'Delete Payment Method',
      `Remove your ${platform} payment method?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/payment-methods/${id}`);
              setMethods(prev => prev.filter(m => m.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete payment method.');
            }
          },
        },
      ],
    );
  };

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform.toLowerCase()] ?? 'ellipsis-horizontal-outline';

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Payment Methods" showBackArrow />
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
      <ScreenTitle title="Payment Methods" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {methods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="wallet-outline"
              size={64}
              color={GlobalStyles.Colors.accent110}
            />
            <Text style={styles.emptyText}>No payment methods added yet</Text>
            <Text style={styles.emptySubtext}>
              Add your payment handles so lenders and borrowers can pay you
              through the apps you already use.
            </Text>
          </View>
        ) : (
          methods.map(method => (
            <View key={method.id} style={styles.methodCard}>
              <View style={styles.methodLeft}>
                <View style={styles.iconCircle}>
                  <Icon
                    name={getPlatformIcon(method.platform)}
                    size={22}
                    color={GlobalStyles.Colors.primary200}
                  />
                </View>
                <View style={styles.methodInfo}>
                  <View style={styles.methodNameRow}>
                    <Text style={styles.platformName}>{method.platform}</Text>
                    {method.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>Primary</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.handleText}>{method.handle}</Text>
                </View>
              </View>
              <View style={styles.methodActions}>
                {!method.isPrimary && (
                  <TouchableOpacity
                    onPress={() => handleSetPrimary(method.id)}
                    style={styles.actionButton}>
                    <Icon
                      name="star-outline"
                      size={20}
                      color={GlobalStyles.Colors.primary200}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDelete(method.id, method.platform)}
                  style={styles.actionButton}>
                  <Icon
                    name="trash-outline"
                    size={20}
                    color={GlobalStyles.Colors.primary300}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{height: 100}} />
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPaymentMethod')}>
        <Icon name="add" size={24} color={GlobalStyles.Colors.primary100} />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
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
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  methodCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(189,174,141,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  primaryBadge: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  primaryBadgeText: {
    color: GlobalStyles.Colors.primary800,
    fontSize: 11,
    fontWeight: 'bold',
  },
  handleText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  addButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
