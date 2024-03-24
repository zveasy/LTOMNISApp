import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';

interface RowWithRadioButtonProps {
    title: string;
    isSelected: boolean;
    onSelected: () => void;
}

const RowWithRadioButton: React.FC<RowWithRadioButtonProps> = ({ title, isSelected, onSelected }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <CheckBox
                checked={isSelected}
                onPress={onSelected}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={GlobalStyles.Colors.primary200}
                uncheckedColor="white"
                size={24}
                containerStyle={styles.checkBoxContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 14,
        color: 'white',
    },
    checkBoxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
});

export default RowWithRadioButton;
