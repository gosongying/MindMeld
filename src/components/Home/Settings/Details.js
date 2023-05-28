import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Details = ({ navigation }) => {
  //since the the profile settings page hasn't been done,
  //when the detail button is clicked, it is logged onto the console,
  //but not navigating to the page first. It will function well when the 
  //profile page is done.
  const profileSetting = () => console.log("Profile");

  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <Image source={require('../../../../assets/profileholder.png')} style={styles.profile} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>Your Name</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    height: 50,
    width: 50,
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
});

export default Details;
