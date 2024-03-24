import React from 'react';
import {VictoryLine, VictoryChart, VictoryTheme} from 'victory-native';
import {ScrollView} from 'react-native';
import GlobalStyles from '../colors';

const OMNISGraph = () => {
  // Sample data
  const borrowedData = [
    {x: 'Jan', y: 10000},
    {x: 'Feb', y: 12000},
    {x: 'Mar', y: 14000},
    {x: 'Apr', y: 10000},
    {x: 'May', y: 18000},
    {x: 'Jun', y: 15000},
    {x: 'Jul', y: 17000},
    // ... add more if needed
  ];

  const repaidData = [
    {x: 'Jan', y: 5000},
    {x: 'Feb', y: 7000},
    {x: 'Mar', y: 6000},
    {x: 'Apr', y: 2000},
    {x: 'May', y: 9000},
    {x: 'Jun', y: 12000},
    {x: 'Jul', y: 11000},
    // ... add more if needed
  ];

  return (
    <ScrollView horizontal>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryLine
          data={borrowedData}
          style={{data: {stroke: GlobalStyles.Colors.primary900}}}
          interpolation="natural" // This makes the line curved
        />
        <VictoryLine
          data={repaidData}
          style={{data: {stroke: GlobalStyles.Colors.primary200}}}
          interpolation="natural" // This makes the line curved
        />
      </VictoryChart>
    </ScrollView>
  );
};

export default OMNISGraph;
