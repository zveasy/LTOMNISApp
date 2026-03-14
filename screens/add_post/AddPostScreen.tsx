import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
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

type RepaymentType = 'Installments' | 'Lump Sum';
type VisibilityType = 'Public' | 'Friends Only' | 'Group Only';

export default function AddPostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(100);
  const [featured, setIsFeatured] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [repaymentDate, setRepaymentDate] = useState('');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('Installments');
  const [visibility, setVisibility] = useState<VisibilityType>('Public');
  const [selectedGroup, setSelectedGroup] = useState('');
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
    console.log('Amount before appending to FormData:', amount * 1.0875);
    formData.append('amount', (amount * 1.0875).toFixed(2));
    formData.append('featured', String(featured));
    formData.append('repaymentDate', repaymentDate);
    formData.append('repaymentType', repaymentType);
    formData.append('visibility', visibility);
    if (visibility === 'Group Only' && selectedGroup) {
      formData.append('groupId', selectedGroup);
    }

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
        Authorization: `Bearer ${token.token}`,
      },
    };

    axios
      .post('http://localhost:8080/api/omnis/post/create', formData, config)
      .then(response => {
        console.log(response.data);
        navigation.navigate('MyFeedScreen');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const repaymentTypes: RepaymentType[] = ['Installments', 'Lump Sum'];
  const visibilityOptions: VisibilityType[] = [
    'Public',
    'Friends Only',
    'Group Only',
  ];

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Add Post"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TextInputComponent
          title="Title"
          placeholder="Your custom placeholder here"
          keyboardType="default"
          onChangeText={text => setTitle(text)}
          accessibilityLabel="Title"
        />
        <TextInputComponent
          title="Description"
          placeholder="Write a short description"
          keyboardType="default"
          onChangeText={text => setDescription(text)}
          inputHeight={110}
          accessibilityLabel="Description"
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
          keyboardType="numeric"
          onChangeText={text => {
            const cleanedText = text.replace(/[^0-9.]/g, '');
            const numericValue =
              cleanedText === '' ? 0 : parseFloat(cleanedText);
            setAmount(numericValue);
          }}
          isAmount={true}
          accessibilityLabel="Amount"
        />
        <TextInputComponent
          title="Repayment Date"
          placeholder="YYYY-MM-DD"
          keyboardType="default"
          onChangeText={text => setRepaymentDate(text)}
          accessibilityLabel="Repayment date"
        />
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Repayment Type</Text>
          <View style={styles.toggleRow}>
            {repaymentTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  repaymentType === type && styles.toggleButtonActive,
                ]}
                onPress={() => setRepaymentType(type)}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    repaymentType === type && styles.toggleButtonTextActive,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          <View style={styles.toggleRow}>
            {visibilityOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleButton,
                  visibility === option && styles.toggleButtonActive,
                ]}
                onPress={() => setVisibility(option)}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    visibility === option && styles.toggleButtonTextActive,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {visibility === 'Group Only' && (
          <TextInputComponent
            title="Group"
            placeholder="Enter group name or ID"
            keyboardType="default"
            onChangeText={text => setSelectedGroup(text)}
          />
        )}
        <View style={styles.featured}>
          <Text style={styles.featuredText}>Featured</Text>
          <Switch
            trackColor={{
              false: '#767577',
              true: GlobalStyles.Colors.primary200,
            }}
            thumbColor={featured ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsFeatured(!featured)}
            value={featured}
          />
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <CompleteButton
        text="Add"
        color={GlobalStyles.Colors.primary200}
        onPress={handleSubmit}
        accessibilityLabel="Submit post"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  sectionContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderColor: GlobalStyles.Colors.primary200,
  },
  toggleButtonText: {
    color: 'rgba(255,255,255, 0.6)',
    fontSize: 14,
  },
  toggleButtonTextActive: {
    color: GlobalStyles.Colors.primary100,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});
