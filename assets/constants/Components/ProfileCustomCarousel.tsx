import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Animated} from 'react-native';
import GlobalStyles from '../colors';
import ScrollingBarComponent from './Buttons/ScrollingBarComponent';
import StarCircle from './Buttons/StarCircle';

interface ImageData {
  url: string;
  text?: string;
  isTopLender?: boolean; // new property
}

interface ProfileCustomCarouselProps {
  images: ImageData[];
}

export const ProfileCustomCarousel: React.FC<ProfileCustomCarouselProps> = ({
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(new Animated.Value(0));
  const individualBarWidth = 300 / images.length;

  const flatListRef = React.useRef(null);

  const totalWidth = images.length * 80; // 80 is the width of each item + margin (adjust as necessary)
  const flatListWidth = 400; // Adjust with the actual width of your FlatList
  const highlightedWidth = flatListWidth * 0.4;

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollPosition}}}],
    {useNativeDriver: false},
  );

  const formatText = (text?: string) => {
    if (text && text.length > 7) {
      return text.slice(0, 7) + '...';
    }
    return text || 'Default Text';
  };

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: any[]}) => {
      setCurrentIndex(viewableItems[0]?.index || 0);
    },
    [],
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({item, index}) => (
          <View style={styles.imageContainer}>
            <View
              style={[
                styles.imageWrapper,
                item.isTopLender ? styles.topLenderImage : null,
              ]}>
              <Image source={{uri: item.url}} style={styles.image} />
              {item.isTopLender && (
                <View style={styles.starCircle}>
                  <StarCircle
                    iconName="star-four-points-outline"
                    height={20}
                    width={20}
                  />
                </View>
              )}
            </View>
            <Text style={styles.text}>{formatText(item.text)}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      />
      <View style={styles.barContainer}>
        <ScrollingBarComponent
          scrollPosition={scrollPosition}
          totalWidth={totalWidth}
          flatListWidth={flatListWidth}
          highlightedWidth={highlightedWidth}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  imageWrapper: {
    position: 'relative',
    height: 76, // Increase the height and width of the wrapper
    width: 76,
    borderRadius: 100,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 74,
    width: 74,
    borderRadius: 100,
  },
  topLenderImage: {
    borderWidth: 10,
    borderColor: GlobalStyles.Colors.primary200,
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
    borderRadius: 10,
  },
  bar: {
    height: 2,
    borderRadius: 10,
  },
  starCircle: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
