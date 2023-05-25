import React, {useRef} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Image,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    FlatList,
    Dimensions,
    SafeAreaView,
    ImageBackground,
  } from "react-native";

  import Carousel, { Pagination } from 'react-native-snap-carousel'

  const data =[
    {id: 1, title: "Boost Productivity", des:"Effortless Study with MindMeld", image: require("../../assets/firsttab2.jpg")},
      {id: 2, title: "Study Smart", des: "Achieve More with MindMeld's Effective Techniques", image: require("../../assets/secondtab.jpeg")},
      {id: 3, title: "Unlock Potential", des: "Maximize Learning Abilities with MindMeld's Tools", image: require("../../assets/thirdtab2.jpg")},
      {id: 4, title: "Join the Community", des: "Connect, Learn, and Succeed Together with MindMeld", image: require("../../assets/forthtab.jpeg")}
];


function CarouselItem({item}) {
    return (
        <View>
            <ImageBackground source={item.image} style={styles.image} borderRadius={50}>
            <View style={styles.textContainer}>
             <Text style={styles.title}>{item.title}</Text>
             <Text style={styles.des}>{item.des}</Text>
            </View>
            </ImageBackground>
            
        </View>
    )
}

export default function CarouselCard() {
   
    const isCarousel = React.useRef(null);

    const [index, setIndex] = React.useState(0);

    const renderDot = (index, active) => {
      const dotStyle = [styles.dot];
      if (active) {
        dotStyle.push(styles.activeDot);
      }
      return <View style={dotStyle} />;
    };


 return (
  <SafeAreaView  >
    <Carousel
      layout="tinder"
      layoutCardOffset={9}
      ref={isCarousel}
      data={data}
      renderItem={CarouselItem}
      sliderWidth={Dimensions.get('window').width + 80}
      itemWidth={Math.round(Dimensions.get('window').width + 80 * 0.7)}
      inactiveSlideShift={0}
      onSnapToItem={(index) => setIndex(index)}
      useScrollView={true}
      scrollEnabled={true}
      autoplay={true}
/>
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
  

    );
}

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
   marginBottom:420,
  },
  title: {
    fontSize:20,
    fontWeight:"bold"
  },
  des:{
    fontSize:15,
  }

});