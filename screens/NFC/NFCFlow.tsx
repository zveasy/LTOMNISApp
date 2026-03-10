import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NFCHoldNearReader from './NFCHoldNearReader';
import NFCFaceId from './NFCFaceId';
import NFCAcceptFriend from './NFCAcceptFriend';
import NFCDone from './NFCDone';

export type NFCFlowStackParamList = {
  NFCHoldNearReader: undefined;
  NFCFaceId: undefined;
  NFCAcceptFriend: undefined;
  NFCDone: undefined;
};

const NFCStack = createNativeStackNavigator<NFCFlowStackParamList>();

export default function NFCFlow() {
  return (
    <NFCStack.Navigator
      initialRouteName="NFCHoldNearReader"
      screenOptions={{headerShown: false}}>
      <NFCStack.Screen
        name="NFCHoldNearReader"
        component={NFCHoldNearReader}
      />
      <NFCStack.Screen name="NFCFaceId" component={NFCFaceId} />
      <NFCStack.Screen name="NFCAcceptFriend" component={NFCAcceptFriend} />
      <NFCStack.Screen name="NFCDone" component={NFCDone} />
    </NFCStack.Navigator>
  );
}
