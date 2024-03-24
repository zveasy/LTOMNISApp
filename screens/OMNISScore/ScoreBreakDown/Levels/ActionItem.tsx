import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import GlobalStyles from '../../../../assets/constants/colors';
import {Divider} from 'react-native-elements';
import StarCircle from '../../../../assets/constants/Components/Buttons/StarCircle';

type Status = 'gold' | 'silver' | 'bronze';

const ActionItem: React.FC<{
  text: string;
  isCompleted: boolean;
  status: Status;
}> = ({text, isCompleted, status}) => {
  const [isChecked, setChecked] = useState(isCompleted);

  // Conditionally change the text based on the status
  const statusText: Record<Status, string> = {
    gold: 'Gold Status Task: ',
    silver: 'Silver Status Task: ',
    bronze: 'Bronze Status Task: ',
  };

  return (
    <View
      style={{flexDirection: 'column', width: '100%', alignItems: 'center'}}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.pointsContainer}>
            <StarCircle
              iconName="star-four-points-outline"
              height={16}
              width={16}
            />
            <Text style={{left: 5, fontSize: 16, fontWeight: '500'}}>50</Text>
          </View>
          <Text style={styles.text}>
            {statusText[status]}
            {text}
          </Text>
        </View>

        <CheckBox
          value={isChecked}
          onValueChange={setChecked}
          onFillColor={GlobalStyles.Colors.primary200}
          onCheckColor={GlobalStyles.Colors.primary100}
          onTintColor={GlobalStyles.Colors.primary100}
        />
      </View>
      <View
        style={{flexDirection: 'column', width: '100%', alignItems: 'center'}}>
        <Divider
          width={1}
          color={GlobalStyles.Colors.accent250}
          style={{marginVertical: 5, width: '100%', alignItems: 'center'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});

// Example usage with FlatList
const ActionItemList: React.FC = () => {
  const data: {
    text: string;
    isCompleted: boolean;
    status: Status;
    key: string;
  }[] = [
    {
      text: 'Payback 10 loans on time',
      isCompleted: false,
      status: 'gold',
      key: '1',
    },
    {text: 'Item 2', isCompleted: true, status: 'silver', key: '2'},
    {text: 'Item 3', isCompleted: false, status: 'bronze', key: '3'},
    {text: 'Item 4', isCompleted: true, status: 'gold', key: '4'},
  ];

  // Filter data to keep only items with bronze status
  const bronzeData = data.filter(item => item.status === 'bronze');

  return (
    <FlatList
      data={bronzeData} // pass bronzeData instead of data
      renderItem={({item}) => (
        <ActionItem
          text={item.text}
          isCompleted={item.isCompleted}
          status={item.status}
        />
      )}
    />
  );
};

export default ActionItemList;
