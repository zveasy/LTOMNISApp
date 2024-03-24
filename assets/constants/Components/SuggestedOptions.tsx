import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Avatar} from 'react-native-elements';
import GlobalStyles from '../colors';

interface SuggestedUser {
  id: string;
  name: string;
  avatarImage?: string;
}

interface SuggestedOptionsProps {
  suggestedUsers: SuggestedUser[];
  showNoRecentUsers?: boolean;
}

// Function to get initials from a name
const getInitials = (name: string) => {
  const parts = name.split(' ');
  const initials = parts.map(part => part.charAt(0)).join('');
  return initials;
};

const SuggestedOptions: React.FC<SuggestedOptionsProps> = ({
  suggestedUsers,
  showNoRecentUsers = true,
}) => {
  const renderSuggestedUserItem = ({item}: {item: SuggestedUser}) => {
    return (
      <View style={styles.suggestedUserContainer}>
        <Avatar
          size={55}
          rounded
          title={item.avatarImage ? undefined : getInitials(item.name)}
          source={item.avatarImage ? {uri: item.avatarImage} : undefined}
          overlayContainerStyle={{
            backgroundColor: GlobalStyles.Colors.primary100,
          }}
          titleStyle={{color: 'black', fontSize: 14, fontWeight: '700'}}
        />
        <Text style={styles.suggestedUserName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showNoRecentUsers && suggestedUsers.length === 0 && (
        <Text style={styles.noRecentUsersText}>No recent users</Text>
      )}
      {suggestedUsers.length > 0 && (
        <FlatList
          data={suggestedUsers}
          renderItem={renderSuggestedUserItem}
          keyExtractor={item => item.id}
          horizontal
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  suggestedUserContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  suggestedUserName: {
    marginTop: 8,
    color: GlobalStyles.Colors.primary100,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  noRecentUsersText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SuggestedOptions;
