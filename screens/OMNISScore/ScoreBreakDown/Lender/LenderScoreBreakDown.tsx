import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import TitleWithMeter from '../../../../assets/constants/Components/OMNISScoreComp/TitleWithMeter';
import OMNISGraph from '../../../../assets/constants/Components/OMNISGraph';
import TitleWithGraph from '../../../../assets/constants/Components/OMNISScoreComp/TitleWithGraph';
import OmnisScoreChips from '../../../../assets/constants/Components/OmnisScoreChips';
import GlobalStyles from '../../../../assets/constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../ReduxStore';


const LenderScoreBreakDown = () => {
  const token = useSelector((state: AppState) => state.token);
  const [scoreData, setScoreData] = useState<any>(null);

  useEffect(() => {
    const fetchLenderData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/omnis/lender/score/breakdown',
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        setScoreData(response.data);
        console.log('lenderBreakDownData: ', response.data);
      } catch (error) {
        console.error('Error fetching lender data:', error);
      }
    };

    fetchLenderData();
  }, []);

  return (
    <ScrollView style={styles.background}>
      <TitleWithMeter title="Lending Behavior Meter" score={{
        borrowerBehavior: {
          lateRepayments: scoreData?.lendingBehavior?.lateRepayments ?? 0,
          onTimeRepayments: scoreData?.lendingBehavior?.onTimeRepayments ?? 0,
          pendingPayments: scoreData?.lendingBehavior?.pendingPayments ?? 0,
          totalAmountBorrowed: scoreData?.lendingBehavior?.totalAmountLent ?? 0,
          totalAmountRepaid: scoreData?.lendingBehavior?.totalAmountReturned ?? 0,
        },
        message: scoreData?.message ?? '',
        success: scoreData?.success ?? false
      }} />
      <View style={{ height: '100%', width: '100%' }}>
        <TitleWithGraph
          title="Amount Lent vs Returned"
          score={scoreData?.lendingBehavior?.totalAmountReturned ?? 0}
        />
        <OmnisScoreChips
          chips={[
            { text: 'Investment', backgroundColor: '#4CAF50' },
            { text: 'Return', backgroundColor: '#FFC107' },
            { text: 'Profit', backgroundColor: '#9C27B0' },
          ]}
        />
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        </View>
      </View>
    </ScrollView>
  );
};

export default LenderScoreBreakDown;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary100,
    marginBottom: 50,
  },
});
