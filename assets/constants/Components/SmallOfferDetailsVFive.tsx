import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles from '../colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar} from 'react-native-elements';

type WordWithIcon = {
  text: string;
  icon?: string;
};

type Participant = {
  name: string;
  avatarUri?: string;
};

type Props = {
  title: string;
  rightWords?: WordWithIcon[];
  participants?: Participant[];
};

const DEFAULT_RIGHT_WORDS: WordWithIcon[] = [
  {text: 'Zak Veasy'},
  {text: '01.02.2024'},
  {text: '34'},
  {text: '$171.23'},
];

const LEFT_WORDS = ['5 participants', 'Undefined', 'Private', 'Regular'];

const SmallOfferDetailsVFive: React.FC<Props> = ({
  title,
  rightWords = DEFAULT_RIGHT_WORDS,
  participants = [],
}) => {
  const viewStatement = true;
  const renderAvatars = (participants: Participant[]) => {
    return participants.map((participant, idx) => {
      const initials = participant.name
        .split(' ')
        .map(word => word[0])
        .join('');

      return (
        <Avatar
          key={idx}
          size={24}
          title={initials}
          titleStyle={{fontWeight: '700', fontSize: 9}}
          rounded
          source={
            participant.avatarUri ? {uri: participant.avatarUri} : undefined
          }
          overlayContainerStyle={{backgroundColor: GlobalStyles.Colors.primary210,}}
          containerStyle={{
            marginLeft: idx === 0 ? 0 : -4,
            borderWidth: 1,
            borderColor: 'white',
            borderStyle: 'solid',
          
          }}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* ... rest of your component */}
      {LEFT_WORDS.map((leftWord, index) => {
        const icon = rightWords[index]?.icon;
        let rightWordText = rightWords[index]?.text;

        // Check if it's 'Undefined' and viewStatement is true
        if (leftWord === 'Undefined' && viewStatement) {
          // You can add your logic here to determine numeric values
          if (index === 1) {
            // For the 'Needed amount / Paid' field
            leftWord = '$800 / $20'; // Set your numeric values here
          } else {
            // For other fields, if needed
            leftWord = 'Numeric Value'; // Set your numeric values here
          }
        }

        return (
          <View key={index} style={{marginVertical: 10}}>
            <View style={styles.row}>
              <Text style={styles.leftWord}>{leftWord}</Text>
              <View style={styles.rightWordContainer}>
                {leftWord === '5 participants' ? (
                  renderAvatars([
                    {name: 'Zak Veasy'},
                    {name: 'John D'},
                    {name: 'Jane D'},
                    {name: 'Mike L'},
                    {name: 'Anna K'},
                  ])
                ) : (
                  <Text style={styles.rightWord}>
                    {leftWord === 'Needed amount' ? '$' : ''}
                    {rightWordText}
                  </Text>
                )}
                {icon && (
                  <MaterialCommunityIcons
                    name={icon}
                    size={14}
                    color={GlobalStyles.Colors.primary200}
                  />
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    padding: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.Colors.primary200,
    marginBottom: 20,
  },
  leftWord: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary510,
    fontWeight: '700',
  },
  rightWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWord: {
    fontSize: 14,
    color: GlobalStyles.Colors.accent300,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SmallOfferDetailsVFive;
