import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Features = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="calculator-outline" style={styles.icon} />
          <Text style={styles.text}>Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="list-outline" style={styles.icon} />
          <Text style={styles.text}>To do</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="timer-outline" style={styles.icon} />
          <Text style={styles.text}>Clock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="copy-outline" style={styles.icon} />
          <Text style={styles.text}>Flash Cards</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="newspaper-outline" style={styles.con} />
          <Text style={styles.text}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="book-outline" style={styles.icon} />
          <Text style={styles.text}>Dictionary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    borderWidth: 2,
    borderColor: 'gray',
    marginRight: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 100,
    color: 'gray',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Features;
