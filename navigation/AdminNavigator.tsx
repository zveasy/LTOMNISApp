import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import AdminUserSearch from '../screens/Admin/AdminUserSearch';
import AdminLoanSearch from '../screens/Admin/AdminLoanSearch';
import AdminContractReview from '../screens/Admin/AdminContractReview';
import AdminIdentityQueue from '../screens/Admin/AdminIdentityQueue';
import AdminDisputeManagement from '../screens/Admin/AdminDisputeManagement';
import AdminFraudQueue from '../screens/Admin/AdminFraudQueue';
import AdminAnalytics from '../screens/Admin/AdminAnalytics';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUserSearch: undefined;
  AdminLoanSearch: undefined;
  AdminContractReview: undefined;
  AdminIdentityQueue: undefined;
  AdminDisputeManagement: undefined;
  AdminFraudQueue: undefined;
  AdminAnalytics: undefined;
};

const AdminStack = createStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <AdminStack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{headerShown: false}}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <AdminStack.Screen name="AdminUserSearch" component={AdminUserSearch} />
      <AdminStack.Screen name="AdminLoanSearch" component={AdminLoanSearch} />
      <AdminStack.Screen
        name="AdminContractReview"
        component={AdminContractReview}
      />
      <AdminStack.Screen
        name="AdminIdentityQueue"
        component={AdminIdentityQueue}
      />
      <AdminStack.Screen
        name="AdminDisputeManagement"
        component={AdminDisputeManagement}
      />
      <AdminStack.Screen name="AdminFraudQueue" component={AdminFraudQueue} />
      <AdminStack.Screen name="AdminAnalytics" component={AdminAnalytics} />
    </AdminStack.Navigator>
  );
}
