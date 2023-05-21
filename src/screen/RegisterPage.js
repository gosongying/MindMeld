import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TextInput, Pressable } from 'react-native';

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (text) => {
    setName(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/mindmeldlogo.jpeg')} />
      <Text style={styles.logInNow}>Log in now!</Text>
      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder='Enter your email address'
        textAlign='center'
        keyboardType="email-address"
        onChangeText={handleNameChange}
        value={name}
      />
      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder='Enter your password'
        textAlign='center'
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
      />
      {/* Rest of your components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    //TODO:
  },
  logInNow: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 325,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default RegisterPage;
