import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import {
  CustomCarousel,
  CustomTitle,
} from '../../../assets/constants/Components/SpotlightTitleCarousel';
import {ProfileCustomCarousel} from '../../../assets/constants/Components/ProfileCustomCarousel';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SpotlightStackParamList} from '../../../App';


export default function FriendsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();

    const handleButtonPress = () => {
      console.log('Button Pressed');
    };

    const handleShowAllButtonPress = () => {
      console.log('Button Pressed in show');
      navigation.navigate('AddFriendScreen');
    };
    
    const images = [
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 1',
        isTopLender: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 2',
      },
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 1',
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 2',
      },
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 1',
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tag: 'Tag 2',
      },
      // ... more image URLs
    ];
    
    const images2 = [
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
        text: '1234567891',
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        text: 'Baseball Team',
      },
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        url: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
      },
      {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
    ];



  return (
    <SafeAreaView style={styles.background}>
      <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
        <CustomTitle
          title="My friends"
          buttonText="Show all"
          onButtonPress={handleShowAllButtonPress}
          data={[]}
        />
        <ProfileCustomCarousel images={images} />
        <View style={{marginTop: 20}} />
        <CustomTitle
          title="People you may know"
          buttonText="Show all"
          onButtonPress={handleButtonPress}
          data={[]}
        />
        <ProfileCustomCarousel images={images2} />
        <View style={{marginTop: 20}}>
          <CustomTitle
            title="NFC friends"
            buttonText="Add Friend"
            onButtonPress={handleButtonPress}
            data={[]}
          />
          <View style={{height: 170, width: '90%', alignSelf: 'center'}}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 20}}
              source={{
                uri: 'https://images.unsplash.com/photo-1693985320387-9b08d2c8e1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
              }}
            />
            <Icon
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [
                  {translateX: -45}, // Half of the icon size (90/2 = 45)
                  {translateY: -45}, // Half of the icon size (90/2 = 45)
                  {rotateZ: '90deg'},
                ],
              }}
              name={'wifi-outline'}
              size={90}
              color={GlobalStyles.Colors.primary100}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
});
