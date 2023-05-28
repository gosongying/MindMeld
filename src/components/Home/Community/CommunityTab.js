import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const CommunityFeed = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

const Sessions = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

const Forums = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

const CommunityTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabLabel,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#710ef1',
        tabBarInactiveTintColor: '#000000',
      }}
    >
      <Tab.Screen name="Feed" component={CommunityFeed} />
      <Tab.Screen name="Sessions" component={Sessions} />
      <Tab.Screen name="Forums" component={Forums} />
    </Tab.Navigator>
  );
};


const CommunityTab = () => {
  return (
    <View style={styles.container}>
      <CommunityTabs />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tabBar: {
    backgroundColor: '#ffffff',

  },
  tabLabel: {
    textTransform: 'none', // Disable Uppercase
  },
  tabIndicator: {
    backgroundColor: '#710ef1',
  },
});

export default CommunityTab;
