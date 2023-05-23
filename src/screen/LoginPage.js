import React, { useState } from "react";
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
  Button,
} from "react-native";

const LoginPage = ({navigation}) => {
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (text) => {
    setName(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const forgotPassword = () => {
    console.log("Forgot Password Pressed");
  };

  const goToSignup = () => navigation.navigate("Signup");

  const goToHome = () => navigation.navigate("Home");

  const goToLanding = () => navigation.navigate("Landing");

  return (
    <KeyboardAvoidingView style={styles.container1} >
      <TouchableOpacity style={styles.button} onPress={goToLanding}>
        <Text style={styles.text7} >{'\u2190'}</Text >
      </TouchableOpacity>
      <Image source={require("../../assets/logoOnly.png")} />
      <Text style={styles.text1}>Log in now!</Text>
      <TextInput
        style={styles.text2}
        placeholder="Enter your email address"
        textAlign="left"
        keyboardType="email-address"
        onChangeText={handleNameChange}
        value={name}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.text2}
        placeholder="Enter your password"
        textAlign="left"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.pressable1}
        onPress={goToHome}
      >
        <Text style={styles.text3}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={forgotPassword}>
        <Text style={styles.text4}>Forgot your password?</Text>
      </TouchableOpacity>
      <View style={styles.container2}>
        <Text style={styles.text5}>Don't have an account?</Text>
        <TouchableOpacity style={styles.pressable2} onPress={goToSignup}>
          <Text style={styles.text6}>Sign up</Text>
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
    marginBottom: 16,
  },
  text5: {
    fontSize: 14,
    color: "gray",
    marginRight: 50,
  },
  text6: {
    fontSize: 14,
    color: "#710EF1",
    fontWeight: "bold",
    textDecorationLine: "underline",
    padding: 5,
  },
  text7: {
    fontSize: 35,
    color: "#710EF1",
    fontWeight: "bold",
  },
  pressable1: {
    width: 325,
    height: 40,
    MarginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#710EF1",
    marginBottom: 16,
    borderRadius: 10,
  },
  button: {
    position: 'relative',
    bottom: 150,
    right: 150
  }
});

export default LoginPage;
