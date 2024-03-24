import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GlobalStyles from '../colors';
import GroupsScreen from '../../../screens/Spotlight/Groups/GroupsScreen';
import FriendsScreen from '../../../screens/Spotlight/Friends/FriendsScreen';
import {View, Text, TouchableOpacity} from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: GlobalStyles.Colors.primary800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: 50,
      }}>
      <View
        style={{
          position: 'absolute',
          bottom: 8, // Adjust this to position the gray bar correctly
          height: 2,
          width: '100%',
          backgroundColor: 'rgba(256, 256, 256, 0.1)',
          borderRadius: 16,
        }}
      />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true, // Add this line
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: isFocused
                  ? GlobalStyles.Colors.primary100
                  : 'rgba(256,256,256,0.6)',
                fontSize: 14,
                marginBottom: 8,
              }}>
              {typeof label === 'function'
                ? label({
                    focused: isFocused,
                    color: isFocused ? 'white' : 'gray',
                    children: route.name,
                  })
                : label}
            </Text>

            {isFocused && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 8, // This positions the active bar over the gray bar
                  height: 2,
                  width: '100%', // Adjust the width as necessary
                  backgroundColor: GlobalStyles.Colors.primary200,
                  borderRadius: 20,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function SpotlightNavOne() {
    return (
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          options={{title: 'Groups'}}
          name="GroupsScreen"
          component={GroupsScreen}
        />        
        <Tab.Screen
          options={{title: 'Friends'}}
          name="FriendsScreen"
          component={FriendsScreen}
        />
      </Tab.Navigator>
    );
  }
  
  
