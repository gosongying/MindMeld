import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from './Settings/Settings';
import About from './Settings/About';
import AchievementSettings from './Settings/AchievementSettings';
import Feedback from './Settings/Feedback';
import FriendListSetting from './Settings/FriendListSetting';
import GroupList from './Settings/GroupList';
import HelpAndSupport from './Settings/HelpandSupport';
import Privacy from './Settings/Privacy';
import SessionsSetting from './Settings/SessionsSetting';
import TermsAndCondition from './Settings/TermsAndCondition';
import FriendListMore from '../../../components/Home/Session/FriendListMore';
import ChatUser from '../../../components/Home/Settings/ChatUser';

const SettingTab = () => {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="About" component={About} options={{ gestureDirection: 'horizontal' }} />
      <Stack.Screen name="AchievementSettings" component={AchievementSettings} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="FriendListSetting" component={FriendListSetting} />
      <Stack.Screen name="GroupList" component={GroupList} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="SessionsSetting" component={SessionsSetting} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <Stack.Screen name="FriendListMore" component={FriendListMore} />
      <Stack.Screen name="ChatUser" component={ChatUser} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingTab;
