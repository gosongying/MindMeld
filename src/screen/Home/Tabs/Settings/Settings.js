import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Details from '../../../../components/Home/Settings/Details';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, database } from "../../../../../firebase"
import { goOffline, update, ref, increment, runTransaction, remove } from 'firebase/database';

const Settings = ({navigation}) => {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.isAnonymous) {
        setIsGuest(true);
      } else {
        setIsGuest(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const options = [
    { id: '2', title: 'Study Buddy Settings', screen: 'FriendListSetting' , hide: isGuest },
    // { id: '3', title: 'Group List', screen: 'GroupList' },
    { id: '4', title: 'Sessions Settings', screen: 'SessionsSetting', hide: isGuest },
    { id: '5', title: 'Achievement Settings', screen: 'AchievementSettings', hide: isGuest },
    { id: '1', title: 'Privacy Settings', screen: 'Privacy', hide: isGuest},
    { id: '9', title: 'About', screen: 'About' },
    { id: '8', title: 'Help & Support', screen: 'HelpAndSupport' },
    { id: '6', title: 'Feedback', screen: 'Feedback' },
    { id: '7', title: 'Terms and Conditions', screen: 'TermsAndCondition' },
    { id: '10', title: 'Logout', screen: 'Landing' },
  ];

  const navigateToScreen = (screen) => {
    if (screen === 'Landing') {  //when Logout is clicked.
      if (auth.currentUser.isAnonymous) {
        auth.currentUser.delete()
          .then(() => {
            console.log("Guest user deleted successfully");
            navigation.replace(screen);
          })
          .catch((error) => {
            console.log("Error deleting guest user:", error);
          });
          return;
      }
      const currentUser = auth.currentUser;
      const id = currentUser ? currentUser.uid : null; // Check if currentUser exists before accessing its uid property
      signOut(auth)
        .then(() => {
          console.log("signed out successfully");
          // use runTransaction to update the number of online account correctly
          if (currentUser && !currentUser.isAnonymous) { // Check if currentUser exists and is not anonymous
            runTransaction(ref(database, 'userId/' + id), (profile) => {
              if (profile) {
                profile.status--;
                return profile;
              } else {
                return profile;
              }
            });
          } else if (id) { // Check if id exists (non-null)
            remove(ref(database, 'userId/' + id));
          }
          navigation.replace("Landing");
        })
        .catch((error) => console.log(error));
    } else {
      navigation.replace(screen);
    }
  };
  

  const icon = (item) => {
    let iconName;
    if (item.id === '1') {
      iconName = 'key';
    } else if (item.id === '2') {
      iconName = 'person';
    } else if (item.id === '3') {
      iconName = 'people';
    } else if (item.id === '4') {
      iconName = 'time';
    } else if (item.id === '5') {
      iconName = 'trophy';
    } else if (item.id === '6') {
      iconName = 'chatbubbles';
    } else if (item.id === '7') {
      iconName = 'document-text';
    } else if (item.id === '8') {
      iconName = 'help-circle';
    } else if (item.id === '9') {
      iconName = 'information-circle';
    } else if (item.id === '10') {
      iconName = 'log-out'
    }
    return iconName;
  };

  const renderOption = ({ item }) => {
    if (item.hide) {
      return null; // Hide the option if it should be hidden
    }
    return (
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Details navigation={navigation} /> 
        {/* Pass the navigation prop */}
      </View>
      <View style={styles.separator} />
      <View style={styles.optionListContainer}>
        <FlatList
          data={options}
          renderItem={renderOption}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  friendItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  friendName: {
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  forumContainer: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    paddingTop: 30,
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
});

export default Settings;
