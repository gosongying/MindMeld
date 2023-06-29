import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';

const Leaderboard = () => {
  const leaderboardData = [
    { name: 'John', score: 500 },
    { name: 'Emma', score: 450 },
    { name: 'Daniel', score: 400 },
    { name: 'Sophia', score: 350 },
    { name: 'Oliver', score: 300 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboardData.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemRank}>{index + 1}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemScore}>{item.score}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6600CC',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
  },
  itemRank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 18,
  },
  itemScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Leaderboard;
