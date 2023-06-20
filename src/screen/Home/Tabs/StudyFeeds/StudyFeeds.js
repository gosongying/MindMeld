import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';;
import Feeds from '../../../../components/Home/Feed/Feeds';
import FeedHeader from '../../../../components/Home/Feed/FeedHeader';

const StudyFeeds = ({navigation}) => {

  // //item to be shown
  // const DATA = [
  //   {
  //     id: '1',
  //     title: 'Tab',
  //     component: CommunityTab,
  //   },
  //   {
  //     id: '2',
  //     title: 'FriendList',
  //     component: FriendList,
  //   },
  // ];

  const renderOption = ({ item }) => (
    <View style={styles.optionContainer}>
      <item.component navigation={navigation}/>
    </View>
  );

  return (
    <View style={styles.container}>
      <FeedHeader/>
      {/* <FlatList
        data={DATA}
        renderItem={renderOption}
        keyExtractor={(item) => item.id}
      /> */}
      <Feeds navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  myGroupsContainer: {
    backgroundColor: '#e8e8e8',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  friendListContainer: {
    backgroundColor: '#e8e8e8',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  optionContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 5,
  },
});

export default StudyFeeds;
