import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../colors';
import GlobalFonts from '../fonts';
import {LinearProgress} from '@rneui/themed';
import OfferDetailSection, {
  OfferDetailSectionProps,
} from './OfferDetailSection';
import {t} from 'i18next';
import {AppState} from '../../../ReduxStore';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {FlatList} from 'react-native-gesture-handler';
import PostOfferList, {PostType} from './PostOfferList';
import {AsyncLocalStorage} from 'async_hooks';

type User = {
  firstNameLetter?: string;
  lastNameLetter?: string;
  userName?: string;
  interest?: number;
  amount?: number;
};

export type OfferBigContainerProps = {
  currentAmount?: number;
  startPayDate?: any;
  monthlyPayment?: number;
  offerId: string;
  fullNumber: number;
  totalAmount?: number;
  targetScreen?: string;
  timeElapsed?: string;
  interestPercentage?: number;
  avatar?: string;
  number?: number;
  description?: string;
  imageUrl?: string;
  offerText?: string;
  id?: string;
  title?: number;
  monthDuration?: number;
  onSelect?: (planDetails: OfferBigContainerProps) => void;
  users: User[];
  isSelected?: boolean;
};

const OfferBigContainer: React.FC<OfferBigContainerProps> = ({
  title,
  currentAmount,
  totalAmount,
  targetScreen,
  id,
}) => {
  const userId = useSelector((state: AppState) => state.user.userId); // Only declaration of userId

  const token = useSelector((state: AppState) => state.token);
  const [activeData, setActiveData] = useState<PostType[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [numOfOffers, setNumOfOffers] = useState<number[]>([]);

  // This http://localhost:8080/api/omnis/posts/borrower ISSUE

  const fetchOfferDetails = async () => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    try {
      const options = {
        method: 'GET',
        url: `http://localhost:8080/api/omnis/posts/borrower`,
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      const res = await axios(options);
      if (res.data && res.data.borrowerPostList) {
        setActiveData(res.data.borrowerPostList);
        console.log('this object', activeData)
      } else {
        console.log('No data received');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    fetchOfferDetails();
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  return (
    <View style={styles.container}>
      {activeData.slice(0, visibleCount).map((post: PostType) => (
        <PostOfferList key={post.id} post={post} />
      ))}
      {visibleCount < activeData.length && (
        <TouchableOpacity
          onPress={handleShowMore}
          style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default OfferBigContainer;

const styles = StyleSheet.create({
  container: {
    width: 343,
    backgroundColor: GlobalStyles.Colors.primary100,
    borderRadius: 20,
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
  showMoreButton: {
    // Add styles for the "Show More" button
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#E8E8E8', // Example color
    borderRadius: 5,
    marginVertical: 10,
  },
  showMoreText: {
    // Style for the "Show More" text
    color: '#000', // Example color
  },
});
