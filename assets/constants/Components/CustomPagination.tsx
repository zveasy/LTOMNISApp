import {Pressable, View} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import GlobalStyles from '../colors';

interface CustomPaginationProps {
    total: number;
    current: number;
    onDotPress: (index: number) => void;
  }
  
  const CustomPagination: React.FC<CustomPaginationProps> = ({ total, current, onDotPress }) => {
    return (
      <View style={styles.container}>
        {Array.from({ length: total }, (_, index) => (
          <Pressable key={index} onPress={() => onDotPress(index)}>
            <View
              style={[
                styles.dot,
                current === index ? styles.activeDot : null,
              ]}
            />
          </Pressable>
        ))}
      </View>
    );
  };
  
  // styles remain the same
  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    bottom: '20%',
    paddingLeft: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GlobalStyles.Colors.primary110,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: GlobalStyles.Colors.primary210,
  },
});

export default CustomPagination;
