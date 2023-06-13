import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { auth, database, storage } from "../../../firebase";
import { ref as databaseRef, runTransaction, set, get, onValue } from 'firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getDownloadURL, uploadBytes, ref as storageRef, deleteObject } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons'

const SignupPage2 = ({ navigation}) => {

  console.log("Signup2")

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [gender, setGender] = useState('');
  const [confirmUsername, setConfirmUsername] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const currentUser = auth.currentUser;

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

    //handle empty username
    if (!username) {
      Alert.alert("Username cannot be empty");
      setLoading(false);
      return;
    }

    //handle empty gender
    if (!gender) {
      Alert.alert("Please select your gender");
      setLoading(false);
      return;
    }
    
  const userId = currentUser.uid;

  //reference to the users node based on their username 
  const usernameRef = databaseRef(database, 'usernames/' + username);

  try {
  runTransaction(usernameRef, (user) => {
    if (user) {
      setLoading(false);
      Alert.alert("Username already existed");
      return;
    } else {
      const data = {
        uid: userId,
        interests: interests,
        gender: gender,
        friendList: [],
        groupList: [],
      };
      return data;
    }
  }).then(async (result) => {
    if (result.committed) {
    //if set username successfully
    updateProfile(currentUser, {
      displayName: username,
      photoURL: (image ? await uploadImageAsync(image) : null)
    }).then(() => {
      navigation.replace("Home");
    });
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
    setConfirmUsername(!confirmUsername);
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

  const goToSignUp = () => {
    navigation.navigate('Signup');

  }

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToSignUp}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
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
                  disabled={isLoading}>
                    <FontAwesome name={'photo'} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                  style={styles.pictureText} 
                  onPress={selectImageCamera}
                  disabled={isLoading}>
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
                onChangeText={setUsername}
                placeholder="Enter your username"
                autoCapitalize='none'
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
              <Text style={styles.label}>Study of Interest:</Text>
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
                >
                  {agreeTerms ? (
                  <View style={styles.checkbox}>
                    <Ionicons name={"checkmark"} size={15} />
                  </View>
                ) : (
                  <View style={styles.checkbox} />
                    )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>Agree to Terms and Conditions</Text>
              </View>

            </View>

            <TouchableOpacity
              style={[styles.nextButton, (!confirmUsername || !agreeTerms) && styles.nextButtonDisabled]}
              onPress={handleConfirmDetails}
              disabled={!agreeTerms || !confirmUsername || isLoading}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
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
  header: {
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
});

export default SignupPage2;
