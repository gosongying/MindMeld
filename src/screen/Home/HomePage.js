import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudyDashboardTab from './Tabs/StudyDashboardTab';
import StudyCommunityTab from './Tabs/StudyCommunityTab';
import AchievementTab from './Tabs/AchievementTab';
import SettingTab from './Tabs/SettingTab';

const HomePage = () => {

  console.log("Home");

  const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'StudyDashboard') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'StudyCommunity') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Achievements') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'Setting') {
              iconName = focused ? 'menu' : 'menu-outline';
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#710EF1',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
          },
          tabBarLabelStyle: {
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#710ef1',
          },
        })}>
        <Tab.Screen name={'StudyDashboard'} component={StudyDashboardTab} options={{ tabBarLabel: 'Study', headerShown: false }} />
        <Tab.Screen name={'StudyCommunity'} component={StudyCommunityTab} options={{ tabBarLabel: 'Community', headerShown: false }} />
        <Tab.Screen name={'Achievements'} component={AchievementTab} options={{ tabBarLabel: 'Achievement', headerShown: false }} />
        <Tab.Screen name={'Setting'} component={SettingTab} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  };
  

export default HomePage