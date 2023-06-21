import React, { useEffect } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudyDashboardTab from './Tabs/StudyDashboardTab';
import StudyFeedsTab from './Tabs/StudyFeedsTab';
import AchievementTab from './Tabs/AchievementTab';
import SettingTab from './Tabs/SettingTab';
import StudySessionTab from './Tabs/StudySessionTab';
import { update, ref, onDisconnect, serverTimestamp, goOnline, onValue, increment, runTransaction, remove } from 'firebase/database';
import { database, auth } from '../../../firebase';

const HomePage = () => {

  const currentUser = auth.currentUser;

  console.log("Home");

  useEffect(() => {
    const userIdRef = ref(database, 'userId/' + currentUser.uid);
    try {
      if (!currentUser.isAnonymous) {
         //to handle user online status when user close the app suddenly
        onDisconnect(userIdRef).update({status: increment(-1)});
        //to handle user ongoing sessions when user close the app suddenly
        onDisconnect(userIdRef).update({
          ongoingSessions: null
        });
        //use runTransaction to update the number of online account correctly
        runTransaction(userIdRef, (profile) => {
          if (profile) {
            profile.status++;
            return profile;
          } else {
            return profile;
          }
        });
        } else {
          //if anonymous user, then delete the account
          onDisconnect(userIdRef).remove();
        }
    } catch(error) {
      console.log(error);
    }
  }, []);

  const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'StudyDashboardTab') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'StudyFeedsTab') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'AchievementsTab') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'SettingTab') {
              iconName = focused ? 'menu' : 'menu-outline';
            } else if (route.name === 'StudySessionTab') {
              iconName = focused ? 'easel' : 'easel-outline'
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#710EF1',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
          },
          tabBarLabelStyle: {
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#710ef1',
          },
        })}>
        <Tab.Screen name={'StudyDashboardTab'} component={StudyDashboardTab} options={{ tabBarLabel: 'Study', headerShown: false }} />
        <Tab.Screen name={'StudySessionTab'} component={StudySessionTab} options={{ tabBarLabel: 'Session', headerShown: false }} />
        {!currentUser.isAnonymous && <Tab.Screen name={'StudyFeedsTab'} component={StudyFeedsTab} options={{ tabBarLabel: 'Feeds', headerShown: false }} />}
        {!currentUser.isAnonymous && <Tab.Screen name={'AchievementsTab'} component={AchievementTab} options={{ tabBarLabel: 'Achievement', headerShown: false }} />}
        <Tab.Screen name={'SettingTab'} component={SettingTab} options={{ tabBarLabel: 'Setting' ,headerShown: false }} />
      </Tab.Navigator>
    );
  };
  

export default HomePage