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

const SessionRoom = ({route}) => {
  const session = route.params.session;

  const renderScreen = ({item}) => {
    return (
      <item.component session/>
    )
  };

 


  const data = [
      {id: 1, component: ChatRoom},
       {id: 2, component: ToDoList},
       {id: 3, component: Participants}
  ];


    const isCarousel = React.useRef(null);

    const [index, setIndex] = React.useState(0); //to keep track of currently active dot

    const renderDot = (index, active) => {
      const dotStyle = [styles.dot];
      if (active) {
        dotStyle.push(styles.activeDot);
      }
      return <View/>;
    };


 return (
  <SafeAreaView >
    <Carousel
      layout="tinder"
      layoutCardOffset={9}
      ref={isCarousel}
      data={data}
      renderItem={renderScreen}
      sliderWidth={Dimensions.get('window').width + 80}
      itemWidth={Math.round(Dimensions.get('window').width + 80 * 0.7)}
      inactiveSlideShift={0}
      onSnapToItem={(index) => setIndex(index)}
      useScrollView={true}
      scrollEnabled={true}
      autoplay={true}
      keyExtractor={(item) => item.id}
/>
{/* for creating pagination */}
    <Pagination
  dotsLength={data.length}
  activeDotIndex={index}
  carouselRef={isCarousel}
  dotStyle={{
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    bottom:40
  }}
  inactiveDotOpacity={0.4}
  inactiveDotScale={0.7}
  tappableDots={true}
  renderDot={renderDot}
/>
  </SafeAreaView>
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
  }

});

export default SessionRoom;