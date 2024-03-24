import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../assets/constants/colors';

interface FAQDropdownProps {
  title: string;
  content: string; 
  onPress: () => void;
  isActive: boolean;
}

const FAQDropdown: React.FC<FAQDropdownProps> = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <View style={[styles.container, isActive ? styles.activeContainer : styles.inactiveContainer]}>
      <TouchableOpacity style={styles.header} onPress={() => setIsActive(!isActive)}>
        <Text style={[styles.title, { color: isActive ? GlobalStyles.Colors.primary210 : GlobalStyles.Colors.primary800 }]}>{title}</Text>
        <Icon name="add" size={24} color={isActive ? GlobalStyles.Colors.primary210 : GlobalStyles.Colors.primary800} />
      </TouchableOpacity>
      {isActive && (
        <View style={styles.dropdownContent}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 16,
    padding: 10,
    marginVertical: 10,
  },
  inactiveContainer: {
    height: 46,
  },
  activeContainer: {
    height: 'auto', // this will make the height adjust based on content
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: '600',
  },
  dropdownContent: {
    paddingTop: 10,
  },
  content: {
    fontSize: 12,
    color: 'black',
  },
});

export default FAQDropdown;
