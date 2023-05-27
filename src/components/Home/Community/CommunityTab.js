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
    <Tab.Navigator>
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
    padding: 20,
    height: 300
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
});

export default CommunityTab;
