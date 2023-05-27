import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Hardcoded Names
const friendListData = [
  { id: '1', name: 'John', status: 'Online' },
  { id: '2', name: 'Emily', status: 'Away' },
  { id: '3', name: 'Michael', status: 'Offline' },
  { id: '4', name: 'Sophia', status: 'Online' },
  { id: '5', name: 'William', status: 'Offline' },
  { id: '6', name: 'Emma', status: 'Away' },
  { id: '7', name: 'Oliver', status: 'Online' },
  { id: '8', name: 'Ava', status: 'Away' },
];

const FriendList = () => {

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image
        source={require('../../../../assets/profileholder.png')} // Replace with actual image source
        style={styles.avatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>My Friends</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={friendListData}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moreText: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendStatus: {
    fontSize: 14,
    color: '#888888',
  },
  flatListContainer: {
    flex: 1,
    height: '33%',
  },
  flatListContent: {
    paddingBottom: 40,
  },
});

export default FriendList;
