import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const HelloName = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.nameText}>Your Name</Text>
      </View>
      <Image
        source={require('../../assets/logoOnly.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  greetingText: {
    color: 'gray',
    fontSize: 25,
  },
  nameText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  logo: {
    width: 188 / 2,
    height: 120 / 2,
    marginRight: 20,
  },
});

export default HelloName;
