// SimpleLineChart.tsx

import React, { FC } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface SimpleLineChartProps {
  // Define your prop types here if needed
}

const SimpleLineChart: FC<SimpleLineChartProps> = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [50, 60, 70, 80, 90, 100],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for borrowed
        strokeWidth: 4,
      },
      {
        data: [30, 40, 50, 60, 70, 80],
        color: (opacity = 1) => `rgba(189, 174, 141, ${opacity})`, // #BDAE8D for repaid
        strokeWidth: 4,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 60} // Adjusted for centering
        height={275}
        bezier
        chartConfig={{
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          borderRadius: 16,
          marginVertical: 8,
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center the chart
  },
});

export default SimpleLineChart;
