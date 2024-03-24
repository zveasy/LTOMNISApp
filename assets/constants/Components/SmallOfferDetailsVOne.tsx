import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../colors';
import {t} from 'i18next';

type Props = {
    title: string;
    rightWords?: string[];
};

const DEFAULT_RIGHT_WORDS = [
    '01/01/2023',
    '05:15 PM',
    'Zak Veasy',
    '3%',
    '$31.25',
    '$5.25',
    '6%APR, 6 months'
];

const LEFT_WORDS = [
    t('Date'),
    t('Time'),
    t('sentFrom'),
    t('newOfferDetails-interestRate'),
    t('TotalPayback'),
    t('AmountPerMonth'),
    t('PaymentPlan')
];

const SmallOfferDetailsVOne: React.FC<Props> = ({ title, rightWords = DEFAULT_RIGHT_WORDS }) => {
    const displayWords = [...rightWords];
    if (rightWords[3] === 'Gift') {
        displayWords[4] = '-';
        displayWords[5] = '-';
        displayWords[6] = '-';
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            {LEFT_WORDS.map((leftWord, index) => (
                <View key={index}>
                    <View style={styles.row}>
                        <Text style={styles.leftWord}>{leftWord}</Text>
                        <Text style={styles.rightWord}>{displayWords[index] || DEFAULT_RIGHT_WORDS[index]}</Text>
                    </View>
                    {index !== LEFT_WORDS.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '98%',
        padding: 10,
        marginTop: 40,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GlobalStyles.Colors.primary100,
        marginBottom: 20
    },
    leftWord: {
        fontSize: 14,
        color: GlobalStyles.Colors.primary100
    },
    rightWord: {
        fontSize: 14,
        color: GlobalStyles.Colors.primary100
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
        height: 1,
        backgroundColor: 'grey', 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default SmallOfferDetailsVOne;
