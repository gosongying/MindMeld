import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AchievementHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundPattern} />
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
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AchievementHeader;
