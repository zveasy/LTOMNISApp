import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import CreditScoreBar from '../../assets/constants/Components/CreditScoreBar';
import SmallCreditScoreBar from '../../assets/constants/Components/SmallCreditScoreBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OmnisOptions from '../../assets/constants/Components/OmnisOptions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LevelDetails from './ScoreBreakDown/Levels/LevelDetails';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OMNISScoreStackParamList} from '../../App';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

export default function OMNISScoreScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<OMNISScoreStackParamList>>();
  const token = useSelector((state: AppState) => state.token);

  const handleClose = () => {
    refRBSheet.current?.close();
  };

  const [score, setScore] = useState(0);

  // const score = 80; // Replace with actual score
  const creditScore = 780;
  const scoreUpdate = 20;

  const refRBSheet = useRef<RBSheet>(null);

  const handleIconPress = () => {
    refRBSheet.current?.open();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/score`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const omnisScore = response.data;
        setScore(omnisScore.scoreObject.score);
        console.log('omnisScore', omnisScore);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  console.log('this is a score', score)

  // Define the content for the bottom sheet
  const BottomSheetContent = () => (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.scoreSection}>
        <Text style={styles.titleText}>Your Score</Text>
        <View style={styles.scoreDetails}>
          <MaterialCommunityIcons
            name={'star-circle-outline'} // Placeholder for the OMNIS score icon
            size={24}
            color={'white'}
          />
          <Text style={styles.scoreDescription}>
            It's your personal OMNIS score that shows how active you are and if
            your financial decisions are wise. Learn more on Score Breakdown to
            see how your actions affect your OMNIS score.
          </Text>
        </View>
        <View style={styles.scoreDetails}>
          <MaterialCommunityIcons
            name={'alert-circle-outline'} // Placeholder for the Credit score icon
            size={24}
            color={'red'}
          />
          <Text style={styles.scoreDescription}>
            It's your actual credit score based on the data collected from
            International Data Report. It can be improved with the help of high
            OMNIS Score.
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.gotItButton} onPress={handleClose}>
        <Text style={styles.gotItButtonText}>Got It</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle title="OMNIS Score" />
      <View style={styles.OMNISScoreBackground}>
        <TouchableOpacity
          onPress={handleIconPress}
          style={{position: 'absolute', right: 0, padding: 10}}>
          <MaterialCommunityIcons
            name={'information-outline'}
            size={18}
            color={'gray'}
          />
        </TouchableOpacity>
        <CreditScoreBar scoreUpdate={scoreUpdate} score={score} />
        <SmallCreditScoreBar creditScore={creditScore} />
        <Pressable
          onPress={() => {
            navigation.navigate('ScoreBreakDown');
          }}
          style={styles.ScoreBreakdownButton}>
          <Text style={styles.ScoreBreakdownButtonText}>Score Breakdown</Text>
        </Pressable>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        onClose={handleClose}
        height={300}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        {/* Render the bottom sheet content */}
        <BottomSheetContent />
      </RBSheet>

      <Pressable
        style={{marginTop: 40}}
        onPress={() => navigation.navigate('LevelsScreen')}>
        <OmnisOptions
          isLottie={true}
          title="Money Master"
          isProgressBar={true}
          progress={2000}
          status="silver"
        />
      </Pressable>
      {/* <OmnisOptions
        isLottie={false}
        imageSource={require('../../assets/Icons/knowledge.png')}
        title="Learning Hub"
        isProgressBar={false}
        subText="Improve financial literacy and earn rewards"
      />
      <OmnisOptions
        isLottie={false}
        imageSource={require('../../assets/Icons/award.png')}
        title="Visit Reward Shop"
        isProgressBar={false}
        subText="Redeem Points by buying best rewards for your purpose"
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.primary800,
    paddingVertical: 40,
  },
  OMNISScoreBackground: {
    alignItems: 'center',
    width: '90%',
    height: '40%',
    backgroundColor: 'white',
    borderRadius: 24,
    marginTop: 50,
  },
  ScoreBreakdownButton: {
    height: 56,
    width: '90%',
    borderRadius: 16,
    backgroundColor: GlobalStyles.Colors.primary200,
    bottom: 380,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ScoreBreakdownButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: GlobalStyles.Colors.primary800, // Set your background color
  },
  scoreSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreDescription: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
  },
  gotItButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Match the width to your button style
    backgroundColor: GlobalStyles.Colors.primary200, // Set your button background color
    borderRadius: 16,
    padding: 10,
  },
  gotItButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
