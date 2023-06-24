import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StudyDashboard from './StudyDashboard/StudyDashboard';
import CreateStudySession from './StudyDashboard/CreateStudySession';
import Calculator from './StudyDashboard/Calculator';
import Tasks from './StudyDashboard/Tasks';
import Clock from './StudyDashboard/Clock';
import Notecards from './StudyDashboard/Notecards';
import Notes from './StudyDashboard/Notes';
import Dictionary from './StudyDashboard/Dictionary';
import SelectBuddies from './StudyDashboard/SelectBuddies';
import SelectToDo from './StudyDashboard/SelectToDo';
import About from './Settings/About';


const StudyDashboardTab = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='StudyDashboard' screenOptions={{headerShown:false}}>
        <Stack.Screen name="StudyDashboard" component={StudyDashboard} />
        <Stack.Screen name="CreateStudySession" component={CreateStudySession} />
        <Stack.Screen name="Calculator" component={Calculator} />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="Notecards" component={Notecards} />
        <Stack.Screen name="Dictionary" component={Dictionary} />
        <Stack.Screen name="Clock" component={Clock} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="SelectBuddies" component={SelectBuddies} />
        <Stack.Screen name="SelectToDo" component={SelectToDo} />
      </Stack.Navigator>
    </NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudyDashboardTab;
