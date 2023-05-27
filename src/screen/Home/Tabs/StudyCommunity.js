import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const StudyCommunity = ({ friendListData }) => {
  const renderFriendListItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.friendItem}>
        <Text style={styles.friendName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.friendListContainer}>
        <Text style={styles.sectionTitle}>Friend List</Text>
        <FlatList
          data={friendListData}
          renderItem={renderFriendListItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.chatContainer}>
        <Text style={styles.sectionTitle}>Chat</Text>
        {/* Add your chat component here */}
      </View>
      <View style={styles.forumContainer}>
        <Text style={styles.sectionTitle}>Forum</Text>
        {/* Add your forum component here */}
      </View>
    </View>
  );
};

StudyCommunity.propTypes = {
  friendListData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default StudyCommunity;
