import React from "react";
import StudySession from './StudySession/StudySession'
import CreateStudySession2 from "./StudySession/CreateStudySession2";
import SelectBuddies2 from "./StudySession/SelectBuddies2";
import SelectToDo2 from "./StudySession/SelectToDo2";
import SessionRoom from "./StudySession/SessionRoom";
import Participants from "./StudySession/Participants";
import ToDoList from './StudySession/ToDoList';
import { createStackNavigator } from '@react-navigation/stack';
import ChatRoom from "../../../components/Home/Session/ChatRoom";

const StudySessionTab = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName='StudySession' screenOptions={{headerShown:false}}>
            <Stack.Screen name ="StudySession" component={StudySession} />
            <Stack.Screen name="CreateStudySession" component={CreateStudySession2} />
            <Stack.Screen name="SelectBuddies" component={SelectBuddies2} />
            <Stack.Screen name="SelectToDo" component={SelectToDo2} />
            <Stack.Screen name="SessionRoom" component={SessionRoom} />
            <Stack.Screen name="Participants" component={Participants} />
            <Stack.Screen name="ToDoList" component={ToDoList} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
    );
};

export default StudySessionTab;