import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../../assets/constants/colors';
import TextInputComponent from '../../../assets/constants/Components/TextInputComponent';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import ToggleButton from '../../../assets/constants/Components/ToggleButton';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import {useRoute, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator' | 'member';
}

interface GroupSettings {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  maxExposure: string;
}

export default function GroupAdmin() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const groupId = route.params?.groupId;
  const token = useSelector((state: AppState) => state.token);

  const [members, setMembers] = useState<Member[]>([]);
  const [settings, setSettings] = useState<GroupSettings>({
    name: '',
    description: '',
    visibility: 'public',
    maxExposure: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/group/${groupId}/admin`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setMembers(response.data.members ?? []);
      setSettings({
        name: response.data.name ?? '',
        description: response.data.description ?? '',
        visibility: response.data.visibility ?? 'public',
        maxExposure: response.data.maxExposure?.toString() ?? '',
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(
                `http://localhost:8080/api/omnis/group/${groupId}/remove_member`,
                {memberId},
                {
                  headers: {
                    Authorization: `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                  },
                },
              );
              setMembers(prev => prev.filter(m => m.id !== memberId));
            } catch (error) {
              console.error('Error removing member:', error);
              Alert.alert('Error', 'Failed to remove member.');
            }
          },
        },
      ],
    );
  };

  const handlePromoteToModerator = async (
    memberId: string,
    memberName: string,
  ) => {
    Alert.alert(
      'Promote Member',
      `Promote ${memberName} to moderator?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Promote',
          onPress: async () => {
            try {
              await axios.post(
                `http://localhost:8080/api/omnis/group/${groupId}/remove_member`,
                {memberId, newRole: 'moderator'},
                {
                  headers: {
                    Authorization: `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                  },
                },
              );
              setMembers(prev =>
                prev.map(m =>
                  m.id === memberId ? {...m, role: 'moderator'} : m,
                ),
              );
            } catch (error) {
              console.error('Error promoting member:', error);
              Alert.alert('Error', 'Failed to promote member.');
            }
          },
        },
      ],
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(
        `http://localhost:8080/api/omnis/group/${groupId}/settings`,
        {
          name: settings.name,
          description: settings.description,
          visibility: settings.visibility,
          maxExposure: parseFloat(settings.maxExposure) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Success', 'Group settings saved.');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'This action cannot be undone. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(
                `http://localhost:8080/api/omnis/group/${groupId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                  },
                },
              );
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting group:', error);
              Alert.alert('Error', 'Failed to delete group.');
            }
          },
        },
      ],
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return GlobalStyles.Colors.primary200;
      case 'moderator':
        return GlobalStyles.Colors.primary400;
      default:
        return GlobalStyles.Colors.primary600;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle
          title="Group Admin"
          showBackArrow={true}
          onBackPress={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Group Admin"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.sectionTitle}>Members</Text>
        {members.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {member.firstName} {member.lastName}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  {backgroundColor: getRoleBadgeColor(member.role)},
                ]}>
                <Text style={styles.roleText}>{member.role}</Text>
              </View>
            </View>
            {member.role !== 'admin' && (
              <View style={styles.memberActions}>
                {member.role === 'member' && (
                  <Pressable
                    style={styles.promoteButton}
                    onPress={() =>
                      handlePromoteToModerator(
                        member.id,
                        `${member.firstName} ${member.lastName}`,
                      )
                    }>
                    <Ionicons
                      name="arrow-up-circle"
                      size={20}
                      color={GlobalStyles.Colors.primary400}
                    />
                  </Pressable>
                )}
                <Pressable
                  style={styles.removeButton}
                  onPress={() =>
                    handleRemoveMember(
                      member.id,
                      `${member.firstName} ${member.lastName}`,
                    )
                  }>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Group Settings</Text>
        <TextInputComponent
          title="Group Name"
          placeholder="Enter group name"
          keyboardType="default"
          onChangeText={text => setSettings(prev => ({...prev, name: text}))}
        />
        <TextInputComponent
          title="Description"
          placeholder="Enter group description"
          keyboardType="default"
          onChangeText={text =>
            setSettings(prev => ({...prev, description: text}))
          }
          inputHeight={110}
        />
        <TextInputComponent
          title="Max Exposure"
          placeholder="Enter max exposure amount"
          keyboardType="numeric"
          onChangeText={text =>
            setSettings(prev => ({...prev, maxExposure: text}))
          }
          isAmount={true}
        />

        <ToggleButton
          title="Visibility"
          toggleTexts={['Private', 'Public']}
          onToggle={activeText => {
            setSettings(prev => ({
              ...prev,
              visibility: activeText === 'Public' ? 'public' : 'private',
            }));
          }}
        />

        <View style={styles.buttonContainer}>
          <CompleteButton
            text={saving ? 'Saving...' : 'Save Changes'}
            color={GlobalStyles.Colors.primary200}
            onPress={handleSaveSettings}
          />
        </View>

        <Pressable style={styles.deleteButton} onPress={handleDeleteGroup}>
          <Text style={styles.deleteButtonText}>Delete Group</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollViewContainer: {
    flexDirection: 'column',
    paddingHorizontal: 5,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberName: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoteButton: {
    marginRight: 12,
    padding: 4,
  },
  removeButton: {
    backgroundColor: GlobalStyles.Colors.primary300,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    width: '90%',
    height: 2,
    backgroundColor: 'rgba(256,256,256,0.04)',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  deleteButton: {
    width: '90%',
    height: 56,
    backgroundColor: GlobalStyles.Colors.primary300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
