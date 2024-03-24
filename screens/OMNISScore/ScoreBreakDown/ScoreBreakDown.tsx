import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle'
import GlobalStyles from '../../../assets/constants/colors'
import OMNISScoreTabs from '../OMNISScoreTabs'

export default function ScoreBreakDown() {
  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Score Breakdown"
        showBackArrow={true}
        onBackPress={() => {
          // Handle the back button press, e.g., navigate back
        }}
      />
      <OMNISScoreTabs />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: GlobalStyles.Colors.primary800,
    },
})