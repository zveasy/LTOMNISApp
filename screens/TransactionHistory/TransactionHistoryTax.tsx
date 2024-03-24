import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../../assets/constants/colors';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import ListItemWithRadial, {
  ListItemProps,
} from '../../assets/constants/Components/ListItemWithRadial';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';
import {hideTabBar, showTabBar} from '../../tabBarSlice';
// import { hideTabBar, showTabBar } from '../../appReducer';

const TransactionHistoryTax: React.FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const dispatch = useDispatch();
  const firstName = useSelector(
    (state: AppState) => state.userFirstLast.firstName,
  );

  const formatCurrency = (value: string) => {
    // First, remove any currency symbols and plus signs to get a clean numeric string
    const numericValue = value.replace(/[\$,+]/g, '').trim();

    // Convert the cleaned string to a number
    const amount = parseFloat(numericValue);

    if (isNaN(amount)) {
        console.error(`Invalid currency value: ${value}`);
        return value; // Return the original string if it cannot be converted
    }

    // Use Intl.NumberFormat to format the amount as a currency string
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);

    // Check if the original value was positive and ensure to add a plus sign if so
    return value.trim().startsWith('-') ? formattedAmount : `+${formattedAmount}`;
};



  // Data array
  const data: ListItemProps[] = [
    {
      radialType: 'radio',
      iconName: 'coffee',
      topTextLeft: 'Transfer to Zak Veasy',
      topTextRight: '-$171.23',
      bottomTextLeft: 'Pending',
      bottomTextRight: '06.23.2024 14:00',
    },
    {
      radialType: 'radio',
      topTextLeft: 'Transfer to Zak Veasy',
      topTextRight: '+$100.00',
      bottomTextLeft: 'Completed',
      bottomTextRight: '05.20.2024 11:15',
    },
    {
      radialType: 'radio',
      imagePath: 'path_to_some_image',
      topTextLeft: 'Transfer to Zak Veasy',
      topTextRight: '+$58.75',
      bottomTextLeft: 'Failed',
      bottomTextRight: '04.29.2024 09:45',
    },
    {
      radialType: 'radio',
      iconName: 'shopping-cart',
      topTextLeft: 'Transfer to Zak Veasy',
      topTextRight: '-$89.50',
      bottomTextLeft: 'Pending',
      bottomTextRight: '06.15.2024 16:30',
    },
    {
      radialType: 'radio',
      iconName: 'dollar-sign',
      topTextLeft: 'Transfer to Zak Veasy',
      topTextRight: '+$2000',
      bottomTextLeft: 'Completed',
      bottomTextRight: '06.01.2024 12:00',
    },
  ];

  // Process the data using the function
  const processedData = data.map(item => ({
    ...item,
    topTextRight: formatCurrency(item.topTextRight),
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/transactions/mytransactions`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        // Assuming the response structure matches your logged data
        const transactionHistoryData = response.data.myTransactions;

        console.log("this is Trnasaction", response.data.myTransactions)

        const mappedData = transactionHistoryData.map(transaction => {
          const isCurrentUserTheBorrower = transaction.borrowerFirstName === firstName;
          

          const sign = isCurrentUserTheBorrower ? '+' : '-';
          const formattedAmount = transaction.amount;


          // Set the text color based on the condition
          const textColor = isCurrentUserTheBorrower ? 'green' : 'red';

          return {
            radialType: 'radio', // Or other logic for setting the radial type
            iconName: '', // Determine if you need an icon and set accordingly
            topTextLeft: `Transfer to ${transaction.lenderFirstName} ${transaction.lenderLastName}`,
            topTextRight: `${sign}${formattedAmount}`,
            topTextRightStyle: {color: textColor}, // Assuming your ListItemWithRadial supports this
            bottomTextLeft: 'Completed', // Adjust based on actual transaction status
            bottomTextRight: new Date(transaction.timestamp).toLocaleString(),
          };
        });

        setTransactionHistory(mappedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        title="Offer Transaction History"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <FlatList
            data={transactionHistory} // Use the state variable that holds the processed transactions
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItemWithRadial {...item} />}
          />
        </View>
      </View>
      <CompleteButton
        text="Download Summary"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  contentContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: GlobalStyles.Colors.primary100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
  },
  container: {
    width: '100%',
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default TransactionHistoryTax;
