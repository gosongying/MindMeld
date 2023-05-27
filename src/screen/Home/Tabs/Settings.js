import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Details from '../../../components/Home/Settings/Details';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Settings = ({ navigation }) => {
  const options = [
    { id: '1', title: 'Profile Settings', screen: 'Profile' },
    { id: '2', title: 'Privacy Settings', screen: 'Privacy' },
    { id: '3', title: 'Friend List', screen: 'FriendList' },
    { id: '4', title: 'Group List', screen: 'GroupList' },
    { id: '5', title: 'Sessions Setting', screen: 'SessionsSetting' },
    { id: '6', title: 'Achievement Settings', screen: 'AchievementSettings' },
    { id: '7', title: 'Feedback', screen: 'Feedback' },
    { id: '8', title: 'Terms and Conditions', screen: 'TermsAndConditions' },
    { id: '9', title: 'Help & Support', screen: 'HelpAndSupport' },
    { id: '10', title: 'About', screen: 'About' },
    { id: '11', title: 'Logout', screen: 'Landing' },
  ];

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  const icon = (item) => {
    let iconName;
    if (item.id === '1') {
      iconName = 'body';
    } else if (item.id === '2') {
      iconName = 'key';
    } else if (item.id === '3') {
      iconName = 'person';
    } else if (item.id === '4') {
      iconName = 'people';
    } else if (item.id === '5') {
      iconName = 'time';
    } else if (item.id === '6') {
      iconName = 'trophy';
    } else if (item.id === '7') {
      iconName = 'chatbubbles';
    } else if (item.id === '8') {
      iconName = 'document-text';
    } else if (item.id === '9') {
      iconName = 'help-circle';
    } else if (item.id === '10') {
      iconName = 'information-circle';
    } else if (item.id === '11') {
      iconName = 'log-out'
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
    </SafeAreaView>
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
});

export default Settings;
