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
import Ionicons from 'react-native-vector-icons/Ionicons';

//TODO: The 4 Screens
const StudyDashBoard = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const StudyCommunity = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const Achievements = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const Menu = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
          
                    if (route.name === 'StudyDashBoard') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'StudyCommunit') {
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
            <Tab.Screen name={'StudyDashBoard'} component={StudyDashBoard} options={{ tabBarLabel: 'Study', headerShown:false }}/>
            <Tab.Screen name={'StudyCommunit'} component={StudyCommunity} options={{ tabBarLabel: 'Community', headerShown:false }}/>
            <Tab.Screen name={'Achievements'} component={Achievements} options={{ tabBarLabel: 'Achievement', headerShown:false }}/>
            <Tab.Screen name={'Menu'} component={Menu} options={{ tabBarLabel: 'Settings', headerShown:false }}/>
        </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default HomePage