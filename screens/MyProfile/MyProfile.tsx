import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {Avatar, Divider, Icon} from 'react-native-elements';
import {user as importedUser} from '../../assets/constants/user'; // Renamed to avoid naming conflicts
import GlobalStyles from '../../assets/constants/colors';
import StatisticItem from './StatisticItem';
import ButtonsRow from './ButtonsRow';
import GrayBox from './GrayBox';
import ImagePicker from 'react-native-image-picker';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../App';
import {RootStackParamList} from '../../types';

type ImagePickerMethod = (
  options: any, // Here you can replace 'any' with the correct type if known
  callback: (response: ImagePickerResponse) => void,
) => void; // This is the return type of the function, which is void in this case

export default function MyProfile() {
  const firstUser = importedUser[0];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const initials = firstUser.name
    ? firstUser.name
        .split(' ')
        .map(word => word[0])
        .join('')
    : 'ZV';

  const handleEditAvatar = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    const selectMethod = (method: ImagePickerMethod) => {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      };

      method(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          // Check for errorMessage instead of error
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets?.[0]?.uri;
          if (uri) {
            const source = {uri};
            // Here you can set the selected image to state and display or upload as needed
          } else {
            console.log('No image uri found');
          }
        }
      });
    };

    // You can use any UI element or approach to ask the user
    // Here's a simple way using an Alert for demonstration
    Alert.alert('Select Avatar', 'Choose the source of the image', [
      {
        text: 'Camera',
        onPress: () => selectMethod(launchCamera),
      },
      {
        text: 'Gallery',
        onPress: () => selectMethod(launchImageLibrary),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle
        showBackArrow={true}
        showRightIcon={true}
        rightIconType="Feather"
        rightIconName="user-plus"
        onRightIconPress={() => {}}
      />
      <View style={styles.avatarContainer}>
        <Avatar
          size={80}
          rounded
          title={!firstUser.avatarUri ? initials : undefined}
          source={firstUser.avatarUri ? {uri: firstUser.avatarUri} : undefined}
          overlayContainerStyle={{backgroundColor: 'gray'}}
          containerStyle={{width: 80, height: 80}}
        />
        <Icon
          name="edit-2"
          type="feather"
          color={GlobalStyles.Colors.primary200}
          size={10}
          containerStyle={styles.editIcon}
          onPress={handleEditAvatar}
        />
      </View>
      <View
        style={{marginTop: 10, flexDirection: 'column', alignItems: 'center'}}>
        <Text style={styles.nameTitle}>Zakariya Veasy</Text>
        <Text style={styles.usernameTitle}>@easy</Text>
      </View>
      <View>
        <View style={styles.statisticsContainer}>
          <StatisticItem value="12" label="Friends" />
          <VerticalDivider />
          <StatisticItem value="80" label="Score" />
          <VerticalDivider />
          <StatisticItem
            label="Status"
            lottieSource={require('../../assets/goldBar.json')}
          />
        </View>
        <ButtonsRow
          leftButtonText="Edit Profile"
          rightButtonText="Share Profile"
          onLeftButtonPress={() => {
            console.log(navigation.navigate('EditProfile'));
          }}
          onRightButtonPress={() => {
            console.log('Right button pressed');
          }}
          isLeftButtonActive={true} // or false based on your state
          isRightButtonActive={true} // or true based on your state
        />
      </View>
      <View
        style={{
          borderRadius: 24,
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
          padding: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SpotlightStackNavigator', {
              screen: 'AddFriendScreen',
            });
          }}>
          <GrayBox iconName="users" label="Friends" iconType="feather" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FeedStackNavigator', {screen: 'MyFeedScreen'});
          }}>
          <GrayBox
            iconName="message-square"
            label="My Posts"
            iconType="feather"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <GrayBox
            iconName="account-group"
            label="Groups"
            iconType="MaterialCommunityIcons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OMNISScoreStackNavigator', {
              screen: 'LevelsScreen',
            });
          }}>
          <GrayBox
            iconName="star-four-points-outline"
            label="Rewards"
            iconType="MaterialCommunityIcons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomeStackNavigator', {screen: 'FAQ'});
          }}>
          <GrayBox
            iconName="help-circle-outline"
            label="Help Center"
            iconType="Ionicons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomeStackNavigator', {screen: 'Settings'});
          }}>
          <GrayBox iconName="settings" label="Settings" iconType="feather" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <GrayBox
            iconName="exit-outline"
            label="Sign Out"
            iconType="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const VerticalDivider = () => {
  return <Divider style={styles.divider} />;
};

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  AlignItems: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Relative positioning for this container
  },
  editIcon: {
    position: 'absolute', // Absolute positioning for the pencil icon
    right: 1,
    bottom: 1,
    backgroundColor: GlobalStyles.Colors.primary600,
    borderRadius: 15,
    padding: 5,
  },
  nameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: GlobalStyles.Colors.primary100,
  },
  usernameTitle: {
    fontSize: 16,
    color: GlobalStyles.Colors.primary100,
  },
  statisticsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: '60%',
    width: 1,
    backgroundColor: GlobalStyles.Colors.accent100,
    marginHorizontal: 10, // Optional, to give some space on either side
  },
});
