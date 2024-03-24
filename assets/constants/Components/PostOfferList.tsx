import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {t} from 'i18next';
import GlobalStyles from '../colors';
import GlobalFonts from '../fonts';
import {LinearProgress} from '@rneui/themed';
import OfferDetailSection, {
  OfferDetailSectionProps,
} from './OfferDetailSection';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';

export type PostType = {
  id: string;
  title: string;
  description: string;
  totalAmount: number;
  currentAmount: number;
  featured: boolean;
  financed: boolean;
  numOfOffers: number;
  offers: OfferType[];
  user: UserType;
};

export type OfferType = {
  id: string;
  amount: number;
  interestPercentage: number | 'Gift';
  accepted: boolean;
  user: UserType;
};

export type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance?: string;
};

const INITIAL_OFFER_COUNT = 2;

const PostOfferList: React.FC<{post: PostType}> = ({post}) => {
  const progress = post.currentAmount / post.totalAmount;
  const [visibleOffersCount, setVisibleOffersCount] =
    useState(INITIAL_OFFER_COUNT);

  // Define the custom sort function outside the map
  const sortOffersByInterest = (a: OfferType, b: OfferType) => {
    // Check if either interestPercentage is 'Gift'
    const isAGift = a.interestPercentage === 'Gift';
    const isBGift = b.interestPercentage === 'Gift';

    if (isAGift && isBGift) return 0;
    if (isAGift) return -1;
    if (isBGift) return 1;

    // Now it's safe to assume both are numbers and perform arithmetic operation
    return a.interestPercentage - b.interestPercentage;
  };

  // First sort the offers, then map to add additional properties
  const modifiedOffers = post.offers.sort(sortOffersByInterest).map(offer => ({
    ...offer, // Spread existing properties of the offer
    postCurrentAmount: post.currentAmount, // Add currentAmount to each offer
    postTotalAmount: post.totalAmount, // Add postTotalAmount to each offer
  }));

  const handleShowMore = () => {
    if (visibleOffersCount > INITIAL_OFFER_COUNT) {
      setVisibleOffersCount(INITIAL_OFFER_COUNT);
    } else {
      setVisibleOffersCount(modifiedOffers.length); // Show all modified offers
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.innerContainerTitle}>
        <Text style={styles.TitleOfferText}>{post.title}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.TitleOfferText}>{post.numOfOffers}</Text>
          <Text style={styles.TitleOfferText}> offers</Text>
        </View>
      </View>
      <View style={styles.innerContainerBar}>
        <View>
          <Text style={styles.amountText}>{`$${post.currentAmount}`}</Text>
        </View>
        <View>
          <Text style={styles.amountText}>{`$${post.totalAmount}`}</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <LinearProgress
          style={styles.progressBar}
          value={progress}
          variant="determinate"
          color={GlobalStyles.Colors.primary200}
        />
      </View>
      <FlatList
    style={{backgroundColor: GlobalStyles.Colors.primary120}}
    data={modifiedOffers.slice(0, visibleOffersCount)} // Use modifiedOffers here
    renderItem={({ item }) => (
      <OfferDetailSection
        targetScreen="OfferDetailsScreen"
        firstName={item.user.firstName}
        lastName={item.user.lastName}
        totalAmount={item.amount}
        interestPercentage={
          item.interestPercentage === 'Gift' ? 0 : item.interestPercentage
        }
        avatar={item.user.avatar}
        offerId={item.id}
        currentAmount={item.currentAmount}
        postTotalAmount={item.postTotalAmount}
        postCurrentAmount={item.postCurrentAmount}
      />
    )}
    keyExtractor={(item, index) => index.toString()}
  />
      <TouchableOpacity onPress={handleShowMore} style={styles.showMoreButton}>
        <Text style={styles.showMoreText}>
          {visibleOffersCount > INITIAL_OFFER_COUNT ? 'Show Less' : 'Show More'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 343,
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    marginTop: 16,
    paddingBottom: 20,
  },
  innerContainerTitle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 32,
    justifyContent: 'space-between',
  },
  innerContainerBar: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  TitleOfferText: {
    fontSize: 18,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '92%',
    height: 18,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(120,	120, 128, 0.08)',
    alignSelf: 'center',
  },
  progressBar: {
    marginVertical: 4,
    borderRadius: 10,
    height: 10,
    width: '98%',
  },
  amountText: {
    color: GlobalStyles.Colors.primary200,
    fontFamily: 'San Francisco',
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    // styles for the FlatList content container
  },
  showMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#E8E8E8', // Example color
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  showMoreText: {
    color: GlobalStyles.Colors.primary900, // Example color
  },
});

export default PostOfferList;
