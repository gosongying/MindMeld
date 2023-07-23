import React, { useEffect } from 'react';
import { Alert, AppState, Pressable, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudyDashboardTab from './Tabs/StudyDashboardTab';
import StudyFeedsTab from './Tabs/StudyFeedsTab';
import AchievementTab from './Tabs/AchievementTab';
import SettingTab from './Tabs/SettingTab';
import StudySessionTab from './Tabs/StudySessionTab';
import { update, ref, onDisconnect, serverTimestamp, goOnline, onValue, increment, runTransaction, remove } from 'firebase/database';
import { database, auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

const HomePage = ({navigation}) => {
  const currentUser = auth.currentUser;

  console.log("Home");

  useEffect(() => {

    const userIdRef = ref(database, 'userId/' + currentUser.uid);

    const handleStateChange = (state) => {
      console.log(state)
      if (state === 'background' || state === 'inactive') {
        runTransaction(userIdRef, (user) => {
          if (user) {
            user.status = false;
            return user;
          } else {
            return user;
          }
        })
      } else if (state === 'active') {
        runTransaction(userIdRef, (profile) => {
          if (profile) {
            if (profile.status) {
              signOut(auth)
              .then(() => {
                navigation.replace('Landing');
                Alert.alert("You have been signed out");
              })
              .catch((error) => {
                Alert.alert('Error');
                console.log(error);
              });
              return profile;
            } else {
              profile.status = true;
              return profile;
            }
          } else {
            return profile;
          }
        });
      }
    }

    const subscribe = AppState.addEventListener('change', handleStateChange);

    try {
      if (!currentUser.isAnonymous) {
        // to handle user online status when user closes the app suddenly
        onDisconnect(userIdRef).update({ status: false, ongoingSessions: null });
        // use runTransaction to update the number of online account correctly
        runTransaction(userIdRef, (profile) => {
          if (profile) {
            profile.status = true;
            return profile;
          } else {
            return profile;
          }
        });
      } else {
        // if anonymous user, then delete the account
        onDisconnect(userIdRef).remove();
      }
    } catch (error) {
      console.log(error);
    }
    return () => subscribe.remove();
  }, []);

  /*useEffect(() => {
    const userIdRef = ref(database, 'userId/' + currentUser.uid);
    try {
      if (!currentUser.isAnonymous) {
        // to handle user online status when user closes the app suddenly
        onDisconnect(userIdRef).update({ status: false, ongoingSessions: null });
        // use runTransaction to update the number of online account correctly
        /*runTransaction(userIdRef, (profile) => {
          if (profile) {
            profile.status = true;
            return profile;
          } else {
            return profile;
          }
        });
      } else {
        // if anonymous user, then delete the account
        onDisconnect(userIdRef).remove();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);*/

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: ({ onPress, accessibilityState }) => {
          const tabName =
            route.name === 'StudyDashboardTab' ? 'Study'
            : route.name === 'StudySessionTab' ? 'Session'
            : route.name === 'StudyFeedsTab' ? 'Feeds'
            : route.name === 'AchievementsTab' ? 'Achievement'
            : route.name === 'SettingTab' ? 'Setting' : '';

          if (accessibilityState.selected) {
            return (
              <Pressable
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
              >
                <Ionicons
                  name={route.name === 'StudyDashboardTab' ? 'book' :
                    route.name === 'StudyFeedsTab' ? 'people' :
                    route.name === 'AchievementsTab' ? 'trophy' :
                    route.name === 'SettingTab' ? 'menu' :
                    route.name === 'StudySessionTab' ? 'easel' : 'book-outline'}
                  size={25}
                  color={'#710EF1'}
                />
                <Text style={{ color: '#710EF1', fontSize: 10 }}>{tabName}</Text>
              </Pressable>
            );
          } else {
            return (
              <Pressable
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={onPress}
                accessibilityRole="button"
              >
                <Ionicons
                  name={route.name === 'StudyDashboardTab' ? 'book'
                    : route.name === 'StudyFeedsTab' ? 'people'
                    : route.name === 'AchievementsTab' ? 'trophy'
                    : route.name === 'SettingTab' ? 'menu'
                    : route.name === 'StudySessionTab' ? 'easel' : 'book-outline'}
                  size={25}
                  color={'gray'}
                />
                <Text style={{ color: 'gray', fontSize: 10 }}>{tabName}</Text>
              </Pressable>
            );
          }
        },
        tabBarIcon: ({ focused }) => {
          return <Ionicons
            name={route.name === 'StudyDashboardTab' ? focused ? 'book' : 'book-outline'
              : route.name === 'StudyFeedsTab' ? focused ? 'people' : 'people-outline'
              : route.name === 'AchievementsTab' ? focused ? 'trophy' : 'trophy-outline'
              : route.name === 'SettingTab' ? focused ? 'menu' : 'menu-outline'
              : route.name === 'StudySessionTab' ? focused ? 'easel' : 'easel-outline' : 'book-outline'}
            size={25}
            color={focused ? '#710EF1' : 'gray'}
          />;
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
      })}
    >
      <Tab.Screen name={'StudyDashboardTab'} component={StudyDashboardTab} options={{ tabBarLabel: 'Study', headerShown: false }} />
      {!currentUser.isAnonymous && <Tab.Screen name={'StudySessionTab'} component={StudySessionTab} options={{ tabBarLabel: 'Session', headerShown: false }} />}
      <Tab.Screen name={'StudyFeedsTab'} component={StudyFeedsTab} options={{ tabBarLabel: 'Feeds', headerShown: false }} />
      {!currentUser.isAnonymous && <Tab.Screen name={'AchievementsTab'} component={AchievementTab} options={{ tabBarLabel: 'Achievement', headerShown: false }} />}
      <Tab.Screen name={'SettingTab'} component={SettingTab} options={{ tabBarLabel: 'Setting', headerShown: false }} />
    </Tab.Navigator>
  );
};

export default HomePage;
