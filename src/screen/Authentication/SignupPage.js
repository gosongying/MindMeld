import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { auth } from "../../../firebase"

import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const SignupPage = ({navigation}) => {
  const [name, setName] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //if user signup successfully, go to Home screen
        navigation.replace("Signup2");
      } 
    })
  }, []);


  const signupUser = () => {

    setLoading(true);

    createUserWithEmailAndPassword(auth, name, password)
    .then((userCredential) => {
      //signup successfully
      setLoading(false);
      console.log(userCredential.user.uid)
    })
    .catch((error) => {
      //handle error when signup
      setLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-email") {
        Alert.alert("Invalid email address");
      } else if (errorCode === "auth/email-already-in-use") {
        Alert.alert("Email address is already used by other account");
      } else if (errorCode === "auth/missing-password") {
        Alert.alert("Password cannot be empty");
      } else if (errorCode === "auth/missing-email") {
        Alert.alert("Email cannot be empty");
      } else if (errorCode === "auth/weak-password") {
        Alert.alert("Password must be at least 6 characters");
      } else {
        console.log(errorMessage);
      }
    })
  };

  //const goToHome = () => navigation.replace("Home");

  const goToLogin = () => {
    setLoading(true);
    navigation.replace("Login");
  };

  const goToLanding = () => {
    setLoading(true);
    navigation.replace("Landing");
  };

  useEffect(() => {
    setLoading(false);
  }, [navigation.getState().route]);


  return (
    <KeyboardAvoidingView style={styles.container1}>
      {/* Button for going back to the home screen */}
      <TouchableOpacity 
         style={styles.button} 
         onPress={goToLanding}
         disabled={isLoading}
      >
        <Text style={styles.text6} >{'\u2190'}</Text >
      </TouchableOpacity>
      <Image source={require("../../../assets/logoOnly.png")} />
      <Text style={styles.text1}>Welcome. Sign Up now!</Text>
      <TextInput
        style={styles.text2}
        placeholder="Enter your email address"
        textAlign="left"
        keyboardType="email-address"
        onChangeText={handleNameChange}
        value={name}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.text2}
        placeholder="Enter your password"
        textAlign="left"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      {/* If it is loading, show the ActivityIndicator, else show the signup button */} 
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )
        : (
        <TouchableOpacity
          style={styles.pressable1}
          onPress={signupUser}
          >
        <Text style={styles.text3}>Sign up</Text>
      </TouchableOpacity>
      )
        }
      
      <Text style={{ marginBottom: 15 }}>
        ___________________________________________
      </Text>
      <View style={styles.container2}>
        <Text style={styles.text4}>Already a user?</Text>
        <TouchableOpacity onPress={goToLogin} disabled={isLoading}>
          <Text style={styles.text5}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
  },
  text1: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text2: {
    width: 325,
    height: 40,
    fontSize: 14,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  text3: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  text4: {
    fontSize: 12,
    color: "gray",
    marginRight: 10,
  },
  text5: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
  text6: {
    fontSize: 35,
    color: "#710EF1",
    fontWeight: "bold",
  },
  pressable1: {
    width: 325,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#710EF1",
    marginBottom: 10,
    borderRadius: 10,
  },
  loading: {
    height: 40,
    marginBottom: 10
  },
  button: {
    position: 'relative',
    bottom: 150,
    right: 150
  }
});

export default SignupPage;
