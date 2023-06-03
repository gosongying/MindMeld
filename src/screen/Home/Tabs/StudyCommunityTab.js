import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StudyCommunity from './StudyCommunity/StudyCommunity';


const StudyCommunityTab = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='StudyCommunity' screenOptions={{headerShown:false}}>
        <Stack.Screen name="StudyCommunity" component={StudyCommunity} />
      </Stack.Navigator>
    </NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudyCommunityTab;
