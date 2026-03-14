import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import GlobalStyles from '../../../assets/constants/colors';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import CustomOfferBlock from '../../../assets/constants/Components/CustomOfferBlock';
import {ParticipantDetails} from '../Lender/ParticipantDetails';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../ReduxStore';
import {useRoute} from '@react-navigation/native';

interface PostData {
  loanAmount: number;
  interestRate: number;
  remaining: number;
  participants: Array<{name: string}>;
  groups: Array<{name: string}>;
  friends: Array<{name: string}>;
}

export default function FeedSummary() {
  const route = useRoute<any>();
  const postId = route.params?.postId;
  const token = useSelector((state: AppState) => state.token);

  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/omnis/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setPostData(res.data);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle
          title="Offer Summary"
          showBackArrow={true}
          onBackPress={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  const loanAmount = postData?.loanAmount ?? 0;
  const interestRate = postData?.interestRate ?? 0;
  const remaining = postData?.remaining ?? 0;
  const participants = postData?.participants ?? [];
  const groups = postData?.groups ?? [];
  const friends = postData?.friends ?? [];

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Offer Summary"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <CustomOfferBlock
        data={[
          {leftText: 'Loan amount', rightText: `$${loanAmount}`},
          {leftText: 'Interest rate', rightText: `${interestRate}%`},
          {isDivider: true},
          {leftText: 'Remaining', rightText: `$${remaining}`},
        ]}
      />
      <View
        style={{width: '95%', alignSelf: 'center', flexDirection: 'column'}}>
        <Text style={styles.title}>Transaction Details</Text>
        <Text style={styles.subtext}>
          you need to start different groups to be able to reach your goal!
          Please, try{' '}
          <Text
            style={{
              ...styles.subtext,
              color: GlobalStyles.Colors.primary200,
              fontWeight: 'bold',
            }}>
            Spotlight{' '}
          </Text>
          features to find your community
        </Text>
      </View>
      <ParticipantDetails
        textColor={GlobalStyles.Colors.primary100}
        borderColor={GlobalStyles.Colors.primary800}
        participants={participants}
      />
      <Divider
        width={1}
        style={{width: '90%', alignSelf: 'center', marginTop: 10}}
        color={GlobalStyles.Colors.accent200}
      />
      <ParticipantDetails
        textColor={GlobalStyles.Colors.primary100}
        borderColor={GlobalStyles.Colors.primary800}
        participants={groups}
        type="groups"
      />
      <Divider
        width={1}
        style={{width: '90%', alignSelf: 'center', marginTop: 10}}
        color={GlobalStyles.Colors.accent200}
      />
      <ParticipantDetails
        textColor={GlobalStyles.Colors.primary100}
        borderColor={GlobalStyles.Colors.primary800}
        participants={friends}
        type="friends"
      />

      <CompleteButton
        text="Edit Post"
        color={GlobalStyles.Colors.primary200}
        onPress={() => console.log('Button pressed!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 20,
    color: GlobalStyles.Colors.primary100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
    color: GlobalStyles.Colors.primary100,
  },
});
