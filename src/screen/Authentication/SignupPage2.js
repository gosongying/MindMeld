import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert, Modal, ScrollView } from 'react-native';
import { auth, database, storage } from "../../../firebase";
import { ref as databaseRef, runTransaction, set, get, onValue } from 'firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons'

const SignupPage2 = ({ navigation}) => {

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [gender, setGender] = useState('');
  const [confirmUsername, setConfirmUsername] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [termsModal, setTermsModal] = useState(false);

  const currentUser = auth? auth.currentUser: null;

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    try {
      //to make sure every profile picture in the storage belongs to exactly one user
      const fileRef = storageRef(storage, 'Images/' + currentUser.uid);
      const result = await uploadBytes(fileRef, blob);
  
      blob.close();
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.log(error);
      Alert.alert("Error");
    }
  };

  const selectImageLibrary = async () => {
    //request permission
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //get image successfully
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const selectImageCamera = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied");
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
     }
  };

  const handleConfirmDetails = async () => {
    // Perform any necessary actions to confirm details (e.g., API calls, data validation)
    setLoading(true);
    
  const userId = currentUser?.uid;

  //reference to the users node based on their username 
  const usernameRef = databaseRef(database, 'usernames/' + username);

  try {
  runTransaction(usernameRef, (user) => {
    if (user) {
      setLoading(false);
      Alert.alert("Username already exists");
      return;
    } else {
      const data = {
        uid: userId,
      };
      return data;
    }
  }).then(async (result) => {
    if (result.committed) {
    //if set username successfully
    const photo = image? await uploadImageAsync(image) : null
    await Promise.all([
      updateProfile(currentUser, {
        displayName: username,
        photoURL: photo
      }),
      set(databaseRef(database, 'userId/' + userId), {
        username: username,
        interests: interests,
        gender: gender,
        friendList: [],
        groupList: [],
        photo: photo,
        uid: userId,
        status: false,
        xp: 0,
        timeInSession: 0,
        numberOfFeeds: 0,
        numberOfComments: 0,
      })
    ])
    .then(() => {
      navigation.replace("Home");
    })
    .catch(error => {
      Alert.alert("Error")
    })
    //navigation.replace('Home');
  
    }
  });
  } catch (error) {
  Alert.alert("Error");
  }
  };

  const handleToggleInterest = (selectedInterest) => {
    if (interests.includes(selectedInterest)) {
      setInterests(interests.filter((interest) => interest !== selectedInterest));
    } else {
      setInterests([...interests, selectedInterest]);
    }
  };

  const handleToggleConfirmUsername = () => {
    if (username.trim().toLowerCase() === 'guest') {
      Alert.alert('Username cannot be "Guest"');
      setConfirmUsername(false);
      return;
    }
    if (username.trim() === '') {
      Alert.alert('Username cannot be empty');
      setConfirmUsername(false);
      return;
    }

    if (username.includes(' ')) {
      Alert.alert('No whitespace allowed in the username');
      setUsername('');
      setConfirmUsername(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      Alert.alert('Username cannot contain special characters');
      setUsername('');
      setConfirmUsername(false);
      return;
    }

    setConfirmUsername((prevState) => !prevState);
  };

  const handleUsernameBlur = () => {
    setUsername(username.trim())
  };

  const handleChangeUsername = (text) => {
    setUsername(text);
    setConfirmUsername(false);
  };

  const handleToggleAgreeTerms = () => {
    setAgreeTerms(!agreeTerms);
  };

  const handleToggleMale = () => {
    if (gender === 'male') {
      setGender('');
    } else {
      setGender('male');
    }
  };

  const handleToggleFemale = () => {
    if (gender === 'female') {
      setGender('');
    } else {
      setGender('female');
    }
  };

  const reset = () => {
    setUsername('');
    setInterests([]);
    setAgreeTerms(false);
    setGender('');
    setConfirmUsername(false);
    setImage(null);
  }

  const renderInterestItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.toggleButton, interests.includes(item) && styles.toggleButtonSelected]}
      onPress={() => handleToggleInterest(item)}
      disabled={isLoading}
    >
      <Text style={styles.toggleButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  const usageAgreement = `By using this app, you agree to abide by these terms and conditions. If you do not agree, please refrain from using the app.`;

  const appPurpose = `This app is provided for educational purposes only. It is not intended for commercial use.`;

  const userResponsibilities = `- Users must use the app in compliance with all applicable laws and regulations.
- Users are responsible for maintaining the confidentiality of their account information.
- Users must not engage in any unauthorized activities or misuse the app.`;

  const limitationOfLiability = `- The app and its developers shall not be held liable for any damages or losses incurred while using the app.
- The app is provided "as is" without any warranties or guarantees.`;

  const intellectualProperty = `- All intellectual property rights related to the app belong to the developers.
- Users are prohibited from copying, modifying, or distributing the app without prior consent.`;

  const termination = `- The developers reserve the right to terminate or suspend access to the app at any time.`;

  const data = [
    { id: '1', label: 'Sciences' },
    { id: '2', label: 'Business and Management' },
    { id: '3', label: 'Humanities' },
    { id: '4', label: 'Engineering' },
    { id: '5', label: 'Social Sciences' },
    { id: '6', label: 'Health and Medical' },
    { id: '7', label: 'Arts and Fine Arts' },
    { id: '8', label: 'Technology' },
    { id: '9', label: 'Environmental and Sustainability Studies' },
    { id: '10', label: 'Education' },
    { id: '11', label: 'Law and Legal Studies' },
    { id: '12', label: 'Language' },
    { id: '13', label: 'Math and Statistics' },
  ];
  
  return(
    <View style={styles.container}>
      <View style={styles.header2}>
          <Text style={styles.back}>{'    '}</Text>
        <Text style={styles.title}>Create your account</Text>
        <TouchableOpacity style={styles.closeButton} onPress={reset}>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, margin: 15}}>
      <FlatList
        showsVerticalScrollIndicator={false} // Hide the vertical scroll bar
        //data={data}
        ListHeaderComponent={
          <>
 

           <View style={styles.container}>
              <View style={styles.outerPictureContainer}>
                <View style={styles.pictureContainer}>
                 {image ? (
                    <Image source={{uri: image}} style={styles.picture} />
                    ) : (
                    <Image source={require("../../../assets/profileholder.png")} style={styles.picture}/> 
                    )}       
                </View>
                <View style={styles.libraryAndCamera}>
                  <TouchableOpacity 
                  style={styles.pictureText} 
                  onPress={selectImageLibrary}
                  disabled={isLoading}
                  testID='1'>
                    <FontAwesome name={'photo'} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                  style={styles.pictureText} 
                  onPress={selectImageCamera}
                  disabled={isLoading}
                  testID='2'>
                    <MaterialCommunityIcons name={'camera-outline'} size={35} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Username:</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={handleChangeUsername}
                onBlur={handleUsernameBlur}
                placeholder="Enter your username"
                autoCapitalize="none"
                editable={!isLoading}
                clearButtonMode="while-editing"
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Gender:</Text>  
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                onPress={handleToggleMale}
                style={[styles.toggleButton, gender === 'male' && styles.toggleMaleSelected]}
                disabled={isLoading}
                testID='male'
                >
                  <MaterialCommunityIcons name={"face-man-outline"} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={handleToggleFemale}
                style={[styles.toggleButton, gender === 'female' && styles.toggleFemaleSelected]}
                disabled={isLoading}
                >
                  <MaterialCommunityIcons name={"face-woman-outline"} size={30} />
                </TouchableOpacity>
              </View>               
            </View>

            <View style={styles.formRow}>
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
                  numColumns={2} // Display interests in two columns
                />
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>Confirmation:</Text>

              <Text style={styles.usernameText}>
                Username: <Text style={styles.boldText}>{username}</Text>
              </Text>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={handleToggleConfirmUsername}
                  disabled={isLoading}
                  testID='3'
                >
                {confirmUsername ? ( 
                  <View style={styles.checkbox}>
                    <Ionicons name={"checkmark"} size={15} />
                  </View>
                ) : (
                  <View style={styles.checkbox} />
                    )}
                    
                </TouchableOpacity>
                <Text style={styles.checkboxText}>Confirm username</Text>
              </View>

              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  onPress={handleToggleAgreeTerms}
                  disabled={isLoading}
                  testID='4'
                >
                  {agreeTerms ? (
                  <View style={styles.checkbox}>
                    <Ionicons name={"checkmark"} size={15} />
                  </View>
                ) : (
                  <View style={styles.checkbox} />
                    )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>Agree to</Text>
                <TouchableOpacity onPress={() => setTermsModal(true)}>
                  <Text style={[styles.checkboxText, {textDecorationLine: 'underline', marginLeft: 5, fontWeight: 'bold', color: '#8A2BE2'}]}>Terms and Conditions</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.nextButton, (!confirmUsername || !agreeTerms || !gender || !username) && styles.nextButtonDisabled]}
              onPress={handleConfirmDetails}
              disabled={!agreeTerms || !confirmUsername || isLoading || !gender || !username}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
    <Modal visible={termsModal} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>

        <View style={styles.header3}>
          <Text style={styles.title2}>Terms and Conditions</Text>
        </View>

        <ScrollView>
          <Text style={styles.updated}>Updated June 2023</Text>
          <Text style={styles.acknowledgement}>
            Please read these terms and conditions carefully. By using the app, you acknowledge and agree to these terms.
          </Text>
          <Text style={styles.sectionTitle}>1. Usage Agreement</Text>
          <Text style={styles.terms}>{usageAgreement}</Text>
          <Text style={styles.sectionTitle}>2. App Purpose</Text>
          <Text style={styles.terms}>{appPurpose}</Text>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.terms}>{userResponsibilities}</Text>
          <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
          <Text style={styles.terms}>{limitationOfLiability}</Text>
          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.terms}>{intellectualProperty}</Text>
          <Text style={styles.sectionTitle}>6. Termination</Text>

          <Text style={styles.terms}>{termination}{'\n'}</Text>
        </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setTermsModal(false);
                }}
                style={[styles.modalButton]} 
              >
              <Text style={styles.modalButtonText}>I Agree to the Terms and Conditions</Text>
              </TouchableOpacity>
          </View>
      </Modal>

  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20, 
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10, 
    textAlign: 'center',
    color: '#fff',
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flex: 0.5,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: 'gray',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmationContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usernameText: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#710ef1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  toggleButton: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  toggleButtonText: {
    fontSize: 16,
  },
  toggleButtonSelected: {
    backgroundColor: 'mediumpurple'
  },
  genderContainer: {
    flexDirection: 'row'
  },
  toggleMaleSelected: {
    backgroundColor: 'dodgerblue'
  },
  toggleFemaleSelected: {
    backgroundColor: 'pink'
  },
  picture: {
    height: 100,
    width: 100,
    resizeMode: 'cover'
  },
  pictureContainer: {
    borderRadius:50,
    height: 100,
    width:100, 
    overflow: 'hidden'
  },
  pictureText: {
    marginTop: 10,
  },
  outerPictureContainer: {
    alignItems:'center'
  },
  libraryAndCamera: {
    width:80,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  backButton: {
    marginRight: 10,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    marginLeft: 10,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 45,
    marginLeft: 20,
  },
  updated: {
    color: '#88888888',
    margin: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  terms: {
    fontSize: 14,
    lineHeight: 24,
    marginHorizontal: 20,
  },
  acknowledgement: {
    fontSize: 14,
    lineHeight: 24,
    marginHorizontal: 20,
    marginVertical: 15
  },
  header3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8A2BE2',
    padding: 25,
    marginTop: -60,
    marginHorizontal: -10,
  },
});

export default SignupPage2;
