import React, {FC} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyles from '../../colors';

const {width} = Dimensions.get('window');

interface BorrowerBehavior {
  lateRepayments: number;
  onTimeRepayments: number;
  pendingPayments: number;
  totalAmountBorrowed: number;
  totalAmountRepaid: number;
}

interface TitleWithMeterProps {
  title: string;
  score: {
    borrowerBehavior: BorrowerBehavior;
    message: string;
    success: boolean;
  };
}


const TitleWithMeter: FC<TitleWithMeterProps> = ({ title, score }) => {
  if (!score) {
    // Render nothing or a placeholder/loading spinner
    return <View><Text>Loading...</Text></View>;
  }
  console.log('This is Meter Score', score)

    // Destructuring to get lateRepayments and onTimeRepayments
    const { lateRepayments, onTimeRepayments } = score.borrowerBehavior;

    // Use lateRepayments and onTimeRepayments for calculations
    const total = lateRepayments + onTimeRepayments;
    const latePercentage = total ? (lateRepayments / total) * 100 : 0;
    const onTimePercentage = total ? (onTimeRepayments / total) * 100 : 0;

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <AntDesign name="exclamationcircleo" size={18} style={styles.icon} color={'#302214'} />
        </View>
        <View style={styles.meterContainer}>
          <LinearGradient
            style={styles.meter}
            colors={[
              GlobalStyles.Colors.primary200,
              GlobalStyles.Colors.primary200,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View style={[styles.meterBar, { width: `${latePercentage}%` }]} />
            <View style={[styles.divider, { left: `${latePercentage}%` }]} />
          </LinearGradient>
        </View>
        <View style={styles.labelContainer}>
          <View style={styles.label}>
            <Text style={styles.NumberText}>{lateRepayments}</Text>
            <Text style={styles.SubNumberText}>Late</Text>
          </View>
          <View style={styles.labelRight}>
            <Text style={styles.NumberText}>{onTimeRepayments}</Text>
            <Text style={styles.SubNumberText}>On Time</Text>
          </View>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
  meterContainer: {
    width: '100%',
    height: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    padding: 5,
  },
  meter: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
  },
  meterBar: {
    backgroundColor: GlobalStyles.Colors.primary800,
    height: '100%',
  },
  divider: {
    position: 'absolute',
    backgroundColor: GlobalStyles.Colors.primary200,
    width: 2,
    height: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  label: {
    alignItems: 'flex-start',
  },
  labelRight: {
    alignItems: 'flex-end',
  },
  NumberText: {
    fontSize: 16,
    fontWeight: '700',
  },
  SubNumberText: {
    fontSize: 10,
  },
});

export default TitleWithMeter;
