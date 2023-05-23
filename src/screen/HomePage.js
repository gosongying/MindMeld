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
    FlatList
  } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LandingPage from './LandingPage';
import Details from '../components/Details';

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

//screen 1,2,3 not implemented yet
const Menu = ( {navigation} ) => {
    const options = [
    { id: '1', title: 'Profile Settings', screen: 'ProfileSettingsScreen' }, // Set up avatar, username, pw, etc.
    { id: '2', title: 'Privacy Settings', screen: 'PrivacySettingsScreen' }, // Notifications, app collection? etc.
    { id: '3', title: 'About', screen: 'AboutScreen' },
    { id: '4', title: 'Logout', screen:'LandingPage' }
    ];

    const navigateToScreen = (screen) => {
        navigation.navigate(screen);
      };

    const renderOption = ({ item }) => (
        <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      );
    
      //TODO: 
    return (
    <View>
        <Text> Some details </Text> {/*A component to showcase the details of the user, ref to ../components/details */}
        <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item) => item.id}
        />
    </View>
    );
};

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