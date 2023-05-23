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
} from "react-native";

const SignupPage = ({navigation}) => {
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

  const goToHome = () => navigation.navigate("Home");

  const goToLogin = () => navigation.navigate("Login");

  const goToLanding = () => navigation.navigate("Landing");

  return (
    <KeyboardAvoidingView style={styles.container1}>
      <TouchableOpacity style={styles.button} onPress={goToLanding}>
        <Text style={styles.text6} >back</Text >
      </TouchableOpacity>
      <Image source={require("../../assets/logoOnly.png")} />
      <Text style={styles.text1}>Welcome. Sign Up now!</Text>
      <TextInput
        style={styles.text2}
        placeholder="Enter your email address"
        textAlign="left"
        keyboardType="email-address"
        onChangeText={handleNameChange}
        value={name}
      />
      <TextInput
        style={styles.text2}
        placeholder="Enter your password"
        textAlign="left"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
      />
      <TouchableOpacity
        style={styles.pressable1}
        onPress={goToHome}
      >
        <Text style={styles.text3}>Sign up</Text>
      </TouchableOpacity>
      <Text style={{ marginBottom: 15 }}>
        ___________________________________________
      </Text>
      <View style={styles.container2}>
        <Text style={styles.text4}>Already a user?</Text>
        <TouchableOpacity onPress={goToLogin}>
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
    fontSize: 18,
    color: "#710EF1",
  },
  pressable1: {
    width: 325,
    height: 40,
    MarginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#710EF1",
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    position: 'relative',
    bottom: 150,
    right: 150
  }
});

export default SignupPage;
