import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  useColorScheme,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesOnboardingStackParamList } from '../../navigation/MessagesOnboardingNavigator';
import { GlobalStyles } from '../../assets/constants/colors';
import { useNavigation } from '@react-navigation/native';

export type SwipeableOnboardingContainerProps = NativeStackScreenProps<MessagesOnboardingStackParamList, 'MessagesIntro'>;

const SwipeableOnboardingContainer: React.FC<SwipeableOnboardingContainerProps> = ({ navigation }) => {
  const rootNavigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');
  const isCompact = height < 400;
  
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const styles = createStyles(isDark, isCompact, width);
  
  const onboardingData = [
    {
      title: "Track IOUs in Messages",
      subtitle: "Create quick payback notes without leaving the chat.",
      illustration: "💬",
      illustrationSub: "IOU"
    },
    {
      title: "Due dates & reminders",
      subtitle: "Pick a date and we'll nudge both sides—gently.",
      illustration: "📅",
      illustrationSub: "✓",
      illustrationExtra: "🔔"
    },
    {
      title: "One-tap payback",
      subtitle: "Settle up fast when it's time.",
      comingSoon: "(coming soon)",
      illustration: "👆",
      illustrationSub: "💳",
      illustrationExtra: "✓"
    }
  ];
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(pageIndex);
  };
  
  const handleContinue = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
      setCurrentPage(nextPage);
    } else {
      // Last page - navigate to completion screen
      navigation.navigate('MessagesWidgetSettings');
    }
  };
  
  const handleHowItWorks = () => {
    navigation.navigate('HowItWorks');
  };
  
  const renderPage = (data: typeof onboardingData[0], index: number) => (
    <View key={index} style={styles.page}>
      {/* Illustration */}
      <View style={styles.illustrationContainer} accessibilityLabel={`${data.title} illustration`}>
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationText}>{data.illustration}</Text>
          {data.illustrationSub && (
            <Text style={[
              styles.illustrationSubtext,
              index === 1 ? styles.checkmarkColor : styles.brandColor
            ]}>
              {data.illustrationSub}
            </Text>
          )}
          {data.illustrationExtra && (
            <Text style={[
              styles.illustrationExtra,
              index === 1 ? styles.bellIcon : styles.checkIcon
            ]}>
              {data.illustrationExtra}
            </Text>
          )}
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} testID={`title-${index}`}>{data.title}</Text>
        <Text style={styles.subtitle} testID={`subtitle-${index}`}>
          {data.subtitle}
        </Text>
        {data.comingSoon && (
          <Text style={styles.comingSoon}>{data.comingSoon}</Text>
        )}
        
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                dotIndex === currentPage && styles.activeDot
              ]}
            />
          ))}
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID={`${index === onboardingData.length - 1 ? 'getStarted' : 'continue'}Button`}
            style={styles.primaryButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel={index === onboardingData.length - 1 ? "Get started with the app" : "Continue to next screen"}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {index === onboardingData.length - 1 ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleHowItWorks}
            accessibilityRole="link"
            accessibilityLabel="Learn how it works"
          >
            <Text style={styles.secondaryButtonText}>How it works</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container} testID="swipeableOnboardingContainer">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {onboardingData.map((data, index) => renderPage(data, index))}
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean, isCompact: boolean, screenWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? GlobalStyles.Colors.primary700 : GlobalStyles.Colors.primary100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  page: {
    width: screenWidth,
    flex: 1,
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
    position: 'relative',
  },
  illustrationText: {
    fontSize: isCompact ? 32 : 48,
    marginBottom: 4,
  },
  illustrationSubtext: {
    fontSize: isCompact ? 12 : 16,
    fontWeight: '600',
    position: 'absolute',
    bottom: isCompact ? 8 : 12,
    right: isCompact ? 8 : 12,
  },
  illustrationExtra: {
    fontSize: isCompact ? 12 : 16,
    position: 'absolute',
  },
  brandColor: {
    color: GlobalStyles.Colors.primary200,
  },
  checkmarkColor: {
    color: GlobalStyles.Colors.primary400,
  },
  bellIcon: {
    top: isCompact ? 8 : 12,
    right: isCompact ? 8 : 12,
  },
  checkIcon: {
    bottom: isCompact ? 8 : 12,
    right: isCompact ? 8 : 12,
    color: GlobalStyles.Colors.primary400,
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

export default SwipeableOnboardingContainer;
