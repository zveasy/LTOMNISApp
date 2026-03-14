import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOwnMessage: boolean;
}

interface DisputeInfo {
  loanId: string;
  disputedAmount: number;
  borrowerClaim: string;
  lenderClaim: string;
  status: 'open' | 'under_review' | 'resolved';
}

export default function PaymentDispute({route}: {route: any}) {
  const disputeId = route?.params?.disputeId;
  const flatListRef = useRef<FlatList>(null);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [disputeInfo, setDisputeInfo] = useState<DisputeInfo>({
    loanId: route?.params?.loanId ?? 'LN-23456',
    disputedAmount: route?.params?.disputedAmount ?? 171.23,
    borrowerClaim: route?.params?.borrowerClaim ?? 'Payment was made on time',
    lenderClaim: route?.params?.lenderClaim ?? 'Payment not received',
    status: 'open',
  });

  useEffect(() => {
    if (disputeId) {
      fetchMessages();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/disputes/${disputeId}/messages`);
      setMessages(response.data?.messages ?? []);
      if (response.data?.disputeInfo) {
        setDisputeInfo(response.data.disputeInfo);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      await api.post(`/disputes/${disputeId}/messages`, {
        message: newMessage.trim(),
      });
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: 'current_user',
        senderName: 'You',
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isOwnMessage: true,
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleResolve = () => {
    Alert.alert(
      'Resolve Dispute',
      'Are you sure you want to mark this dispute as resolved?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await api.post(`/disputes/${disputeId}/resolve`);
              setDisputeInfo(prev => ({...prev, status: 'resolved'}));
              Alert.alert('Success', 'Dispute has been marked as resolved.');
            } catch (error) {
              console.error('Error resolving dispute:', error);
              Alert.alert('Error', 'Failed to resolve dispute.');
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#F5A623';
      case 'under_review':
        return GlobalStyles.Colors.primary200;
      case 'resolved':
        return GlobalStyles.Colors.primary400;
      default:
        return GlobalStyles.Colors.accent110;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'under_review':
        return 'Under Review';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageBubble,
        item.isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}>
      {!item.isOwnMessage && (
        <Text style={styles.messageSender}>{item.senderName}</Text>
      )}
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Payment Dispute" showBackArrow />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Dispute Info Card */}
        <View style={styles.disputeCard}>
          <View style={styles.disputeHeader}>
            <Text style={styles.loanIdLabel}>Loan {disputeInfo.loanId}</Text>
            <View
              style={[
                styles.statusPill,
                {backgroundColor: `${getStatusColor(disputeInfo.status)}20`},
              ]}>
              <Text
                style={[
                  styles.statusPillText,
                  {color: getStatusColor(disputeInfo.status)},
                ]}>
                {getStatusLabel(disputeInfo.status)}
              </Text>
            </View>
          </View>
          <View style={styles.disputeAmount}>
            <Text style={styles.disputeAmountLabel}>Disputed Amount</Text>
            <Text style={styles.disputeAmountValue}>
              ${disputeInfo.disputedAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.claimsSection}>
            <View style={styles.claimRow}>
              <Text style={styles.claimLabel}>Borrower:</Text>
              <Text style={styles.claimText}>{disputeInfo.borrowerClaim}</Text>
            </View>
            <View style={styles.claimRow}>
              <Text style={styles.claimLabel}>Lender:</Text>
              <Text style={styles.claimText}>{disputeInfo.lenderClaim}</Text>
            </View>
          </View>
          {disputeInfo.status !== 'resolved' && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={handleResolve}>
              <Text style={styles.resolveButtonText}>Resolve Dispute</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Messages Thread */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
            style={{marginTop: 20}}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({animated: false})
            }
            ListEmptyComponent={
              <View style={styles.emptyMessages}>
                <Text style={styles.emptyMessagesText}>
                  No messages yet. Start the conversation.
                </Text>
              </View>
            }
          />
        )}

        {/* Message Input */}
        {disputeInfo.status !== 'resolved' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={GlobalStyles.Colors.accent110}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, sending && {opacity: 0.6}]}
              onPress={handleSendMessage}
              disabled={sending || !newMessage.trim()}>
              {sending ? (
                <ActivityIndicator
                  size="small"
                  color={GlobalStyles.Colors.primary100}
                />
              ) : (
                <Icon
                  name="send"
                  size={20}
                  color={GlobalStyles.Colors.primary100}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  disputeCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loanIdLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disputeAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  disputeAmountLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
  },
  disputeAmountValue: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  claimsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  claimRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  claimLabel: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 13,
    width: 70,
  },
  claimText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    flex: 1,
  },
  resolveButton: {
    backgroundColor: GlobalStyles.Colors.primary400,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  resolveButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: GlobalStyles.Colors.primary200,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyMessagesText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
