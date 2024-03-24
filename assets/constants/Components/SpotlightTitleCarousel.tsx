import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import {SpotlightStackParamList} from '../../../App';
import { AppState } from '../../../ReduxStore';
import GlobalStyles from '../colors';

interface GroupItem {
  title: string;
  // Include other properties of GroupItem if there are any
}

// Then define CustomTitleProps using GroupItem
interface CustomTitleProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
  data: GroupItem[];
}

export const CustomTitle: React.FC<CustomTitleProps> = ({
  title,
  buttonText,
  onButtonPress,
  data,
}) => {

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

interface ImageData {
  url: string;
  tag?: string;
}

interface CustomCarouselProps {
  images: ImageData[];
}

export const CustomCarousel: React.FC<CustomCarouselProps> = ({data}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const navigation =
    useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = React.useCallback(
    ({viewableItems}: OnViewableItemsChangedInfo) => {
      setCurrentIndex(viewableItems[0]?.index || 0);
    },
    [],
  );

  const handleButtonPress = (itemData: ImageData) => {
    console.log('Button Pressed with data', itemData);
    navigation.navigate('GroupDetailsScreen', {itemData});
  };

  return (
    <View style={{left: 20}}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleButtonPress(item)}
            style={{opacity: 0.8}} // Set the desired opacity
          >
            <View style={styles.carouselItemWithBackground}>
              {/* Text information */}
              <Text style={styles.carouselTitle}>{item.title}</Text>
              <Text style={styles.carouselDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{marginBottom: 24}}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
      />
      <View style={styles.indicatorContainer}>
        {data.map((item: GroupItem, index: number) => (
          <View
            key={index}
            style={{
              ...styles.indicator,
              backgroundColor:
                currentIndex === index
                  ? GlobalStyles.Colors.primary210
                  : 'rgba(256, 256, 256, 0.1)',
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '90%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    color: GlobalStyles.Colors.primary100,
  },
  button: {
    height: 24,
    width: 95,
    backgroundColor: GlobalStyles.Colors.primary200, // Change as needed
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14, // Change as needed
    textAlign: 'center',
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary100,
  },
  carouselItem: {
    backgroundColor: '#f9f9f9', // Change as needed
    width: 300, // or your defined width
    height: 162, // or your defined height
    borderRadius: 20, // or your defined borderRadius
    marginRight: 8,
  },
  carouselImage: {
    flex: 1,
  },
  tagContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    height: 24,
    width: 94,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(	246,	244,	244, 0.1)', // Adjust as needed
    borderRadius: 6,
  },
  tagText: {
    color: '#fff', // Adjust as needed
    textAlign: 'center',
    fontSize: 14,
  },
  indicator: {
    height: 2,
    width: 300 / 5, // Assuming you have 5 images, adjust accordingly
    borderRadius: 1,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 8,
    width: '90%',
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#666',
  },
  carouselItemWithBackground: {
    backgroundColor: '#fff', // White background
    width: 300, // or your defined width
    height: 162, // or your defined height
    borderRadius: 20, // or your defined borderRadius
    marginRight: 8,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
});
