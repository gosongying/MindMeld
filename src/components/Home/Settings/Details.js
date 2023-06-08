import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, Alert, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, database, storage } from '../../../../firebase';
import { onValue, ref as databaseRef, get, remove, runTransaction } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import { useRef } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

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

  const isAnonymous = currentUser.isAnonymous;

  console.log(image)

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
      <View style={styles.container}>
        <View style={styles.outerPhotoContainer}>
          <View style={styles.photoContainer}>
            {image ? (
              <Image source={{uri: image}} style={styles.profile} />
            ) : (
              <Image source={require("../../../../assets/profileholder.png")} style={styles.profile}/> 
            )}      
          </View>
          {/* anonymous user cannot change profile picture */}
          {!isAnonymous && (
            <View style={styles.libraryAndCamera}>
            <TouchableOpacity 
            style={styles.icon} 
            onPress={selectImageLibrary}
            disabled={isLoading}>
              <FontAwesome name={'photo'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.icon} 
            onPress={selectImageCamera}
            disabled={isLoading}>
              <MaterialCommunityIcons name={'camera-outline'} size={30} />
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
              <View>
              <Text style={styles.name} numberOfLines={1}>{oldUsername}</Text>
              </View>
              {/* anonymous user cannot change username */}
              { !isAnonymous && (
                <TouchableOpacity 
                onPress={editUsername}
                style={{position: 'relative', left: 10}}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  profile: {
    height: 70,
    width: 70,
    marginRight: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    width: 200
  },
  nameWhenEditing: {
    textAlign: 'left',
    borderBottomColor: "gray",
    borderBottomWidth: 2,
  },
  detailsContainer: {
    flex: 1,
    left: 10,
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
    borderRadius: 35,
    height: 70,
    width: 70,
    overflow: 'hidden',
    right: 10
  },
  nameAndEdit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryAndCamera: {
    width:80,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    right: 10
  },
  icon: {
    marginTop: 10
  },
  outerPhotoContainer: {
    alignItems: 'center',
  },
});

export default Details;