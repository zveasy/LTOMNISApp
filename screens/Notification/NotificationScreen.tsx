import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import GlobalStyles from '../../assets/constants/colors';
import Notification, {
  NotificationType,
  NotificationTypes,
} from './Notification';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';

interface BackendNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  reference_id: string;
  created_at: string;
}

function mapBackendNotification(n: BackendNotification): NotificationTypes {
  switch (n.type) {
    case 'earned_points':
      return {
        id: n.id,
        type: NotificationType.EarnedPoints,
        points: parseInt(n.message, 10) || 0,
      };
    case 'someone_posted':
      return {
        id: n.id,
        type: NotificationType.SomeonePosted,
        from: n.title,
      };
    case 'payment_due':
      return {
        id: n.id,
        type: NotificationType.PaymentDue,
        amount: parseFloat(n.message) || 0,
        dateDue: n.created_at,
      };
    case 'group_invitation':
      return {
        id: n.id,
        type: NotificationType.GroupInvitation,
        from: n.title,
      };
    case 'friend_request':
      return {
        id: n.id,
        type: NotificationType.FriendRequest,
        from: n.title,
      };
    default:
      return {
        id: n.id,
        type: NotificationType.EarnedPoints,
        points: 0,
      };
  }
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useSelector((state: AppState) => state.token);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/notifications',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const data: BackendNotification[] = response.data.notifications || response.data || [];
      const mapped = data.map(mapBackendNotification);
      setNotifications(mapped);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token.token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/omnis/notifications/read_all',
        {},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setUnreadCount(0);
      Alert.alert('Done', 'All notifications marked as read.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to mark notifications as read.');
    }
  };

  const renderNotification = ({item}: {item: NotificationTypes}) => (
    <Notification {...item} />
  );

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
        showBackArrow={true}
        onBackPress={() => {}}
      />
      {unreadCount > 0 && (
        <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </Pressable>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalStyles.Colors.primary200} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={renderNotification}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={GlobalStyles.Colors.primary200}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No notifications yet.</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  InvitationContainer: {
    width: '100%',
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Background: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingVertical: 40,
  },
  points: {
    flex: 1,
    flexDirection: 'row', // This makes items arrange horizontally
    alignItems: 'center',
    marginLeft: 16,
  },
  Container: {
    height: 108,
    width: '96%',
    borderRadius: 15,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  BigContainer: {
    height: 150,
    width: '96%',
    borderRadius: 15,
    backgroundColor: GlobalStyles.Colors.primary120,
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  RoleLabelContainer: {
    flexDirection: 'column',
    width: '99%',
    height: '100%',
  },
  bigText: {
    fontSize: 18,
    marginLeft: 16,
    marginRight: 8,
    marginBottom: 6,
    //color: GlobalStyles.Colors.accent300,
    //textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
    marginLeft: 16,
    marginRight: 8,
    marginBottom: 6,
    //color: GlobalStyles.Colors.accent300,
    //textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '400',
  },
  InviteButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 24,
    marginLeft: 5,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  markAllButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 8,
  },
  markAllText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
});
