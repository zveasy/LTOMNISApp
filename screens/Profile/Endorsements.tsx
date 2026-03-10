import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';

interface Endorsement {
  id: string;
  endorserName: string;
  endorserAvatar?: string;
  date: string;
  message: string;
  rating: number;
}

interface EndorsementsProps {
  route?: {
    params?: {
      userId: string;
      isOwnProfile?: boolean;
    };
  };
}

const StarRating: React.FC<{
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}> = ({rating, size = 16, interactive = false, onRatingChange}) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          disabled={!interactive}
          onPress={() => onRatingChange?.(star)}>
          <Icon
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={GlobalStyles.Colors.primary200}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Endorsements: React.FC<EndorsementsProps> = ({route}) => {
  const userId = route?.params?.userId ?? '';
  const isOwnProfile = route?.params?.isOwnProfile ?? false;
  const token = useSelector((state: AppState) => state.token);

  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEndorsements();
  }, [userId]);

  const fetchEndorsements = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/user/${userId}/endorsements`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data?.endorsements) {
        setEndorsements(response.data.endorsements);
      }
    } catch (error) {
      console.error('Error fetching endorsements:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitEndorsement = async () => {
    if (newRating === 0 || !newMessage.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `http://localhost:8080/api/omnis/user/${userId}/endorsements`,
        {
          rating: newRating,
          message: newMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setNewRating(0);
      setNewMessage('');
      setShowForm(false);
      fetchEndorsements();
    } catch (error) {
      console.error('Error submitting endorsement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEndorsement = ({item}: {item: Endorsement}) => {
    const initials = item.endorserName
      .split(' ')
      .map(w => w[0])
      .join('');

    return (
      <View style={styles.endorsementCard}>
        <View style={styles.endorsementHeader}>
          <Avatar
            size={40}
            rounded
            title={!item.endorserAvatar ? initials : undefined}
            source={
              item.endorserAvatar ? {uri: item.endorserAvatar} : undefined
            }
            overlayContainerStyle={{backgroundColor: 'gray'}}
          />
          <View style={styles.endorserInfo}>
            <Text style={styles.endorserName}>{item.endorserName}</Text>
            <Text style={styles.endorsementDate}>{item.date}</Text>
          </View>
          <StarRating rating={item.rating} />
        </View>
        <Text style={styles.endorsementMessage}>{item.message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Endorsements" showBackArrow={true} showRightIcon={false} />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
            style={{marginTop: 40}}
          />
        ) : (
          <FlatList
            data={endorsements}
            renderItem={renderEndorsement}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon
                  name="message-text-outline"
                  size={48}
                  color={GlobalStyles.Colors.accent100}
                />
                <Text style={styles.emptyText}>No endorsements yet</Text>
              </View>
            }
          />
        )}

        {!isOwnProfile && !showForm && (
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => setShowForm(true)}>
            <Icon
              name="pencil"
              size={18}
              color={GlobalStyles.Colors.primary100}
            />
            <Text style={styles.writeButtonText}>Write Endorsement</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Your Rating</Text>
            <StarRating
              rating={newRating}
              size={28}
              interactive
              onRatingChange={setNewRating}
            />
            <Text style={styles.formLabel}>Your Message</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Write your endorsement..."
              placeholderTextColor={GlobalStyles.Colors.accent100}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowForm(false);
                  setNewRating(0);
                  setNewMessage('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (newRating === 0 || !newMessage.trim()) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={submitEndorsement}
                disabled={newRating === 0 || !newMessage.trim() || submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  endorsementCard: {
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  endorsementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  endorserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  endorserName: {
    fontSize: 14,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary500,
  },
  endorsementDate: {
    fontSize: 12,
    color: GlobalStyles.Colors.accent300,
    marginTop: 2,
  },
  endorsementMessage: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary510,
    lineHeight: 20,
  },
  starContainer: {
    flexDirection: 'row',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: GlobalStyles.Colors.accent300,
    marginTop: 12,
  },
  writeButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: GlobalStyles.Colors.primary200,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  writeButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: GlobalStyles.Colors.primary120,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary500,
    marginTop: 12,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: GlobalStyles.Colors.primary100,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: GlobalStyles.Colors.primary500,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.accent250,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: GlobalStyles.Colors.primary600,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: GlobalStyles.Colors.primary200,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Endorsements;
