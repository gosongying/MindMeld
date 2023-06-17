import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, Alert, TextInput, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, database, storage } from '../../../../firebase';
import { onValue, ref as databaseRef, get, remove, runTransaction, update } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import { useRef } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import Fontisto from 'react-native-vector-icons/Fontisto';

const Details = ({ navigation }) => {
  //since the the profile settings page hasn't been done,
  //when the detail button is clicked, it is logged onto the console,
  //but not navigating to the page first. It will function well when the 
  //profile page is done.

  const currentUser = auth.currentUser;

  const oldUsername = currentUser.displayName;

  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [newUsername, setNewUsername] = useState(oldUsername);

  const [isLoading, setLoading] = useState(false);

  const [image, setImage] = useState(currentUser.photoURL);

  const [gender, setGender] = useState('');

  const isAnonymous = currentUser.isAnonymous;

  useEffect(() => {
    if (!isAnonymous) {
      get(databaseRef(database, 'userId/' + currentUser.uid))
      .then((snapshot) => {
        setGender(snapshot.val().gender);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("An error occurs");
      })
    }
  }, [])

  const editUsername = () => {
    setIsEditingUsername(true);
  };

  const handleChangedUsername = () => {
    setLoading(true);
    if (!newUsername) {
      //if the new username is empty
      Alert.alert("Username cannot be empty");
      setLoading(false);
      return;
    }
    if (newUsername === oldUsername) {
      //if the username does not change
      setLoading(false);
      setIsEditingUsername(false);
      return;
    }
    //if the username changes
    const newUsernameRef = databaseRef(database, 'usernames/' + newUsername);
    const oldUsernameRef = databaseRef(database, 'usernames/' + oldUsername);
    const userIdRef = databaseRef(database, 'userId/' + currentUser.uid);
    try {
      //retrieve user's old data
      get(oldUsernameRef)
      .then((oldUser) => runTransaction(newUsernameRef, (user) => {
        if (user) {
          //if the username already existed
          setLoading(false);
          Alert.alert("Username already existed");
          setIsEditingUsername(true);
          return;
        } else {
          //username does not exist
          //delete old data
          return oldUser.val();
        }
      })
      .then((result) => {
        if (result.committed) {
          //if set username successfully
          remove(oldUsernameRef);
          update(userIdRef, {
            username: newUsername
          })
          updateProfile(currentUser, {
          displayName: newUsername,
          }).then(() => {
            setLoading(false);
            setIsEditingUsername(false);
          });
        }
      }));
   } catch (error) {
    setLoading(false);
    Alert.alert("An error occurs");
    return;
   }
  };

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
      const result = await uploadBytes(fileRef, blob).catch((error) => console.log(error));

      blob.close();
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.log(error);
      Alert.alert("Error");
    }
  };


  const selectImageLibrary = async () => {

    setLoading(true);
    //request permission
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied");
      setLoading(false);
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });
    //get image successfully
    if (!result.canceled) {
     // await deleteImage().catch((error) => console.log(error))
      const newImage = await uploadImageAsync(result.assets[0].uri)
      .catch((error) => console.log(error));

      update(databaseRef(database, 'userId/' + currentUser.uid), {
        photo: newImage
      }).catch((error) => {
        console.log(error);
        Alert.alert("An error occus");
      });
      updateProfile(currentUser, {
        photoURL: newImage
      })
      .then(() => {
        setImage(newImage);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("An error occurs")
        }
      );
      return;
    }
    setLoading(false);
  };

  const selectImageCamera = async () => {
    setLoading(true);
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied");
      setLoading(false);
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    //get image successfully
    if (!result.canceled) {
      // await deleteImage().catch((error) => console.log(error))
       const newImage = await uploadImageAsync(result.assets[0].uri)
       .catch((error) => console.log(error));
       //await deleteImage();
       updateProfile(currentUser, {
         photoURL: newImage
       })
       .then(() => {
        setImage(newImage);
        setLoading(false);
       })
       .catch((error) => {
         console.log(error);
         Alert.alert("An error occurs");
       }
     );
     return;
    }
    setLoading(false);
  };

  const deleteImage = async () => {
    const deleteRef = storageRef(storage, 'Images/' + currentUser.uid);
    try {
      await deleteObject(deleteRef);
      //image deleted successfully
      console.log("Image deleted succesfully");
    } catch (error) {
      console.log(error)
      Alert.alert("Error during delete");
    }
  };

  return (
    //for cancel changing username
    <TouchableWithoutFeedback  onPress={() => {
      setIsEditingUsername(false);
      setNewUsername(oldUsername);
    }}>
      <View style={styles.container}>
        <View style={styles.outerPhotoContainer}>
          <View style={styles.photoContainer}>
            {image ? (
              <Image source={{uri: image}} style={styles.profile} />
            ) : (
              <Image source={require("../../../../assets/profileholder.png")} style={styles.profile}/> 
            )}      
            <View style={styles.statusIndicator} />
            </View>
          {/* anonymous user cannot change profile picture */}
          {!isAnonymous && (
            <View style={styles.libraryAndCamera}>
            <TouchableOpacity 
            onPress={selectImageLibrary}
            disabled={isLoading}>
              <FontAwesome name={'photo'} size={22} />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={selectImageCamera}
            disabled={isLoading}>
              <MaterialCommunityIcons name={'camera-outline'} size={27} />
            </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          {isEditingUsername ? (
            <TextInput 
            style={[styles.name, styles.nameWhenEditing]}
            value={newUsername}
            onChangeText={(text) => setNewUsername(text)}
            onSubmitEditing={handleChangedUsername}
            autoCapitalize='none'
            autoFocus={true}/>
          ) : (
            <View style={styles.nameAndEdit}>
              <View style={{flexDirection: 'row', alignItems:'center', width: 200}}>
                <Text style={styles.name} numberOfLines={1}>{oldUsername}</Text>
                {gender === 'male' ? (
                  <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft:5}}/>
                ) : gender === 'female' ? (
                  <Fontisto name='female' size={15} color='pink' style={{marginLeft: 5}}/>
                ) : (
                  <View />
                )}
              </View>
              {/* anonymous user cannot change username */}
              { !isAnonymous && (
                <TouchableOpacity 
                onPress={editUsername}
                style={{left: 20}}
                disabled={isLoading}>
                  <Ionicons name="create" size={20} />
                </TouchableOpacity>
              )}
            </View>
          )}
          {!isAnonymous && (
            <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level 10</Text>
            <View style={styles.trophyContainer}>
              <Text style={styles.trophyText}>Bronze</Text>
              <Ionicons name="trophy" color="#CD7F32" style={styles.trophyIcon} />
            </View>
          </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    //height: 120
  },
  profile: {
    height: 70,
    width: 70,
    marginRight: 20,
    left: 5
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  nameWhenEditing: {
    textAlign: 'left',
    borderBottomColor: "gray",
    borderBottomWidth: 2,
    width: "90%"
  },
  detailsContainer: {
    flex: 1,
    left: 5,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  levelText: {
    marginRight: 10,
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyText: {
    marginRight: 5,
  },
  trophyIcon: {
    marginLeft: 5,
  },
  photoContainer: {
    borderRadius: 45,
    height: 85,
    width: 85,
    overflow: 'hidden',
    right: 10,
    justifyContent: 'center',
  },
  nameAndEdit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryAndCamera: {
    width:80,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    right: 10
  },
  outerPhotoContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    backgroundColor: 'rgb(0, 200, 0)',
    width: 12,
    height: 12,
    borderRadius: 6,
    bottom: 15,
    left: 63,
    position: 'absolute',    
  }
});

export default Details;