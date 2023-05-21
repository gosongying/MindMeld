import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Image,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
  } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab1 = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Boost Productivity: Effortless Study with MindMeld </Text>
        </View>
    )
}
const Tab2 = () => {
    return (
    <View style={styles.container}>
        <Text style={styles.text}> Study Smart: Achieve More with MindMeld's Effective Techniques </Text>
    </View>
    )
}

const Tab3 = () => {
    return (
    <View style={styles.container}>
        <Text style={styles.text}> Unlock Potential: Maximize Learning Abilities with MindMeld's Tools </Text>
    </View>
    )
}

const Tab4 = () => {
    return (
    <View style={styles.container}>
        <Text style={styles.text}>Join the Community: Connect, Learn, and Succeed Together with MindMeld </Text>
    </View>
    )
}

const Tab = createBottomTabNavigator();

const LandingTabs = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
            tabBarOptions={{tabStyle: {position: "absolute", bottom: 0, },
            }}>
            <Tab.Screen name={'Tab1'} component={Tab1} options={{ tabBarLabel: '', headerShown:false }}/>
            <Tab.Screen name={'Tab2'} component={Tab2} options={{ tabBarLabel: '', headerShown:false }}/>
            <Tab.Screen name={'Tab3'} component={Tab3} options={{ tabBarLabel: '', headerShown:false }}/>
            <Tab.Screen name={'Tab4'} component={Tab4} options={{ tabBarLabel: '', headerShown:false }}/>
        </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
    },
  });

export default LandingTabs;
