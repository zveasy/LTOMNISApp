import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../App';

const SUPPORTED_PLATFORMS = [
  {id: 'zelle', name: 'Zelle', icon: 'flash-outline'},
  {id: 'venmo', name: 'Venmo', icon: 'logo-venmo'},
  {id: 'paypal', name: 'PayPal', icon: 'logo-paypal'},
  {id: 'cashapp', name: 'Cash App', icon: 'cash-outline'},
  {id: 'applepay', name: 'Apple Pay', icon: 'logo-apple'},
  {id: 'remitly', name: 'Remitly', icon: 'send-outline'},
  {id: 'wise', name: 'Wise', icon: 'swap-horizontal-outline'},
  {id: 'worldremit', name: 'WorldRemit', icon: 'globe-outline'},
];

export default function WithdrawMoneyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Withdraw"
        showBackArrow={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Explanation Banner */}
        <View style={styles.banner}>
          <Icon
            name="information-circle-outline"
            size={24}
            color={GlobalStyles.Colors.primary200}
          />
          <Text style={styles.bannerText}>
            OMNIS doesn't hold your money. All payments flow through the
            external platforms you already use — Zelle, Venmo, PayPal, Cash App,
            and more.
          </Text>
        </View>

        {/* Supported Platforms */}
        <Text style={styles.sectionTitle}>Supported Platforms</Text>
        <View style={styles.platformGrid}>
          {SUPPORTED_PLATFORMS.map(platform => (
            <View key={platform.id} style={styles.platformCard}>
              <Icon
                name={platform.icon}
                size={28}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.platformName}>{platform.name}</Text>
            </View>
          ))}
        </View>

        {/* How It Works */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon
              name="bulb-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.infoHeaderText}>How Withdrawals Work</Text>
          </View>
          <Text style={styles.infoText}>
            When a borrower repays you, they send money directly to your payment
            handle (e.g. your Venmo or Zelle). OMNIS tracks these payments and
            updates your credit score — we never hold your funds.
          </Text>
        </View>

        {/* Manage Payment Methods */}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('ManagePaymentMethods')}>
          <Icon
            name="wallet-outline"
            size={22}
            color={GlobalStyles.Colors.primary100}
          />
          <Text style={styles.manageButtonText}>
            Manage My Payment Methods
          </Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189,174,141,0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(189,174,141,0.3)',
  },
  bannerText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '23%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  platformName: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoHeaderText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    lineHeight: 20,
  },
  manageButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  manageButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
