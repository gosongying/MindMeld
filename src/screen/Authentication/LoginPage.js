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
  Modal
} from "react-native";

import { auth } from "../../../firebase"
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

const LoginPage = ({navigation}) => {
  
  const [email, setEmail] = useState("");  //email entered for login

  const [password, setPassword] = useState("");

  const[firstLoading, setFirstLoading] = useState(false);  //loading when login

  const [isModalVisible, setModalVisible] = useState(false);  //to pop up a prompt for entering email for resetting password

  const [emailReset, setEmailReset] = useState("");  //email entered for resetting password

  const [secondLoading, setSecondLoading] = useState(false);  //loading when reset password

  const resetPassword = () => {
    setSecondLoading(true);

    sendPasswordResetEmail(auth, emailReset)
      .then(() => {
        // Email sent successfully
        Alert.alert('Email Sent', 'A password reset link has been sent to your email.');
        setModalVisible(false);
        setEmailReset("");
        setSecondLoading(false);
      })
      .catch((error) => {
        // Handle password reset errors
        setSecondLoading(false);
        const errorCode = error.code
        const errorMessage = error.message;
        if (errorCode === "auth/missing-email") {
          Alert.alert("Email cannot be empty");
        } else if (errorCode === "auth/invalid-email") {
          Alert.alert("Invalid email address");
        } else if (errorCode === "auth/user-not-found") {
          Alert.alert("Account does not exist");
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };



  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const forgotPassword = () => {
    setModalVisible(true); //to popup the prompt
  };

  const goToSignup = () => navigation.replace("Signup");

  const goToLanding = () => navigation.replace("Landing");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //if user login successfully, go to Home screen
        navigation.replace("Home");
      } 
    })
  }, []);

  const loginUser = () => {

    setFirstLoading(true);

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //user signin successfully
      setFirstLoading(false);
      console.log(userCredential.user.email);
    })
    .catch((error) => {
      //handle error when login
      setFirstLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-email") {
        Alert.alert("Invalid email address");
      } else if (errorCode === "auth/wrong-password") {
        Alert.alert("Wrong password");
      } else if (errorCode === "auth/user-not-found") {
        Alert.alert("Account does not exist")
      } else if (errorCode === "auth/missing-password") {
        Alert.alert("Password cannot be empty");
      } else if (errorCode === "auth/too-many-requests") {
        Alert.alert("Too many attempts, please try again later")        
      } else {
        console.log(errorMessage);
      }
    })
  };

  return (
    <KeyboardAvoidingView style={styles.container1} >
      {/* Button for going back to the home screen */}
      <TouchableOpacity style={styles.button} onPress={goToLanding}>
        <Text style={styles.text7}>{'\u2190'}</Text >  
      </TouchableOpacity>
      <Image source={require("../../../assets/logoOnly.png")} />
      <Text style={styles.text1}>Log in now!</Text>
      <TextInput
        style={styles.text2}
        placeholder="Enter your email address"
        textAlign="left"
        keyboardType="email-address"
        onChangeText={handleEmailChange}
        value={email}
        autoCapitalize="none"
        editable={!firstLoading}
      />
      <TextInput
        style={styles.text2}
        placeholder="Enter your password"
        textAlign="left"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
        autoCapitalize="none"
        editable={!firstLoading}
      />
       
      {/* If it is loading, show the ActivityIndicator, else show the login button */} 
      {firstLoading ? (
        <View style={styles.loading1}>  
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : (
      <TouchableOpacity 
        style={styles.pressable1}
        onPress={loginUser}>
          <Text style={styles.text3}>Login</Text>
      </TouchableOpacity>
      )}

      <TouchableOpacity onPress={forgotPassword} disabled={firstLoading}>
        <Text style={styles.text4}>Forgot your password?</Text>
      </TouchableOpacity>
      
      <View style={styles.container2}>
        <Text style={styles.text5}>Don't have an account?</Text>
        <TouchableOpacity onPress={goToSignup} disabled={firstLoading}>
          <Text style={styles.text6}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Popup a prompt for entering email when user click the button forgot password */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.promptContainer}>
          <View style={styles.prompt}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Forgot Password</Text>
            <TextInput
              placeholder="Email"
              value={emailReset}
              onChangeText={text => setEmailReset(text)}
              style={styles.emailResetInput}
              autoCapitalize="none"
              editable={!secondLoading}
            />
            {/* If it is loading, show the ActivityIndicator, else show the reset password button */}
            {secondLoading ? (
              <View style={styles.loading2}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
            <TouchableOpacity onPress={resetPassword} style={styles.pressable2}>
               <Text style={{ color: 'white' }}>Reset Password</Text>
            </TouchableOpacity>
            )}

            <TouchableOpacity 
            onPress={() => {
              setModalVisible(false);
              setEmailReset("");
            }} 
            style={{ marginTop: 10, alignItems: "center"}}
            disabled={secondLoading}
            >
              <Text style={{ textDecorationLine: 'underline' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#710EF1",
    marginBottom: 16,
    borderRadius: 10,
  },
  loading1: {
    height: 40,
    marginBottom: 16,
    justifyContent: 'center'
  },
  loading2: {
    height: 40,
    justifyContent: 'center'
  },
  button: {
    position: 'relative',
    bottom: 150,
    right: 150
  },
  promptContainer: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'rgba(0, 0, 0, 0.5)', //to make the background blur.
  },
  prompt: {
    width: 300, 
    backgroundColor: `#e6e6fa`, 
    padding: 20, 
    borderRadius: 10
  },
  pressable2: {
    height:40,
    padding: 10, 
    backgroundColor: 'midnightblue', 
    borderRadius: 10,
    alignItems: "center",
  },
  emailResetInput: {
    height: 40, 
    borderWidth: 1, 
    marginBottom: 10, 
    paddingHorizontal: 10,
    borderRadius: 10,
  }
}); 
 
export default LoginPage;