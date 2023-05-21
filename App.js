import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Image, TextInput, Pressable } from 'react-native';
import LandingPage from './src/screen/LandingPage'
import LoginPage from './src/screen/LoginPage'
import RegisterPage from './src/screen/RegisterPage'
import HomePage from './src/screen/HomePage'

const App = () => {

  return (
    <View style={styles.container}>
      <LoginPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
