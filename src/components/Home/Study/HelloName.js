import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { auth, database } from '../../../../firebase';
import { ref, onValue } from 'firebase/database';

const HelloName = () => {
  
  console.log("HelloName")

  const [username, setUsername] = useState('');

  const currentUser = auth.currentUser;
  
  useEffect(() => {
    //to be synchronous with database to get
    //user most up-dated username
    //listen to user's username change
    const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val().username);
      }
    });
    return () => {
      unsubscribe();
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greetingText}>Hello,</Text>
        {username ? (
          <Text style={styles.nameText} numberOfLines={1}>{username}</Text>
        ) : (
          <Text style={styles.nameText}>Anonymous user</Text>
        )}
      </View>
      <Image
        source={require('../../../../assets/logoOnly.png')}
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
    fontSize: 25,
    fontWeight: 'bold',
  },
  logo: {
    width: 188 / 2,
    height: 120 / 2,
    marginRight: 20,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    backgroundColor: '#FFF',
  }
});

export default HelloName;
