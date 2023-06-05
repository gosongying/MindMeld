import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { database, auth } from '../../../../firebase';
import { onValue, ref, get } from 'firebase/database';

const HelloName = () => {

  const [username, setUsername] = useState('');

  //const currentUserId = auth.currentUser.uid;
  //const userIdRef = ref(database, '/users/' + currentUserId);

  //to get the user's username from the database
  //get(userIdRef).then((snapshot) => {
  //  if (snapshot.exists()) {
  //    const data = snapshot.val().username;
  //    setUsername(data);
  //  } else {
   //   setUsername('Anonymous user');
  //  }
 // });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greetingText}>Hello,</Text>
        {username ? (
          <Text style={styles.nameText}>{username}</Text>
        ) : (
          <Text style={styles.nameText}>...Loading</Text>
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
