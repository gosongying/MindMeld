import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Achievement from './Achievement/Achievement';

const AchievementTab = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='Achievement' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Achievement" component={Achievement} />
      </Stack.Navigator>
    </NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AchievementTab;
