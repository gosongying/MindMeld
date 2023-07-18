import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
} from "react-native";
import CarouselCard from "../../components/Authentication/CarouselCard";
import { signInAnonymously, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, database } from "../../../firebase"
import { set, ref } from "firebase/database";


const LandingPage = ({navigation}) => {

  const [isLoading, setLoading] = useState(false);

  const goToLogin = () => {
    setLoading(true);
    navigation.replace("Login");  //go to login screen
  }

  const goToSignup = () => {
    setLoading(true);
    navigation.replace("Signup");  //go to signup screen
  }

  const continueAsGuest = async () => {  //to signin anonymously

    setLoading(true);

    /*signInAnonymously(auth)
    .then(() => {
      updateProfile(auth.currentUser, {
        displayName: 'Guest'
      })
      .then(() => {
        console.log("Anon");
        navigation.replace("Home");
      });
      })
      .catch((error) => console.log(error));*/

    try {
      await signInAnonymously(auth)
      .then(() => {
        navigation.replace('Home');
      })

      const currentUser = auth? auth.currentUser: null;
      updateProfile(currentUser, {
        displayName: 'Guest'
      })
    } catch (error) {
      console.log(error);
      Alert.alert('Error');
    }
  };

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
        <TouchableOpacity 
          style={styles.pressableOne} 
          onPress={goToLogin}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.pressableTwo} 
          onPress={goToSignup}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={continueAsGuest} disabled={isLoading}>
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
    bottom:40
  },
  navigator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottom: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    bottom:80
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
