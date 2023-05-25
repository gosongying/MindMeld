import React, { useState } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CarouselCard from "../components/CarouselCard";

const LandingPage = ({navigation}) => {

  const goToLogin = () => navigation.navigate("Login")
  const goToSignup = () => navigation.navigate("Signup");
  const continueAsGuest = () => navigation.navigate("Home");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MindMeld</Text>
        <Text style={styles.welcome}>Welcome!</Text>
      </View>
      <View style={styles.center}>
        <CarouselCard />
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.pressableOne} onPress={goToLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pressableTwo} onPress={goToSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={continueAsGuest}>
          <Text style={styles.guest}>Continue as a guest</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    //flex: 0.25
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 30,
    fontWeight: "bold",
  },
  center: {
    //flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    bottom:50
  },
  navigator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottom: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    bottom:50
   // flex: 0.25
  },
  pressableOne: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#710EF1",
    marginBottom: 16,
    borderRadius: 20,
    borderColor: "white",
  },
  pressableTwo: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#8fbc8f",
    marginBottom: 16,
    borderRadius: 20,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  guest: {
    textAlign: "center",
    color: "#1e90ff",
  },
});

export default LandingPage;
