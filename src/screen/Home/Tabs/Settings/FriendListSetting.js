import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    SafeAreaView
  } from "react-native";
  import FriendList from '../../../../components/Home/Session/FriendList';

  const FriendListSetting = ({navigation}) => {
    const goToHome = () => navigation.navigate("Settings") 

    return (
        <SafeAreaView style={{flex: 1}}>
            <TouchableOpacity style={styles.button} onPress={goToHome}>
                 <Text style={styles.back} >{'\u2190'}</Text >
            </TouchableOpacity>
            <FriendList navigation={navigation}/>
        </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    back: {
        fontSize: 35,
        fontWeight: "bold",
      },
      button: {
        position: 'relative',
        bottom: 0,
        left: 20
      }
  })

  export default FriendListSetting