import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    TextInput,
    Alert
  } from "react-native";
import { auth } from '../../../../../firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateEmail, updatePassword } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';

  const Privacy = ({navigation}) => {
    const currentUser = auth.currentUser;

    const oldEmail = currentUser.email;
    const [newEmail, setNewEmail] = useState(oldEmail);
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false);

    const goToHome = () => navigation.goBack();

    const handleEmail = (text) => {
      setNewEmail(text);
    };

    const handlePassword1 = (text) => {
      setNewPassword1(text);
    };

    const handlePassword2 = (text) => {
      setNewPassword2(text);
    };

    const handleConfirmation = async () => {
      setIsLoading(true);
      try {
        await updateEmail(currentUser, newEmail)
        .then(async () => {
          //check for validation of password
          if (newPassword1 === '' && newPassword2 !== '') {
            Alert.alert("Enter your password");
            setIsLoading(false);
            return;
          } 
      
          if (newPassword1 !== '' && newPassword2 === '') {
            Alert.alert("Confirm your password")
            setIsLoading(false);
            return;
          } 
      
          if (newPassword1 !== newPassword2) {
            Alert.alert("Passwords do not match");
            setIsLoading(false);
            return;
          }

          await updatePassword(currentUser, newPassword1)
          .then(() => {
            goToHome();
            setIsLoading(false);
            Alert.alert("Update email and password successfully");
          });
        });
      } catch (error) {
        setIsLoading(false);
        const errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
          Alert.alert("Invalid email address");
        } else if (errorCode === "auth/email-already-in-use") {
          Alert.alert("Email address is already used by other account");
        } else if (errorCode === "auth/weak-password") {
          Alert.alert("Password must be at least 6 characters");
        } else {
          Alert.alert("Error");
        }
      }
    };

    const showInfo =() => {
      setModal(true);
      setTimeout(() => {
        setModal(false);
      }, 3000);
    };

    return (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={goToHome} disabled={isLoading}>
                 <Text style={styles.back}>{'\u2190'}</Text >
            </TouchableOpacity>
            <Text style={styles.title}>Privacy</Text>
            <TouchableOpacity
            onPress={showInfo}>
              <MaterialIcons name='privacy-tip' size={30} style={styles.icon} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', top: 35}}>
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>-------- New Email --------</Text>
            <TextInput 
            placeholder='Enter new email address'
            textAlign='left'
            keyboardType='email-address'
            value={newEmail}
            autoCapitalize='none'
            inputMode='email'
            clearButtonMode='while-editing'
            onChangeText={handleEmail}
            style={styles.emailInput}
            autoFocus
            editable={!isLoading}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>-------- New Password --------</Text>
            <TextInput 
            placeholder='Enter new password'
            textAlign='left'
            value={newPassword1}
            autoCapitalize='none'
            inputMode='none'
            clearButtonMode='while-editing'
            onChangeText={handlePassword1}
            style={[styles.passwordInput, {marginBottom: 10}]}
            secureTextEntry={true}
            editable={!isLoading}
            />
            <TextInput 
            placeholder='Confirm new password'
            textAlign='left'
            value={newPassword2}
            autoCapitalize='none'
            inputMode='none'
            clearButtonMode='while-editing'
            onChangeText={handlePassword2}
            style={styles.passwordInput}
            secureTextEntry={true}
            editable={!isLoading}
            />
          </View>
          { !isLoading? (
            <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmation}
            disabled={isLoading}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          ): (
            <View style={styles.loading}>
              <ActivityIndicator size='small' color="#0000ff" />
            </View>
          ) }
        </View>

        {modal && (
          <View style={styles.infoContainer}>
            <Text numberOfLines={2} style={styles.infoText}>If the email or password fields are left blank, they will not be updated.</Text>
          </View>
        )}
      </View>
    )
  }

  const styles = StyleSheet.create({
    back: {
        fontSize: 35,
        fontWeight: "bold",
        color: 'white',
        right: 10
      },
      button: {
        position: 'relative',
        bottom: 0,
        left: 20
      },
      emailInput: {
        borderRadius: 10,
        borderWidth: 1,
        height: 40,
        width: '85%',
        fontSize: 20,
        padding: 10
      },
      emailContainer: {
        width: '100%',
        alignItems: 'center'
      } ,
      emailText: {
        fontSize: 18,
        marginBottom: 10,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#8A2BE2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: 50,
        marginBottom: 20,
      },
      title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 15,
        color: 'white',
        right: 8
      },
      passwordContainer: {
        width: '100%',
        marginTop: 50,
        alignItems: 'center'
      },
      passwordInput: {
        borderRadius: 10,
        borderWidth: 1,
        height: 40,
        width: '85%',
        fontSize: 20,
        padding: 10
      },
      passwordText: {
        fontSize: 18,
        marginBottom: 10,
      },
      confirmButton: {
        width: '85%',
        height: 40,
        backgroundColor: '#8A2BE2',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20
      },
      confirmText: {
        fontSize: 20,
        color: 'white'
      },
      loading: {
        height: 40,
        marginTop: 30
      },
      infoContainer: {
        height: 50,
        borderRadius: 20,
        backgroundColor: 'rgba(0,80,200, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '78%',
        position: 'absolute',
        top: 105,
        left: 50,
      },
      infoText: {
        fontSize: 18,
        color: 'white'
      }
  })

  export default Privacy