import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, database } from '../../../../firebase';
import { onValue, ref, get } from 'firebase/database';

const Details = ({ navigation }) => {
  //since the the profile settings page hasn't been done,
  //when the detail button is clicked, it is logged onto the console,
  //but not navigating to the page first. It will function well when the 
  //profile page is done.
  const profileSetting = () => navigation.navigate('Profile');

  const currentUser = auth.currentUser;

  //const [username, setUsername] = useState('');

  const userImage = currentUser.photoURL;

  const username = currentUser.displayName;

  /*useEffect(() => {
    if (currentUser.isAnonymous) {
      setUsername("Anonymous user");
    } else {
      setUsername(currentUser.displayName);
    }
  }, []);*/


  return (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
        {userImage ? (
          <Image source={{uri: userImage}} style={styles.profile}/>
        ) : (
          <Image source={require('../../../../assets/profileholder.png')} style={styles.profile} />
        )}
        </View>
        <View style={styles.detailsContainer}>
          {username ? (
          <Text style={styles.name} numberOfLines={1}>{username}</Text>
          ) : (
          <Text style={styles.name}>Anonymous user</Text>
          )}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level 10</Text>
            <View style={styles.trophyContainer}>
              <Text style={styles.trophyText}>Bronze</Text>
              <Ionicons name="trophy" color="#CD7F32" style={styles.trophyIcon} />
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={profileSetting}>
          <Ionicons name="create" size={20} />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  profile: {
    height: 70,
    width: 70,
    marginRight: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  levelText: {
    marginRight: 10,
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyText: {
    marginRight: 5,
  },
  trophyIcon: {
    marginLeft: 5,
  },
  photoContainer: {
    borderRadius: 35,
    height: 70,
    width: 70,
    overflow: 'hidden',
    right: 10
  }
});

export default Details;
