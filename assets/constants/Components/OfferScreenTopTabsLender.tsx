import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GlobalStyles from '../colors';
import BorrowerClosedOffers from '../../../screens/NewOffers/Borrower/ClosedOffers/BorrowerClosedOffers';
import ActiveOffers from '../../../screens/NewOffers/Borrower/ActiveOffers/ActiveOffers';
import NewOffersLender from '../../../screens/NewOffers/Lender/SentOffers/NewOffersLender';
import ActiveOfferDetails from '../../../screens/NewOffers/Lender/SentOffers/ActiveOfferDetails';
import ActiveOffersLender from '../../../screens/NewOffers/Lender/ActiveOffersLenders/ActiveOffersLender';
import ClosedOfferLender from '../../../screens/NewOffers/Lender/ClosedOfferLenders/ClosedOfferLender';


const Tab = createMaterialTopTabNavigator();

export default function OfferScreenTopTabsLender() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {borderTopLeftRadius: 24, borderTopRightRadius: 24}, // set this to your preferred tab bar background color
        tabBarIndicatorStyle: {
          backgroundColor: GlobalStyles.Colors.primary200,
          height: 2,
          alignSelf: 'center',
        },
      }}>
      <Tab.Screen
        options={{title: 'Sent Offers'}}
        name="NewOffersScreen"
        component={NewOffersLender}
      />
      <Tab.Screen
        options={{title: 'Active Offers'}}
        name="ActiveOffersLender"
        component={ActiveOffersLender}
      />
      <Tab.Screen
        options={{title: 'Closed Offers'}}
        name="ClosedOfferLender"
        component={ClosedOfferLender}
      />
    </Tab.Navigator>
  );
}
