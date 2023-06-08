import React from 'react';
import {StyleSheet} from 'react-native';
import LandingPage from './src/screen/Authentication/LandingPage'
import LoginPage from './src/screen/Authentication/LoginPage'
import SignupPage from './src/screen/Authentication/SignupPage';
import SignupPage2 from './src/screen/Authentication/SignupPage2';
import HomePage from './src/screen/Home/HomePage'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './src/screen/Home/Tabs/Settings/Settings';
import EntryPage from './src/screen/Authentication/EntryPage';


const App = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Entry' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name ="Signup2" component={SignupPage2} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Entry" component={EntryPage} />
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
