import React from 'react';
import {StyleSheet} from 'react-native';
import LandingPage from './src/screen/LandingPage'
import LoginPage from './src/screen/LoginPage'
import SignupPage from './src/screen/SignupPage'
import HomePage from './src/screen/HomePage'
import About from './src/screen/settingScreen/About'
import Privacy from './src/screen/settingScreen/Privacy'
import Profile from './src/screen/settingScreen/Profile'
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
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Profile" component={Profile} />
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
