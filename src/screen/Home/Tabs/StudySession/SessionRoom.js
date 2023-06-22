import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
  Animated,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth, database } from '../../../../../firebase';
import { ref, set, push, child, runTransaction, onValue } from 'firebase/database';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import ChatRoom from '../../../../components/Home/Session/ChatRoom';
import ToDoList from './ToDoList';
import Participants from './Participants';

const SessionRoom = ({route, navigation}) => {
  const session = route.params.session;

  const renderScreen = ({item}) => {
    return (
      <View style={styles.pageContainer}>
          <item.component session={session} navigation={navigation}/>
      </View>
    )
  };

 


  const data = [
       {id: 1, component: Participants},
       {id: 2, component: ChatRoom},
       {id: 3, component: ToDoList}
  ];


    /*const isCarousel = React.useRef(null);

    const [index, setIndex] = React.useState(0); //to keep track of currently active dot

    const renderDot = (index, active) => {
      const dotStyle = [styles.dot];
      if (active) {
        dotStyle.push(styles.activeDot);
      }
      return <View/>;
    };*/

    const getItemLayout = (_, index) => ({
      length: Dimensions.get('screen').width, // Set the height of each item
      offset: Dimensions.get('screen').width * index, // Calculate the offset based on item height and index
      index,
    });
  


 return (
  <FlatList 
  pagingEnabled
  data={data}
  renderItem={renderScreen}
  keyExtractor={(item) => item.id}
  horizontal
  contentContainerStyle={{flexGrow: 1}}
  initialScrollIndex={1}
  getItemLayout={getItemLayout}
  />
 )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50
  },
  image: {
    resizeMode:"stretch",
    width: Dimensions.get('screen').width,
    height: 450,
    position:'relative',
    right:12,
    marginTop:100,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  textContainer:{
    backgroundColor:'transparent',
   // width:200,
    justifyContent:'center',
    alignItems:'center',
   //height:20,
   marginBottom:435,
  },
  title: {
    fontSize:20,
    fontWeight:"bold"
  },
  des:{
    fontSize:15,
  },
  pageContainer: {
    width: Dimensions.get('screen').width,
    //justifyContent: 'center',
    //alignItems: 'center',
  },

});

export default SessionRoom;