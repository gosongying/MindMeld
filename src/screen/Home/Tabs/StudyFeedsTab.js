import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import PostScreen from '../../../components/Home/Feed/PostScreen';
import Feeds from '../../../components/Home/Feed/Feeds';
import StudyFeeds from './StudyFeeds/StudyFeeds';


const StudyFeedsTab = () => {

  const Stack = createStackNavigator();

  return (
    //<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='StudyFeeds' screenOptions={{headerShown:false}}>
        <Stack.Screen name="StudyFeeds" component={StudyFeeds} />
        <Stack.Screen name="Feeds" component={Feeds} />
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

export default StudyFeedsTab;
