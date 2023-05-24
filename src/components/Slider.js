import React from 'react';
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
  } from "react-native";

  const {width, height} = Dimensions.get('screen');

  const Slides = [
      {id: 1, title: "firsttab", image: require("../../assets/firsttab.jpg")},
      {id: 2, title: "secondtab", image: require("../../assets/secondtab.jpeg")},
      {id: 3, title: "thirdtab", image: require("../../assets/thirdtab.jpeg")},
      {id: 4, title: "forthtab", image: require("../../assets/forthtab.jpeg")}
]

  const Slider = () => {

    const renderItem = ({item}) => {
        return (<View style={styles.container} >
            <Image source={item.image} style={styles.image} />
        </View>)
    }

    return (
        <View>
            <FlatList 
            data={Slides} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            //showsHorizontalScrollIndicator={false}
            />
        </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems:"center",
        
    },
    image: {
        resizeMode:"stretch",
        width,
        height: 400,
        borderRadius:50
    
        
    }
  })

  export default Slider
