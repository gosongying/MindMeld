import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View
  } from "react-native";
  import FriendList from '../../../../components/Home/Session/FriendList';
  import Ionicons from 'react-native-vector-icons/Ionicons';

  const FriendListSetting = ({navigation}) => {
    const goToHome = () => navigation.navigate('Settings');

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.button} onPress={goToHome}>
                <Text style={styles.back}>{'\u2190'}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Study Buddy Settings</Text>
              <Ionicons name='person' size={30} style={styles.icon} color={'white'}/>
            </View>
              <FriendList navigation={navigation}/>
        </View>
    )
  }

  const styles = StyleSheet.create({
    back: {
      fontSize: 35,
      fontWeight: 'bold',
      color: 'white',
    },
    button: {
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      backgroundColor: '#8A2BE2',
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingTop: 50
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 5,
      color: 'white'
    },
  })

  export default FriendListSetting