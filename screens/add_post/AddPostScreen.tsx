import React, {useState} from 'react';
import {View, Text, StyleSheet, Switch, SafeAreaView} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import TextInputComponent from '../../assets/constants/Components/TextInputComponent';
import Feather from 'react-native-vector-icons/Feather';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {MediaType} from 'react-native-image-picker';

import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {AppState} from '../../rootReducer';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FeedStackParamList, HomeStackParamList} from '../../App';

export default function AddPostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(100);
  const [featured, setIsFeatured] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  // const selectImageFromLibrary = () => {
  //   const options = {
  //     mediaType: MediaType.photo, // Correct usage of MediaType
  //     // Add other options as required
  //   };

  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.assets && response.assets[0].uri) {
  //       const source = { uri: response.assets[0].uri };
  //       setImageUri(source.uri);
  //       setImageFile(response.assets[0]);
  //     }
  //   });
  // };

  // State for image will be needed
  // Logging FormData contents

  const token = useSelector((state: AppState) => state.token);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    console.log('Amount before appending to FormData:', amount);
    formData.append('amount', amount.toFixed(2));
    formData.append('featured', String(featured)); // Convert boolean to string

    // if (imageFile) {
    //   formData.append('image', {
    //     uri: imageFile.uri,
    //     type: imageFile.type,
    //     name: imageFile.fileName
    //   });
    // }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token.token}`, // Include the token in the Authorization header
      },
    };

    axios
      .post('http://localhost:8080/api/omnis/post/create', formData, config)
      .then(response => {
        console.log(response.data);
        // Navigate back on success
        navigation.navigate('FeedStackNavigator', {screen: 'MyFeedScreen'});
      })
      .catch(error => {
        console.error(error);
        // Handle error (e.g., show an alert to the user)
      });
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Add Post"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <TextInputComponent
        title="Title"
        placeholder="Your custom placeholder here"
        keyboardType="default"
        onChangeText={text => setTitle(text)}
      />
      <TextInputComponent
        title="Description"
        placeholder="Write a short description"
        keyboardType="default"
        onChangeText={text => setDescription(text)}
        inputHeight={110}
      />
      <TouchableOpacity style={styles.uploadImage} onPress={() => {}}>
        <Text style={styles.uploadImageText}>Upload Image</Text>
        <Feather
          name={'upload'}
          size={20}
          color={GlobalStyles.Colors.primary200}
        />
      </TouchableOpacity>
      <TextInputComponent
        title="Amount"
        placeholder="Enter Amount"
        keyboardType="numeric" // Changed to 'numeric' to better handle numeric input
        onChangeText={text => {
          // Allow numbers and a single decimal point
          const cleanedText = text.replace(/[^0-9.]/g, '');

          // Check if the cleaned text is a valid number
          const numericValue = cleanedText === '' ? 0 : parseFloat(cleanedText);

          // Set the amount state to the numeric value
          setAmount(numericValue);
        }}
        isAmount={true}
      />
      <View style={styles.featured}>
        <Text style={styles.featuredText}>Featured</Text>
        <Switch
          trackColor={{false: '#767577', true: GlobalStyles.Colors.primary200}}
          thumbColor={featured ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsFeatured(!featured)}
          value={featured}
        />
      </View>
      <CompleteButton
        text="Add"
        color={GlobalStyles.Colors.primary200}
        onPress={handleSubmit} // Fixed here
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  uploadImage: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadImageText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  featured: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
  },
});
