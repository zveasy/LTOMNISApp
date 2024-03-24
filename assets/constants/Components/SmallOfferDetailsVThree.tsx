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
  avatarUri?: string; // For future use if you want to display an image
};

type Props = {
  title: string;
  rightWords?: WordWithIcon[];
  participants?: Participant[]; // Add a prop for participants
};

const DEFAULT_RIGHT_WORDS: WordWithIcon[] = [
  {text: 'Zak Veasy'},
  {text: '01.02.2024'},
  {text: '34'},
  {text: '$171.23'},
  // ... Add other default values as needed
];

const LEFT_WORDS = [
  '5 participants',
  'Closing Date',
  'Number of payments',
  'Total payback amount',
];

const SmallOfferDetailsVThree: React.FC<Props> = ({
  title,
  rightWords = DEFAULT_RIGHT_WORDS,
  participants = [], // default is an empty array
}) => {
  const renderAvatars = (participants: Participant[]) => {
    return participants.map((participant, idx) => {
      const initials = participant.name
        ? participant.name
            .split(' ')
            .map(word => word[0])
            .join('')
        : 'ZV'; // Default initials

      return (
        <Avatar
          key={idx}
          size={24}
          title={initials}
          rounded
          // Use avatarUri if available, else use the initials
          source={
            participant.avatarUri ? {uri: participant.avatarUri} : undefined
          }
          overlayContainerStyle={{backgroundColor: 'gray'}}
          containerStyle={{
            marginLeft: idx === 0 ? 0 : -4,
            borderWidth: 1,
            borderColor: '#1E1E1E',
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
                  <Text style={styles.rightWord}>{rightWordText}</Text>
                )}
                {icon && (
                  <MaterialCommunityIcons
                    name={icon}
                    size={14}
                    color={GlobalStyles.Colors.primary100}
                  />
                )}
              </View>
            </View>
            {index !== LEFT_WORDS.length - 1 && <View style={styles.divider} />}
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
    color: GlobalStyles.Colors.primary100,
    marginBottom: 20,
  },
  leftWord: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary100,
  },
  rightWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWord: {
    fontSize: 14,
    color: GlobalStyles.Colors.primary100,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: 'grey',
    marginTop: 5, // Optional: Adjust spacing as per your design needs
  },
});

export default SmallOfferDetailsVThree;
