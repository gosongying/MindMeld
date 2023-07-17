import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    TextInput,
    Alert,
    FlatList,
    ScrollView
  } from "react-native";
import { auth, database } from '../../../../../firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateEmail, updatePassword } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';
import { runTransaction, ref, onValue, get, set, push } from 'firebase/database';

  const Privacy = ({navigation}) => {
    const currentUser = auth.currentUser;

    const oldEmail = currentUser.email;
    const [newEmail, setNewEmail] = useState(oldEmail);
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [interests, setInterests] = useState([]);
    const [modal, setModal] = useState(false);

    useEffect(() => {
      const interestsRef = ref(database, `userId/${currentUser.uid}/interests`);
      get(interestsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const interests = snapshot.val();
            setInterests(interests);
          } else {
            console.log("No interests found for the user");
          }
        })
        .catch((error) => {
          console.error("Failed to get interests:", error);
        });
    }, [currentUser.uid]);

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

    const renderInterestItem = ({ item }) => (
      <TouchableOpacity
        style={[styles.toggleButton, interests.includes(item) && styles.toggleButtonSelected]}
        onPress={() => handleToggleInterest(item)}
        disabled={isLoading}
      >
        <Text style={styles.toggleButtonText}>{item}</Text>
      </TouchableOpacity>
    );

    const handleToggleInterest = (selectedInterest) => {
      
      if (interests.includes(selectedInterest)) {
        setInterests(interests.filter((interest) => interest !== selectedInterest));
        console.log(interests);
      } else {
        setInterests([...interests, selectedInterest]);
        console.log(interests);
      }
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
           // Update the interests in the database
            const interestsRef = ref(database, `userId/${currentUser.uid}/interests`);
            set(interestsRef, interests);
            goToHome();
            setIsLoading(false);
            Alert.alert("Successfully updated changes");
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
            <Text style={styles.title}>Account</Text>
            <TouchableOpacity
            onPress={showInfo}>
              <MaterialIcons name='privacy-tip' size={30} style={styles.icon} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView>

          
          <View style={{alignItems: 'center', padding: 10}}>
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>New Email</Text>
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
            editable={!isLoading}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>New Password</Text>
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

          <View style={styles.interestContainer}>
              <Text style={styles.label}>Study of Interest: </Text>
              <View style={styles.toggleButtonContainer}>
                <FlatList
                  data={[
                    'Sciences',
                    'Business and Management',
                    'Humanities',
                    'Engineering',
                    'Social Sciences',
                    'Health and Medical',
                    'Arts and Fine Arts',
                    'Technology',
                    'Environmental Studies',
                    'Education',
                    'Law and Legal Studies',
                    'Language',
                    'Math and Statistics',
                  ]}
                  renderItem={renderInterestItem}
                  keyExtractor={(item) => item}
                  extraData={interests}
                  scrollEnabled={false}
                  numColumns={2} // Display interests in two columns
                />
              </View>
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
          )}
        </View>
        </ScrollView>

        {modal && (
          <View style={styles.infoContainer}>
            <Text numberOfLines={2} style={styles.infoText}>Leaving the email or password fields blank will result in no changes to those fields.</Text>
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
        width: '100%',
        fontSize: 16,
        padding: 10
      },
      emailContainer: {
        width: '100%',
      } ,
      emailText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
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
        marginTop: 20,
      },
      passwordInput: {
        borderRadius: 10,
        borderWidth: 1,
        height: 40,
        width: '100%',
        fontSize: 16,
        padding: 10
      },
      passwordText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
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
        color: 'white',
        fontWeight: '700'
      },
      loading: {
        height: 40,
        marginTop: 30
      },
      infoContainer: {
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 80, 200, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        padding: 10,
        position: 'absolute',
        top: 30,
        left: 15,
        margin: 5,
        alignSelf: 'center',
      },
      infoText: {
        fontSize: 16,
        color: 'white'
      },
      toggleButton: {
        backgroundColor: 'lightgray',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
        marginRight: 10,
      },
      toggleButtonSelected: {
        backgroundColor: 'mediumpurple'
      },
      label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold'
      },
      interestContainer: {
        marginTop: 20,
        width: '100%'
      }
  })

  export default Privacy