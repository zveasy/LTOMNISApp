import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import GlobalStyles from '../colors';
import StarCircle from './Buttons/StarCircle';

type RowProps = {
  leftText: string;
  rightText: string;
};

const Row: React.FC<RowProps> = ({leftText, rightText}) => (
  <View style={styles.row}>
    <Text style={styles.leftText}>{leftText}</Text>
    <Text style={styles.rightText}>{rightText}</Text>
  </View>
);

type RowData = {
  leftText: string;
  rightText: string;
};

type DividerData = {
  isDivider: true;
};

type CustomOfferBlockProps = {
  data: Array<RowData | DividerData>;
  firstName: string;
  lastName: string;
  amount: number;
  interestPercentage: number;
  id: number;
  status: OfferStatus;
  createdAt: Date;
};

export type OfferStatus =
  | 'Closed'
  | 'Pending'
  | 'Accepted'
  | 'Not paid'
  | 'In processing'
  | 'Payed';

const getStatusStyle = (status: OfferStatus) => {
  return statusStyles[status];
};

const statusStyles = {
  Closed: {backgroundColor: '#B9B9B9', color: 'white'},
  Pending: {backgroundColor: '#B9B9B9', color: 'white'},
  Accepted: {backgroundColor: '#3EA387', color: 'white'},
  'Not paid': {backgroundColor: '#F43636', color: 'white'},
  'In processing': {backgroundColor: '#B9B9B9', color: 'white'},
  Payed: {backgroundColor: '#3EA387', color: 'white'},
};

const CustomOfferBlockWithProfile: React.FC<CustomOfferBlockProps> = ({
  data,
  firstName,
  lastName,
  amount,
  interestPercentage,
  id,
  createdAt,
  status,
}) => {
  const avatarImage = ''; // Assuming you'd get this from props or somewhere else
  const firstNameLetter = firstName.charAt(0);
  const lastNameLetter = lastName.charAt(0);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainerTitle}>
        <View
          style={{
            flexDirection: 'row',
            width: '34%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {avatarImage ? (
            <Avatar size={25} rounded source={{uri: avatarImage}} />
          ) : (
            <Avatar
              size={25}
              rounded
              title={`${firstNameLetter}${lastNameLetter}`}
              containerStyle={{backgroundColor: GlobalStyles.Colors.primary210}}
              titleStyle={{
                color: GlobalStyles.Colors.primary100,
                fontWeight: 'bold',
              }}
            />
          )}
          <Text style={styles.TitleOfferText}>
            {firstName} {lastName}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={[styles.statusChip, getStatusStyle(status)]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>
      {data.map((item, index) => {
    if ('isDivider' in item) {
        return null;
    }

    if (item.leftText === 'Points Collected' && item.rightText === '150') {
        return (
            <View key={index} style={styles.row}>
                <Text style={styles.leftText}>{item.leftText}</Text>
                <View style={styles.pointsContainer}>
                    <StarCircle iconName="star-four-points-outline" height={16} width={16} />
                    <Text style={[styles.rightText, { marginLeft: 5 }]}>{item.rightText}</Text>
                </View>
            </View>
        );
    } else {
        return (
            <Row key={index} leftText={item.leftText} rightText={item.rightText} />
        );
    }
})}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 190,
    width: '90%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    padding: 10, // This is to prevent words touching the sides
    justifyContent: 'space-around', // This brings the rows closer together
    marginVertical: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    fontSize: 14,
    color: GlobalStyles.Colors.accent300,
    fontFamily: 'San Francisco',
  },
  rightText: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary510,
    fontFamily: 'San Francisco',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(46, 34, 22, 0.06)', // or another color you want
    marginVertical: 5, // add space around the divider
  },

  innerContainerTitle: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  TitleOfferText: {
    fontSize: 18,
    fontFamily: 'San Francisco', // This will default to San Francisco on iOS.
    fontWeight: '500',
    color: GlobalStyles.Colors.primary210,
  },
  statusChip: {
    paddingHorizontal: 16, // Increase or adjust as desired
    borderRadius: 6, // Decrease for more rectangular, increase for more rounded
    marginLeft: 10, // This remains the same, it adds spacing between the number and the chip
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12, // adjust size as needed
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // To align the StarCircle and Row vertically
},
pointsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},

});

export default CustomOfferBlockWithProfile;
