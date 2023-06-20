import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AchievementHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#8A2BE2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AchievementHeader;