import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../ReduxStore';
import GlobalStyles from '../../colors';
import _ from 'lodash';

const SearchTextBox = ({ placeholder = "Search", onSearch, ...props }) => {
  const [offersData, setOffersData] = useState();
  const token = useSelector((state: AppState) => state.token);

  // Debounced search function
  const debouncedSearch = useCallback(_.debounce(async (searchTerm) => {
    console.log('before the try friends/search?query', debouncedSearch)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/omnis/friends/search?query=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      setOffersData(response.data.potentialFriendsList);
      console.log('response.data friends/search?query', response.data)
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, 300), [token.token]); // Adjust debounce time as needed

  const handleSearch = (text: string) => {
    debouncedSearch(text);
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(offersData);
    }
  }, [offersData, onSearch]);


  return (
    <View style={styles.container}>
      <Icon name="search" size={16} color="white" style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor={GlobalStyles.Colors.accent100}
        onChangeText={handleSearch} 
        {...props} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    width: '90%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.accent100,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  icon: {
    marginRight: 8,
    color: GlobalStyles.Colors.accent100,
  },
  input: {
    color: 'white',
    flex: 1,
    fontSize: 15
  },
});

export default SearchTextBox;
