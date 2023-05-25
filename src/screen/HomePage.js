import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    FlatList,
    SafeAreaView
  } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Details from '../components/Details'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Features from '../components/Features';
import StudyMode from '../components/StudyMode';
import StudyWhat from '../components/StudyWhat';
import HelloName from '../components/HelloName';

const StudyDashBoard = () => {
    const DATA = [
      {
        id: '1',
        title: 'studyWhat',
        component: StudyWhat,
      },
      {
        id: '2',
        title: 'studyMode',
        component: StudyMode,
      },
      {
        id: '3',
        title: 'Features',
        component: Features,
      },
    ];
  
    const renderOption = ({ item }) => (
        <View style={styles.optionContainer}>
            <item.component />
        </View>
      );
  
    return (
      <SafeAreaView style={styles.container}>
        <HelloName />
        <FlatList
          data={DATA}
          renderItem={renderOption}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      </SafeAreaView>
    );
  };

const StudyCommunity = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const Achievements = () => {
    return(
        <View style={styles.container}>
        </View>
    )
}

const Menu = ({ navigation }) => {
    const options = [
      { id: '1', title: 'Profile Settings', screen: 'Profile' },
      { id: '2', title: 'Privacy Settings', screen: 'Privacy' },
      { id: '3', title: 'About', screen: 'About' },
      { id: '4', title: 'Logout', screen: 'Landing' },
    ];
  
    const navigateToScreen = (screen) => {
      navigation.navigate(screen);
    };
  
    const icon = (item) => {
      let iconName;
      if (item.id === '1') {
        iconName = 'people';
      } else if (item.id === '2') {
        iconName = 'key';
      } else if (item.id === '3') {
        iconName = 'information-circle';
      } else if (item.id === '4') {
        iconName = 'log-out';
      }
      return iconName;
    };
  
    const renderOption = ({ item }) => (
      <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
        <View style={styles.optionContainer}>
          <View style={styles.leftContainer}>
            <Ionicons name={icon(item)} size={25} style={styles.icon} />
            <Text style={styles.optionTitle}>{item.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={25} style={styles.icon} />
        </View>
        <View
            style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                width: '88%',
                alignSelf: 'center',
            }}
        />
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailsContainer}>
          <Details />
        </View>
        <View style={styles.separator} />
        <View style={styles.optionListContainer}>
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    );
  };
const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
          
                    if (route.name === 'StudyDashBoard') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'StudyCommunit') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Achievements') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Menu') {
                        iconName = focused ? 'menu' : 'menu-outline';      
                    }
          
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#710EF1',
                tabBarInactiveTintColor: 'gray',
                })}>
            <Tab.Screen name={'StudyDashBoard'} component={StudyDashBoard} options={{ tabBarLabel: 'Study', headerShown:false }}/>
            <Tab.Screen name={'StudyCommunit'} component={StudyCommunity} options={{ tabBarLabel: 'Community', headerShown:false }}/>
            <Tab.Screen name={'Achievements'} component={Achievements} options={{ tabBarLabel: 'Achievement', headerShown:false }}/>
            <Tab.Screen name={'Menu'} component={Menu} options={{ tabBarLabel: 'Settings', headerShown:false }}/>
        </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    listContentContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
      },
      optionContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        marginVertical: 10,
      },
      detailsContainer: {
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      separator: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      optionListContainer: {
        flex: 1,
      },
      optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        marginRight: 10,
        color: 'black',
      },
      optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
      },
  })

export default HomePage