import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Sample data for groups
const groupsData = [
  { id: '1', name: 'CS2100' },
  { id: '2', name: 'CS2030S' },
  { id: '3', name: 'CS2040S' },
  { id: '4', name: 'IS1108' },
];

const Groups = () => {
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.groupItem}>
        <Text style={styles.groupName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { flex: 1 }]}>My Groups</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groupsData}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.groupListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  moreText: {
    fontSize: 16,
    color: '#888',
  },
  groupListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Groups;
