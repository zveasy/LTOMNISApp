import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar, Divider} from 'react-native-elements';
import GlobalStyles from '../colors';


type RowProps = {
  leftText: string;
  rightText: string;
};

const Row: React.FC<RowProps> = ({leftText, rightText}) => (
  <View style={[styles.row, {marginVertical: 5}]}>
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

type CustomPaymentBlockProps = {
  data: Array<RowData | DividerData>;
  firstname: string;
  lastname: string;
  status: OfferStatus;
};

export type OfferStatus =
  | 'Closed'
  | 'Pending'
  | 'Accepted'
  | 'Not paid'
  | 'In processing'
  | 'Paid';

const getStatusStyle = (status: OfferStatus) => {
  return statusStyles[status];
};

const statusStyles = {
  Closed: {backgroundColor: '#B9B9B9', color: 'white'},
  Pending: {backgroundColor: '#B9B9B9', color: 'white'},
  Accepted: {backgroundColor: '#3EA387', color: 'white'},
  'Not paid': {backgroundColor: '#F43636', color: 'white'},
  'In processing': {backgroundColor: '#B9B9B9', color: 'white'},
  Paid: {backgroundColor: '#3EA387', color: 'white'},
};

const CustomPaymentBlock: React.FC<CustomPaymentBlockProps> = ({
  data,
  firstname,
  lastname,
  status,
}) => {
  // Calculate the total amount based on payments received
  const paymentsReceived = (data || []).filter(item => 'isDivider' in item).length;
  const totalAmount = paymentsReceived * 10; // Assuming $10 per payment

  // Determine if the payment is "Paid" based on the remaining amount
  const remainingAmount = 850 - totalAmount; // Replace 850 with your desired total amount
  const isPaid = remainingAmount === 0;

  // Define the text colors based on payment status
  const totalAmountTextColor = isPaid ? 'black' : 'red';

  const avatarImage = ''; // Assuming you'd get this from props or somewhere else
  const firstNameLetter = firstname ? firstname.charAt(0) : '';
  const lastNameLetter = lastname ? lastname.charAt(0) : '';
  
  

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
            {firstname} {lastname}
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
          return <View key={index} style={styles.divider} />;
        } else {
          return (
            <Row
              key={index}
              leftText={item.leftText}
              rightText={item.rightText}
            />
          );
        }
      })}
      <Divider width={1} color={GlobalStyles.Colors.accent250} style={{ width: '98%', alignSelf: 'center' }} />
      <Row
        leftText="Total"
        rightText={`$${totalAmount} / $${remainingAmount}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: GlobalStyles.Colors.primary120,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-around',
    marginVertical: 10,
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
    backgroundColor: 'rgba(46, 34, 22, 0.06)',
    marginVertical: 5,
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
    fontFamily: 'San Francisco',
    fontWeight: '500',
    color: GlobalStyles.Colors.primary210,
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
});

export default CustomPaymentBlock;
