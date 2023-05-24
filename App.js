import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Image, TextInput, Pressable } from 'react-native';
import LandingPage from './src/screen/LandingPage'
import LoginPage from './src/screen/LoginPage'
import SignupPage from './src/screen/SignupPage'
import HomePage from './src/screen/HomePage'
import LandingTabs from './src/components/LandingTabs'
import Slider from './src/components/Slider'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const App = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Home" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
