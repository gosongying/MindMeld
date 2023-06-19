import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StudyCommunity from './StudyCommunity/StudyCommunity';
import FriendListMore from '../../../components/Home/Community/FriendListMore';
import FriendList from '../../../components/Home/Community/FriendList';
import ChatRoom from '../../../components/Home/Community/ChatRoom';
import PostScreen from '../../../components/Home/Community/PostScreen';
import Feeds from '../../../components/Home/Community/Feeds';


const StudyCommunityTab = () => {

  const Stack = createStackNavigator();

  return (
    //<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='StudyCommunity' screenOptions={{headerShown:false}}>
        <Stack.Screen name="StudyCommunity" component={StudyCommunity} />
        <Stack.Screen name="FriendListMore" component={FriendListMore} />
        <Stack.Screen name="FriendList" component={FriendList}/>
        <Stack.Screen name="ChatRoom" component={ChatRoom}/>
        <Stack.Screen name="PostScreen" component={PostScreen}/>
      </Stack.Navigator>
    //</NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudyCommunityTab;
