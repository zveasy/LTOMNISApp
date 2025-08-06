import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesOnboardingStackParamList } from '../../navigation/MessagesOnboardingNavigator';
import { GlobalStyles } from '../../assets/constants/colors';

export type MessagesIntroScreenProps = NativeStackScreenProps<MessagesOnboardingStackParamList, 'MessagesIntro'>;

const MessagesIntroScreen: React.FC<MessagesIntroScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');
  const isCompact = height < 400; // Detect compact iMessage view
  
  const styles = createStyles(isDark, isCompact);
  
  return (
    <View style={styles.container} testID="introScreen">
      {/* Illustration placeholder - will be replaced with actual SVG/image */}
      <View style={styles.illustrationContainer} accessibilityLabel="Chat bubbles with IOU card illustration">
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationText}>💬</Text>
          <Text style={styles.illustrationSubtext}>IOU</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} testID="introTitle">Track IOUs in Messages</Text>
        <Text style={styles.subtitle} testID="introSubtitle">
          Create quick payback notes without leaving the chat.
        </Text>
        
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="continueButton"
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MessagesSteps')}
            accessibilityRole="button"
            accessibilityLabel="Continue to next screen"
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
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

export default MessagesIntroScreen;

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
    shadowColor: isDark ? GlobalStyles.Colors.primary900 : GlobalStyles.Colors.primary500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  illustrationText: {
    fontSize: isCompact ? 32 : 48,
    marginBottom: 4,
  },
  illustrationSubtext: {
    fontSize: isCompact ? 12 : 16,
    color: GlobalStyles.Colors.primary200,
    fontWeight: '600',
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
    marginBottom: isCompact ? 8 : 12,
    lineHeight: isCompact ? 28 : 36,
  },
  subtitle: {
    fontSize: isCompact ? 14 : 16,
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary510,
    textAlign: 'center',
    lineHeight: isCompact ? 20 : 24,
    maxWidth: 280,
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
  primaryButtonPressed: {
    backgroundColor: GlobalStyles.Colors.primary210,
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
