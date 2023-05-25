import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

const SignupPage = ({ navigation }) => {
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
    <KeyboardAvoidingView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goToLanding}>
        <Text style={styles.backButtonText}>&larr;</Text>
      </TouchableOpacity>
      <Image source={require("../../assets/logoOnly.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome. Sign Up now!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        textAlign="left"
        keyboardType="email-address"
        onChangeText={handleNameChange}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        textAlign="left"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
      />
      <TouchableOpacity style={styles.signupButton} onPress={goToHome}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already a user?</Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 35,
    color: "#710EF1",
    fontWeight: "bold",
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: 325,
    height: 40,
    fontSize: 14,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  signupButton: {
    width: 325,
    height: 40,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#710EF1",
    marginBottom: 10,
    borderRadius: 10,
  },
  signupButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "gray",
    marginVertical: 15,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 12,
    color: "gray",
    marginRight: 10,
  },
  loginLink: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
});

export default SignupPage;
