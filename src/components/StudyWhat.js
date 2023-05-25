import React from 'react';
import {
    View,
    Image,
  } from "react-native";

  const StudyWhat = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../assets/studywhat.png')}
          style={{ height: 200, width: 350, borderRadius: 10 }}
        />
      </View>
    );
  };

  export default StudyWhat