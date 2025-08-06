import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesOnboardingStackParamList } from '../../navigation/MessagesOnboardingNavigator';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../assets/constants/colors';

export type MessagesWidgetSettingsScreenProps = NativeStackScreenProps<MessagesOnboardingStackParamList, 'MessagesWidgetSettings'>;

const MessagesWidgetSettingsScreen: React.FC<MessagesWidgetSettingsScreenProps> = ({ navigation }) => {
  const rootNavigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');
  const isCompact = height < 400; // Detect compact iMessage view
  
  const styles = createStyles(isDark, isCompact);
  
  const handleFinishOnboarding = () => {
    // Navigate to the main app stack
    rootNavigation.navigate('MainStackNavigator' as never);
  };
  
  return (
    <View style={styles.container} testID="widgetSettingsScreen">
      <View style={styles.contentContainer}>
        <Text style={styles.title} testID="settingsTitle">You're all set!</Text>
        <Text style={styles.subtitle} testID="settingsSubtitle">
          Start tracking IOUs in your Messages conversations.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="finishButton"
            style={styles.primaryButton}
            onPress={handleFinishOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Finish setup and start using the app"
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Start Using OMNIS</Text>
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
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: isCompact ? 24 : 32,
    fontWeight: '700',
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary500,
    textAlign: 'center',
    marginBottom: isCompact ? 12 : 16,
    lineHeight: isCompact ? 32 : 40,
  },
  subtitle: {
    fontSize: isCompact ? 16 : 18,
    color: isDark ? GlobalStyles.Colors.primary100 : GlobalStyles.Colors.primary510,
    textAlign: 'center',
    lineHeight: isCompact ? 24 : 28,
    maxWidth: 320,
    marginBottom: isCompact ? 32 : 48,
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
});

export default MessagesWidgetSettingsScreen;
