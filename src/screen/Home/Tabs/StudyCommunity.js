import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Groups from '../../../components/Home/Community/Groups';
import FriendList from '../../../components/Home/Community/FriendList';
import CommunityHeader from '../../../components/Home/Community/CommunityHeader';
import CommunityTab from '../../../components/Home/Community/CommunityTab';

const StudyCommunity = () => {
  const DATA = [
    {
      id: '1',
      title: 'Tab',
      component: CommunityTab,
    },
    {
      id: '2',
      title: 'Groups',
      component: Groups,
    },
    {
      id: '3',
      title: 'FriendList',
      component: FriendList,
    },
  ];

  const renderOption = ({ item }) => (
    <View style={styles.optionContainer}>
      <item.component />
    </View>
  );

  return (
    <View style={styles.container}>
      <CommunityHeader/>
      <FlatList
        data={DATA}
        renderItem={renderOption}
        keyExtractor={(item) => item.id}
      />
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
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export default StudyCommunity;
