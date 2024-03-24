import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles from '../colors';
import OfferDetailSectionLender from './OfferDetailSectionLender';
import {OfferStatus, getStatusStyle} from './ClosedOfferBigContainer';
import CustomRow from './CustomRow';
import StarCircle from './Buttons/StarCircle';
import { HomeStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

interface MediumBigContainerTwoProps {
  title: string;
  firstName: string;
  lastName: string;
  avatarImage: string;
  userName: string;
  amount: number;
  interest: number;
  targetScreen: string;
  timeElapsed: string;
  postId: string;
  status: string;
};

const MediumBigContainerTwo: React.FC<MediumBigContainerTwoProps> = ({
  title,
  firstName,
  lastName,
  avatarImage,
  userName,
  amount,
  interest,
  timeElapsed,
  postId,
  status,
  targetScreen,
}) => {
  const formattedAmount = amount?.toLocaleString() || '0';
  const navigation =
  useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainerTitle}>
        <Text style={styles.TitleOfferLeftText}>{title}</Text>
        <View style={[styles.statusChip, getStatusStyle(status)]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={{width: '100%', alignSelf: 'center'}}>
        <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
          <CustomRow
            leftText="Lent out"
            rightText="$3,000"
            //   icon={<YourIconComponent />}  // Add your desired icon component here, if needed
          />
          <CustomRow leftText="Interest rate" rightText="3%" />
          <CustomRow leftText="Payed back" rightText="$60" />
          <CustomRow
            leftText="Points collected"
            customRight={
              <View style={styles.pointsContainer}>
                <StarCircle
                  iconName="star-four-points-outline"
                  height={16}
                  width={16}
                />
                <Text style={styles.rightText}>150</Text>
              </View>
            }
          />
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => { navigation.navigate('ClosedOfferGiftAccepted')
            }}>
            <Text style={styles.detailButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MediumBigContainerTwo;

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
  TitleOfferLeftText: {
    fontSize: 18,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
    color: GlobalStyles.Colors.primary200,
  },
  statusChip: {
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  detailButton: {
    width: '100%',
    height: 40,
    backgroundColor: GlobalStyles.Colors.primary200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: GlobalStyles.Colors.primary510,
  },
});
