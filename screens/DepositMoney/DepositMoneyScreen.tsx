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

const HOW_IT_WORKS = [
  'Add your payment handles (Venmo, Zelle, etc.)',
  'When you owe a payment, your lender sees how to pay you',
  'Make the payment on that platform',
  'Mark it as paid in OMNIS',
  'Your lender confirms receipt',
  'Your credit score grows!',
];

export default function DepositMoneyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Deposit"
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
            OMNIS doesn't hold your money. Pay and get paid through the apps you
            already use.
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

        {/* Manage Payment Methods Button */}
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

        {/* How It Works */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.howItWorksCard}>
          {HOW_IT_WORKS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

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
  manageButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  manageButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  howItWorksCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(189,174,141,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
