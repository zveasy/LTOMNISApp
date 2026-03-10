import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import GlobalStyles from '../colors';

interface Badge {
  type: string;
  earned: boolean;
}

interface TrustBadgesProps {
  userId: string;
}

const BADGE_CONFIG: Record<string, {icon: string; label: string}> = {
  'Verified Identity': {icon: 'shield-check', label: 'Verified Identity'},
  'First Loan': {icon: 'cash', label: 'First Loan'},
  'Perfect Repayer': {icon: 'star-circle', label: 'Perfect Repayer'},
  'Community Leader': {icon: 'account-group', label: 'Community Leader'},
  'Top Lender': {icon: 'trophy', label: 'Top Lender'},
  '5 Loans Funded': {icon: 'numeric-5-circle', label: '5 Loans Funded'},
  'Early Repayer': {icon: 'clock-fast', label: 'Early Repayer'},
};

const DEFAULT_BADGES: Badge[] = Object.keys(BADGE_CONFIG).map(type => ({
  type,
  earned: false,
}));

const TrustBadges: React.FC<TrustBadgesProps> = ({userId}) => {
  const token = useSelector((state: AppState) => state.token);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/user/${userId}/badges`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.data?.badges) {
          setBadges(response.data.badges);
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={GlobalStyles.Colors.primary200}
        />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {badges.map((badge, index) => {
        const config = BADGE_CONFIG[badge.type];
        if (!config) return null;
        return (
          <View key={index} style={styles.badgeItem}>
            <View
              style={[
                styles.badgeCircle,
                !badge.earned && styles.badgeCircleUnearned,
              ]}>
              <Icon
                name={config.icon}
                size={24}
                color={
                  badge.earned
                    ? GlobalStyles.Colors.primary200
                    : GlobalStyles.Colors.accent100
                }
              />
            </View>
            <Text
              style={[
                styles.badgeLabel,
                !badge.earned && styles.badgeLabelUnearned,
              ]}
              numberOfLines={2}>
              {config.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GlobalStyles.Colors.primary120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.primary200,
  },
  badgeCircleUnearned: {
    borderColor: GlobalStyles.Colors.accent100,
    backgroundColor: GlobalStyles.Colors.accent250,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: GlobalStyles.Colors.primary500,
    textAlign: 'center',
    marginTop: 6,
  },
  badgeLabelUnearned: {
    color: GlobalStyles.Colors.accent100,
  },
});

export default TrustBadges;
