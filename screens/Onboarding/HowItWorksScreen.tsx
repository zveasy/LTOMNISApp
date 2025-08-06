import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesOnboardingStackParamList } from '../../navigation/MessagesOnboardingNavigator';
import { GlobalStyles } from '../../assets/constants/colors';

export type HowItWorksScreenProps = NativeStackScreenProps<MessagesOnboardingStackParamList, 'HowItWorks'>;

const HowItWorksScreen: React.FC<HowItWorksScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');
  const isCompact = height < 400; // Detect compact iMessage view
  
  const styles = createStyles(isDark, isCompact);
  
  const handleClose = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container} testID="howItWorksScreen">
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Go back to onboarding"
          testID="backButton"
        >
          <Text style={styles.backButtonText}>←</Text>
          <Text style={styles.backButtonLabel}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title */}
        <Text style={styles.mainTitle} testID="mainTitle">How OMNIS works</Text>
        
        {/* Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💬</Text>
            <Text style={styles.sectionTitle}>Create an IOU in the conversation</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Start tracking what's owed right in your Messages chat. Quick and simple.
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💰</Text>
            <Text style={styles.sectionTitle}>Set who owes whom + amount</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Specify the details clearly so everyone knows what's what.
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📅</Text>
            <Text style={styles.sectionTitle}>Add a due date (optional)</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Pick when it should be paid back, or leave it open-ended.
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔔</Text>
            <Text style={styles.sectionTitle}>We send gentle reminders</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Friendly nudges when the due date approaches. No nagging, just helpful.
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👆</Text>
            <Text style={styles.sectionTitle}>One-tap payback (coming soon)</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Settle up instantly when it's time to pay. Fast and secure.
          </Text>
        </View>
        
        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>FAQ</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>Yes, all data is encrypted and stored securely.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I edit an IOU after creating it?</Text>
            <Text style={styles.faqAnswer}>Yes, you can modify details until it's marked as paid.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What if someone doesn't have the app?</Text>
            <Text style={styles.faqAnswer}>They'll get a simple text message with the IOU details.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Are there any fees?</Text>
            <Text style={styles.faqAnswer}>OMNIS is free to use for tracking IOUs and reminders.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I turn off reminders?</Text>
            <Text style={styles.faqAnswer}>You can disable notifications in your device settings anytime.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean, isCompact: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? GlobalStyles.Colors.primary700 : GlobalStyles.Colors.primary100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: isCompact ? 16 : 20,
    paddingTop: isCompact ? 44 : 52,
    paddingBottom: isCompact ? 12 : 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: GlobalStyles.Colors.primary200,
    minHeight: 44,
    shadowColor: GlobalStyles.Colors.primary200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    color: GlobalStyles.Colors.primary100,
    fontWeight: '700',
    marginRight: 8,
  },
  backButtonLabel: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary100,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isCompact ? 16 : 20,
    paddingBottom: isCompact ? 20 : 32,
  },
  mainTitle: {
    fontSize: isCompact ? 24 : 32,
    fontWeight: '700',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    textAlign: 'center',
    marginBottom: isCompact ? 24 : 32,
    lineHeight: isCompact ? 32 : 40,
  },
  section: {
    marginBottom: isCompact ? 16 : 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isCompact ? 6 : 8,
  },
  sectionIcon: {
    fontSize: isCompact ? 20 : 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: isCompact ? 16 : 18,
    fontWeight: '600',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    flex: 1,
    lineHeight: isCompact ? 22 : 26,
  },
  sectionDescription: {
    fontSize: isCompact ? 14 : 16,
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary510,
    lineHeight: isCompact ? 20 : 24,
    marginLeft: isCompact ? 32 : 36,
  },
  divider: {
    height: 1,
    backgroundColor: GlobalStyles.Colors.accent250,
    marginVertical: isCompact ? 12 : 16,
  },
  faqSection: {
    marginTop: isCompact ? 24 : 32,
  },
  faqTitle: {
    fontSize: isCompact ? 20 : 24,
    fontWeight: '700',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    marginBottom: isCompact ? 16 : 20,
    lineHeight: isCompact ? 26 : 32,
  },
  faqItem: {
    marginBottom: isCompact ? 12 : 16,
  },
  faqQuestion: {
    fontSize: isCompact ? 14 : 16,
    fontWeight: '600',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    marginBottom: 4,
    lineHeight: isCompact ? 20 : 24,
  },
  faqAnswer: {
    fontSize: isCompact ? 13 : 15,
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary510,
    lineHeight: isCompact ? 18 : 22,
  },
});

export default HowItWorksScreen;
