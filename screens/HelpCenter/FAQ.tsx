import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import FAQDropdown from './FAQDropdown';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {Linking} from 'react-native';
import {Alert} from 'react-native';
import dummyFAQs from './dummyFAQs';

export default function FAQ() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const callSupport = () => {
    const phoneNumber = '6156632609'; // Replace with your support phone number
    let url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => Alert.alert('An error occurred', err.toString())); // Improved the error message
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScreenTitle showBackArrow={true} title="FAQs" />
        <ScrollView style={styles.contentContainer}>
          <View style={styles.whiteContainer}>
            {dummyFAQs.map((faq, index) => (
              <FAQDropdown
                key={index}
                title={faq.title}
                content={faq.content}
                isActive={activeFAQ === index}
                onPress={() => setActiveFAQ(activeFAQ === index ? null : index)}
              />
            ))}
          </View>
          <CompleteButton text="Or Contact Support" onPress={callSupport} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  contentContainer: {
    flexGrow: 1, // Updated this line
    width: '100%',
  },
  whiteContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  textContent: {
    fontSize: 16, // Adjust as per your design requirements.
  },
});
