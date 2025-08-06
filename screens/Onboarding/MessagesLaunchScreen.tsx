import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesOnboardingStackParamList } from '../../navigation/MessagesOnboardingNavigator';
import { GlobalStyles } from '../../assets/constants/colors';

export type MessagesLaunchScreenProps = NativeStackScreenProps<MessagesOnboardingStackParamList, 'MessagesLaunch'>;

const MessagesLaunchScreen: React.FC<MessagesLaunchScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');
  const isCompact = height < 400; // Detect compact iMessage view
  
  const styles = createStyles(isDark, isCompact);
  
  return (
    <View style={styles.container} testID="launchScreen">
      {/* Illustration placeholder - will be replaced with actual SVG/image */}
      <View style={styles.illustrationContainer} accessibilityLabel="Tap to pay glyph with confirmation check illustration">
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationText}>👆</Text>
          <Text style={styles.payIcon}>💳</Text>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} testID="launchTitle">One-tap payback</Text>
        <Text style={styles.subtitle} testID="launchSubtitle">
          Settle up fast when it's time.
        </Text>
        <Text style={styles.comingSoon}>(coming soon)</Text>
        
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="getStartedButton"
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MessagesWidgetSettings')}
            accessibilityRole="button"
            accessibilityLabel="Get started with the app"
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            accessibilityRole="link"
            accessibilityLabel="Learn how it works"
          >
            <Text style={styles.secondaryButtonText}>How it works</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean, isCompact: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? GlobalStyles.Colors.primary700 : GlobalStyles.Colors.primary100,
    paddingHorizontal: isCompact ? 16 : 20,
    paddingVertical: isCompact ? 12 : 20,
  },
  illustrationContainer: {
    flex: isCompact ? 0.4 : 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isCompact ? 8 : 16,
  },
  illustrationPlaceholder: {
    width: isCompact ? 120 : 200,
    height: isCompact ? 80 : 140,
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.accent115,
    position: 'relative',
    shadowColor: isDark ? GlobalStyles.Colors.primary900 : GlobalStyles.Colors.primary500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  illustrationText: {
    fontSize: isCompact ? 28 : 40,
    marginBottom: 4,
  },
  payIcon: {
    fontSize: isCompact ? 16 : 24,
    position: 'absolute',
    bottom: isCompact ? 8 : 12,
    left: isCompact ? 8 : 12,
  },
  checkIcon: {
    fontSize: isCompact ? 16 : 24,
    color: GlobalStyles.Colors.primary400, // Success green
    fontWeight: '600',
    position: 'absolute',
    bottom: isCompact ? 8 : 12,
    right: isCompact ? 8 : 12,
  },
  contentContainer: {
    flex: isCompact ? 0.6 : 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: isCompact ? 22 : 28,
    fontWeight: '700',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    textAlign: 'center',
    marginBottom: isCompact ? 4 : 8,
    lineHeight: isCompact ? 28 : 36,
  },
  subtitle: {
    fontSize: isCompact ? 14 : 16,
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary510,
    textAlign: 'center',
    lineHeight: isCompact ? 20 : 24,
    maxWidth: 280,
    marginBottom: isCompact ? 4 : 8,
  },
  comingSoon: {
    fontSize: isCompact ? 12 : 14,
    color: GlobalStyles.Colors.primary200,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: isCompact ? 16 : 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isCompact ? 16 : 24,
  },
  dot: {
    width: isCompact ? 8 : 10,
    height: isCompact ? 8 : 10,
    borderRadius: isCompact ? 4 : 5,
    backgroundColor: GlobalStyles.Colors.primary110,
    marginHorizontal: isCompact ? 3 : 4,
  },
  activeDot: {
    backgroundColor: GlobalStyles.Colors.primary200,
    width: isCompact ? 20 : 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    paddingHorizontal: 32,
    paddingVertical: isCompact ? 16 : 18,
    borderRadius: 30, // Pill shape
    width: '100%',
    maxWidth: 280,
    height: isCompact ? 56 : 60, // Fixed height as specified
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: GlobalStyles.Colors.primary200,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 8,
    minHeight: 44, // Minimum tap target
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default MessagesLaunchScreen;
