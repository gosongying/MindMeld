import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const Leaderboard = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/leaderboard.webp')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 1200,
    height: 750,
    borderRadius: 10,
  },
});

export default Leaderboard;
