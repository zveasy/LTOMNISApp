import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import FAQDropdown from './FAQDropdown';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {Linking} from 'react-native';
import {Alert} from 'react-native';
import faqData from './dummyFAQs';

export default function FAQ() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const contactSupport = () => {
    const email = 'support@omnisapp.com';
    const url = `mailto:${email}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => Alert.alert('An error occurred', err.toString()));
  };

  const sections = [...new Set(faqData.map(faq => faq.section))];

  let globalIndex = 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScreenTitle showBackArrow={true} title="FAQs" />
        <ScrollView style={styles.contentContainer}>
          <View style={styles.whiteContainer}>
            {sections.map(section => {
              const sectionFaqs = faqData.filter(f => f.section === section);
              return (
                <View key={section} style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{section}</Text>
                  {sectionFaqs.map(faq => {
                    const idx = globalIndex++;
                    return (
                      <FAQDropdown
                        key={idx}
                        title={faq.title}
                        content={faq.content}
                        isActive={activeFAQ === idx}
                        onPress={() =>
                          setActiveFAQ(activeFAQ === idx ? null : idx)
                        }
                      />
                    );
                  })}
                </View>
              );
            })}
          </View>
          <CompleteButton text="Or Contact Support" onPress={contactSupport} />
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
    flexGrow: 1,
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
  sectionContainer: {
    width: '100%',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
    marginTop: 8,
  },
  textContent: {
    fontSize: 16,
  },
});
