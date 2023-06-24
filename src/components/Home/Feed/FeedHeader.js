import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Feeds</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#8A2BE2',
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default FeedHeader;