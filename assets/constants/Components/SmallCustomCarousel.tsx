import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { SpotlightStackParamList } from '../../../App';

export interface GroupItem {
  id: string;
  title: string;
  url?: string;
  // other properties...
}

interface SmallCustomCarouselProps {
  data: GroupItem[];
}

export const SmallCustomCarousel: React.FC<SmallCustomCarouselProps> = ({ data }) => {
  const navigation = useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();

  return (
    <View style={{ marginLeft: 10 }} >
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('GroupDetailsHistoryScreen')}
            style={styles.imageContainer}>
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.image} />
            ) : (
              <View style={styles.carouselItemWithBackground}>
                <Text style={styles.carouselTitle}>{item.title}</Text>
              </View>
            )}
          </Pressable>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  image: {
    height: 74,
    width: 74,
    borderRadius: 16,
    marginBottom: 5,
  },
  text: {
    marginTop: 5,
    fontSize: 12,
    color: 'rgba(256,256,256,0.6)',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  bar: {
    height: 2,
    borderRadius: 1,
    marginHorizontal: 2,
  },
  carouselItemWithBackground: {
    backgroundColor: 'rgba(256,256,256,0.8)',
    width: 300, // or your defined width
    height: 162, // or your defined height
    borderRadius: 20, // or your defined borderRadius
    marginRight: 8,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
});
