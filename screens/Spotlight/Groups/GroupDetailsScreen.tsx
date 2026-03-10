import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../assets/constants/colors';
import GroupDetailsInfo from '../../../assets/constants/Components/GroupDetailsInfo';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SpotlightStackParamList} from '../../../App';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GroupDetailsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId;
  const token = useSelector((state: AppState) => state.token);

  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGroupStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setIsMember(response.data.isMember ?? false);
      setMemberCount(response.data.memberCount ?? 0);
    } catch (error) {
      console.error('Error fetching group status:', error);
    }
  };

  useEffect(() => {
    fetchGroupStatus();
  }, []);

  const handleJoinGroup = async () => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/group/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setIsMember(true);
      setMemberCount(prev => prev + 1);
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    Alert.alert('Leave Group', 'Are you sure you want to leave this group?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await axios.post(
              `http://localhost:8080/api/omnis/group/${groupId}/leave`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                  'Content-Type': 'application/json',
                },
              },
            );
            setIsMember(false);
            setMemberCount(prev => Math.max(0, prev - 1));
          } catch (error) {
            console.error('Error leaving group:', error);
            Alert.alert('Error', 'Failed to leave group. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.Background}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW5lcmd5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.titleContainer}>
          <ScreenTitle
            title="Group details"
            showBackArrow={true}
            onBackPress={() => {}}
          />
        </View>
      </ImageBackground>
      <View
        style={{
          width: '100%',
          height: '70%',
          bottom: 0,
          position: 'absolute',
        }}>
        <GroupDetailsInfo />

        <View style={styles.memberInfoRow}>
          <View style={styles.memberCountContainer}>
            <Ionicons
              name="people"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.memberCountText}>
              {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isMember
                  ? GlobalStyles.Colors.primary400
                  : GlobalStyles.Colors.primary600,
              },
            ]}>
            <Text style={styles.statusBadgeText}>
              {isMember ? 'Joined' : 'Not a member'}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      ) : isMember ? (
        <View style={styles.buttonRow}>
          <CompleteButton
            text="Create a group bill"
            color={GlobalStyles.Colors.primary200}
            onPress={() => navigation.navigate('GroupBill')}
          />
          <Pressable style={styles.leaveButton} onPress={handleLeaveGroup}>
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </Pressable>
        </View>
      ) : (
        <CompleteButton
          text="Join Group"
          color={GlobalStyles.Colors.primary400}
          onPress={handleJoinGroup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    marginTop: 60,
  },
  memberInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  memberCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  leaveButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  leaveButtonText: {
    color: GlobalStyles.Colors.primary300,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 70,
  },
});
