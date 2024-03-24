import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import AcceptAndDecline from '../../assets/constants/Components/Buttons/AcceptAndDecline';
import ChipRow from '../../assets/constants/Components/Buttons/ChipRow';
import DateTimePickerComponent from '../../assets/constants/Components/DateTimePickerComponent';
import {Divider} from 'react-native-elements';

export default function TransactionHistoryFilter() {
  const handleAccept = () => {
    console.log('Accept button pressed');
    // Your accept button logic here
  };

  const handleDecline = () => {
    console.log('Decline button pressed');
    // Your decline button logic here
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Filters"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <View style={styles.content}>
        <Section title="Transaction Type">
          <ChipRow
            chipsData={[
              {id: '1', label: 'Transfer'},
              {id: '2', label: 'Deposit'},
              {id: '3', label: 'Withdraw'},
              // ...more chips
            ]}
            onSelect={chip => {
              console.log('Chip selected:', chip);
              // ... Your logic for when a chip is selected
            }}
          />
        </Section>

        <Divider
          width={1}
          style={{marginVertical: 16}}
          color={'rgba(256, 256, 256, 0.04)'}
        />

        <Section title="Money Range" />

        <Divider
          width={1}
          style={{marginVertical: 16}}
          color={'rgba(256, 256, 256, 0.04)'}
        />
        <Section title="Date Range">
          <View style={styles.dateRangeContainer}>
            <DateRangeRow label="From" />
            <DateRangeRow label="To" />
          </View>
        </Section>
      </View>
      <View style={styles.footer}></View>
      <AcceptAndDecline
        onAccept={handleAccept}
        onDecline={handleDecline}
        acceptText="Submit"
        declineText="Reset"
      />
    </SafeAreaView>
  );
}

interface DateRangeRowProps {
  label: string;
}

const DateRangeRow: React.FC<DateRangeRowProps> = ({ label }) => (
  <View style={styles.dateRangeRow}>
    <Text style={styles.labelButtonText}>{label}</Text>
    <View style={styles.dateButton}>
      <Text style={styles.dateButtonText}>Set Date</Text>
    </View>
  </View>
);

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({title, children}) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: GlobalStyles.Colors.primary100,
    fontWeight: '700',
  },
  dateRangeContainer: {
    height: '35%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  dateRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    height: 34,
    width: 108,
    backgroundColor: 'rgba(	118,	118,	128, 0.24)',
    borderRadius: 6,
    justifyContent: 'center', // Aligns text vertically
    alignItems: 'center', // Aligns text horizontally
  },
  dateButtonText: {
    color: '#fff', // Sets text color to white for better readability
    fontSize: 16,
  },
  labelButtonText: {
    color: 'rgba(256, 256, 256, 0.6)', // Sets text color to white for better readability
    fontSize: 14,
  },
  footer: {
    width: '100%',
    padding: 16,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
});
