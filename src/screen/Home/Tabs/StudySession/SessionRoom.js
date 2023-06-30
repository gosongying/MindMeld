import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { auth, database } from '../../../../../firebase';
import { ref, set, push, child, runTransaction, onValue } from 'firebase/database';
import ChatRoom from '../../../../components/Home/Session/ChatRoom';
import ToDoList from './ToDoList';
import Participants from './Participants';

const SessionRoom = ({route, navigation}) => {
  const session = route.params.session;

  useEffect(() => {
    const interval = setInterval(() => {
        updateTimeStay();
      }, 60000);
      return () => {
        clearInterval(interval);
      }

  }, [])

  const updateTimeStay = () => {
    try {
      runTransaction(ref(database, 'userId/' + auth.currentUser.uid), (user) => {
        //to update the user time stay in the session every minute.
        if (user) {
          user.upcomingSessions = user.upcomingSessions.map((sessionObj) => sessionObj.id === session.id? {...sessionObj, timeStay: sessionObj.timeStay + 1}: sessionObj);
          user.timeInSession = user.timeInSession + (1 / 60);
          console.log('update time')
          return user;
        } else {
          return user;
        }
      });
    } catch(error) {
      console.log(error);
      Alert.alert("Error");
    }
  }

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