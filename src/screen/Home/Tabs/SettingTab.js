import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from './Settings/Settings';
import About from './Settings/About';
import AchievementSettings from './Settings/AchievementSettings';
import Feedback from './Settings/Feedback';
import FriendList from './Settings/FriendList';
import GroupList from './Settings/GroupList';
import HelpAndSupport from './Settings/HelpandSupport';
import Privacy from './Settings/Privacy';
import Profile from './Settings/Profile';
import SessionsSetting from './Settings/SessionsSetting';
import TermsAndCondition from './Settings/TermsAndCondition';

const SettingTab = () => {

  const Stack = createStackNavigator();

  return (
      <Stack.Navigator initialRouteName='Settings' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="AchievementSettings" component={AchievementSettings} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="FriendList" component={FriendList} />
        <Stack.Screen name="GroupList" component={GroupList} />
        <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SessionsSetting" component={SessionsSetting} />
        <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      </Stack.Navigator>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingTab;
