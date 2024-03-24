import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import GlobalStyles from '../../../../assets/constants/colors';
import ScreenTitle from '../../../../assets/constants/Components/ScreenTitle';
import PointsRow from './PointsRow';
import ScoreName from './ScoreName';

export default function LevelsScreen() {
  const [Points, setPoints] = useState(1501);

  const determineStatus = (points: number) => {
    if (points >= 7501) return 'gold';
    if (points >= 1501) return 'silver';
    return 'bronze';
  };

  const currentStatus = determineStatus(Points);

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Levels"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <PointsRow />
      <View style={styles.whiteBackground}>
        <ScoreName
          status="gold"
          title="Gold Status"
          subtext="OMNIS Score Champion is someone who has successfully built and maintained a high OMNIS Score."
          statusVisible={currentStatus === 'gold'}
          progress={Points}
        />
        <ScoreName
          status="silver"
          title="Silver Status"
          subtext="Money Master is an individual who makes informed decisions that lead to financial success and wealth creation."
          statusVisible={currentStatus === 'silver'}
          progress={Points}
        />
        <ScoreName
          status="bronze"
          title="Budgeting Champion"
          subtext="Budgeting Champion is someone who has demonstrated skills in managing their finance."
          statusVisible={currentStatus === 'bronze'}
          progress={Points}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  whiteBackground: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    bottom: 0,
    alignItems: 'center',
  },
});
