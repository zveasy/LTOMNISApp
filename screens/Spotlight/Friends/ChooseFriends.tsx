import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import SearchTextBox from '../../../assets/constants/Components/Buttons/SearchTextBox';
import FriendList from '../../../assets/constants/Components/FriendList';
import SuggestedOptions from '../../../assets/constants/Components/SuggestedOptions';

export default function ChooseFriends() {
    const suggestedUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2', avatarImage: 'https://example.com/avatar2.jpg' },
        { id: '3', name: 'User 1' },
        { id: '4', name: 'User 2', avatarImage: 'https://example.com/avatar2.jpg' },

        { id: '5', name: 'User 1' },
        { id: '6', name: 'User 2', avatarImage: 'https://example.com/avatar2.jpg' },

        { id: '7', name: 'User 1' },
        { id: '8', name: 'User 2', avatarImage: 'https://example.com/avatar2.jpg' },

        // Add more suggested users as needed
      ];

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Choose participants"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <SearchTextBox />
      <View style={{ width: '100%', paddingTop: 24, paddingBottom: 10 }} >
                <SuggestedOptions suggestedUsers={suggestedUsers} />

      </View>
      <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
        <FriendList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
    paddingVertical: 40,
  },
});
