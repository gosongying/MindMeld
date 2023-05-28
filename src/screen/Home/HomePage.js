import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudyDashboard from './Tabs/StudyDashboard';
import StudyCommunity from './Tabs/StudyCommunity';
import Achievements from './Tabs/Achievement';
import Settings from './Tabs/Settings';
import { TouchableWithoutFeedback } from 'react-native';


const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
        <Tab.Navigator
        tabBarOptions={{
            tabBarActiveTintColor: '#710ef1',
            tabBarInactiveTintColor: '#000000',
            tabBarLabelStyle: {
              textTransform: 'none',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#710ef1',
            },
            tabBarStyle: {
              backgroundColor: '#ffffff',
            },
          }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
          
                    if (route.name === 'StudyDashboard') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'StudyCommunity') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Achievements') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Menu') {
                        iconName = focused ? 'menu' : 'menu-outline';      
                    }
          
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#710EF1',
                tabBarInactiveTintColor: 'gray',
                })}>
            <Tab.Screen name={'StudyDashboard'} component={StudyDashboard} options={{ tabBarLabel: 'Study', headerShown:false }}/>
            <Tab.Screen name={'StudyCommunity'} component={StudyCommunity} options={{ tabBarLabel: 'Community', headerShown:false }}/>
            <Tab.Screen name={'Achievements'} component={Achievements} options={{ tabBarLabel: 'Achievement', headerShown:false }}/>
            <Tab.Screen name={'Menu'} component={Settings} options={{ headerShown:false }}/>
        </Tab.Navigator>
  )
}

export default HomePage