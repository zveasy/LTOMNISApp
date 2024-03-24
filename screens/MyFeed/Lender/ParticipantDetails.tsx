import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import GlobalStyles from '../../../assets/constants/colors';

type Participant = {
  name: string;
  avatarUri?: string;
};

type ParticipantDetailsProps = {
  participants: Participant[];
  textColor?: string;
  borderColor?: string;
  type?: string; // add a new prop for type
};

export const ParticipantDetails: React.FC<ParticipantDetailsProps> = ({
  participants,
  textColor,
  borderColor,
  type = 'participants', // default value as participants
}) => {
  const renderAvatars = () => {
    return participants.map((participant, idx) => {
      const initials = participant.name
        ? participant.name
            .split(' ')
            .map(word => word[0])
            .join('')
        : 'NA';
      return (
        <Avatar
          key={idx}
          size={24}
          title={initials}
          rounded
          source={
            participant.avatarUri ? {uri: participant.avatarUri} : undefined
          }
          overlayContainerStyle={{backgroundColor: 'gray'}}
          containerStyle={{
            marginLeft: idx === 0 ? 0 : -4,
            borderWidth: 1,
            borderColor: borderColor || GlobalStyles.Colors.primary100,
            borderStyle: 'solid',
          }}
        />
      );
    });
  };

  return (
    <View style={styles.participantContainer}>
      <View style={styles.avatarContainer}>{renderAvatars()}</View>
      <Text
        style={[
          styles.participantText,
          {color: textColor || GlobalStyles.Colors.primary100},
        ]}>{`${participants.length} ${type}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    marginLeft: 10,
    fontSize: 14,
    flexWrap: 'wrap'
  },
});
