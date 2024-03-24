import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import TitleWithMeter from '../../../../assets/constants/Components/OMNISScoreComp/TitleWithMeter';
import GlobalStyles from '../../../../assets/constants/colors';
import {Divider} from 'react-native-elements';
import TitleWithGraph from '../../../../assets/constants/Components/OMNISScoreComp/TitleWithGraph';
import OmnisScoreChips from '../../../../assets/constants/Components/OmnisScoreChips';
import axios from 'axios';
import {AppState} from '../../../../ReduxStore';
import {useSelector} from 'react-redux';

const BorrowerScoreBreakdown = () => {
  const token = useSelector((state: AppState) => state.token);
  const [scoreBorrower, setScoreBorrower] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/omnis/borrower/score/breakdown`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const borrowerBreakDownData = response.data;
        setScoreBorrower(borrowerBreakDownData);
        console.log('borrowerBreakDownData: ', borrowerBreakDownData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <TitleWithMeter title="Repayment Timeliness Meter" score={scoreBorrower} />
      <Divider
        width={1}
        style={{width: '95%', alignSelf: 'center'}}
        color={GlobalStyles.Colors.accent250}
      />
      <TitleWithGraph score={scoreBorrower} title="Amount Borrowed vs Repaid" />
      <OmnisScoreChips
        chips={[
          {text: 'Borrowed', backgroundColor: GlobalStyles.Colors.primary800},
          {text: 'Repaid', backgroundColor: GlobalStyles.Colors.primary200},
        ]}
      />
    </SafeAreaView>
  );
};

export default BorrowerScoreBreakdown;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary100,
  },
});
