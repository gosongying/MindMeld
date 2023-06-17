import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import Timer from './Timer';
import Stopwatch from './Stopwatch';

const Tab = createMaterialTopTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: styles.tabLabel,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#710ef1',
        tabBarInactiveTintColor: '#000000',
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Timer') {
            iconName = 'hourglass';
          } else if (route.name === 'Stopwatch') {
            iconName = 'stopwatch';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Timer" component={Timer} key={1}/>
      <Tab.Screen name="Stopwatch" component={Stopwatch} key={2}/>
    </Tab.Navigator>
  );
};

const TimeFeature = () => {
  return (
    <View style={styles.container}>
      <Tabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 5,
    height: 300,
  },
  tabLabel: {
    textTransform: 'none', // Disable Uppercase
  },
  tabIndicator: {
    backgroundColor: '#710ef1',
  },
  tabBar: {
    backgroundColor: '#ffffff',
  },
});

export default TimeFeature;
