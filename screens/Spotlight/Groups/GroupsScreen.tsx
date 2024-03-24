import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import {
  CustomCarousel,
  CustomTitle,
} from '../../../assets/constants/Components/SpotlightTitleCarousel';
import axios from 'axios';

import {SmallCustomCarousel} from '../../../assets/constants/Components/SmallCustomCarousel';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SpotlightStackParamList} from '../../../App';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';

interface GroupItem {
  title: string;
}

export default function GroupsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();
  const handleButtonPress = () => {
    console.log('Button Pressed');
  };
  const handleLocal = () => {
    navigation.navigate('GroupDetailsHistoryScreen');
  };

  const handleCreateButtonPress = () => {
    console.log('Button Pressed');
    navigation.navigate('MakeAGroupScreen');
  };

  const [group, setGroup] = useState<GroupItem[]>([]);
  const [featuredGroup, setFeaturedGroup] = useState<GroupItem[]>([]);
  const [interestGroup, setInterestGroup] = useState<GroupItem[]>([]);

  const token = useSelector((state: AppState) => state.token);

  useEffect(() => {
    const fetchGroups = async () => {
      await GetMyGroup();
      await GetMyFeaturedGroup();
      await GetMyInterestGroup();
    };

    fetchGroups();
  }, []);

  const renderGroupContent = (groupData, CarouselComponent, noDataMessage) => {
    if (groupData.length === 0) {
      return (
        <View style={styles.noGroupsContainer}>
          <Text style={styles.noGroupsText}>{noDataMessage}</Text>
        </View>
      );
    }
    return <CarouselComponent data={groupData} />;
  };

  const GetMyGroup = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/groups/mygroups',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(
        'data payload /omnis/groups/mygroups ',
        response.data.myGroups,
        response.headers,
      );
      setGroup(response.data.myGroups ?? []);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const GetMyFeaturedGroup = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/groups/featured',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(
        'data payload /omnis/groups/featured ',
        response.data.featuredGroups,
        response.headers,
      );
      setFeaturedGroup(response.data.featuredGroups ?? []);
    } catch (error) {
      console.error('An error occurred /omnis/groups/featured:', error);
    }
  };

  const GetMyInterestGroup = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/omnis/groups/all',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('data payload ', response.data, response.headers);
      setInterestGroup(response.data ?? []);
    } catch (error) {
      console.error('An error occurred /omnis/groups/all:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await GetMyGroup();
      await GetMyFeaturedGroup();
      await GetMyInterestGroup();
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
        <CustomTitle
          title="My groups"
          buttonText="Create"
          onButtonPress={handleCreateButtonPress}
        />
        {renderGroupContent(group, CustomCarousel, 'No Groups')}
        <View style={{marginTop: 20}} />
        <CustomTitle
          title="Local groups"
          buttonText="Show all"
          onButtonPress={handleLocal}
        />
        {renderGroupContent(
          featuredGroup,
          SmallCustomCarousel,
          'No Local Groups',
        )}
        <View style={{marginTop: 20}} />
        <CustomTitle
          title="Based on your interest"
          buttonText="Show all"
          onButtonPress={handleLocal}
        />
        {renderGroupContent(
          interestGroup,
          SmallCustomCarousel,
          'No Groups Based on Interest',
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  noGroupsContainer: {
    alignSelf: 'stretch', 
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: 35,
  },
  noGroupsText: {
    color: 'white',
    fontWeight: 'bold', 
    fontSize: 16,
  },
});
