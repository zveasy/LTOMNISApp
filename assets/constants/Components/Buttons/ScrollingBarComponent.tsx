import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import GlobalStyles from '../../colors';

interface GroupItem {
  id: string;
  title: string;
  // other properties...
}

interface ScrollingBarComponentProps {
  data: GroupItem[];
}

const ScrollingBarComponent: React.FC<ScrollingBarComponentProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {/* Add other item details here */}
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: GlobalStyles.Colors.primary210,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: '#fff',
  },
  // Add other styles as needed
});

export default ScrollingBarComponent;
