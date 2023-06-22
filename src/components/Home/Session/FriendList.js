import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth, database } from '../../../../firebase';
import { get, onValue, ref } from 'firebase/database';

const FriendList = ({navigation}) => {

  const [friendClicked, setFriendClicked] = useState(null);
  const [friendListData, setFriendListData] = useState([]);
  const [friendListId, setFriendListId] = useState([]);
  
  const currentUser = auth.currentUser;
  useEffect(() => {
    //listen to the change of friend list
    //to get the latest friend list
    const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), async (snapshot) => {
      let friends = [];
      const friendList = snapshot.val().friendList ? snapshot.val().friendList : [];
      if (friendList) {
        setFriendListId(friendList);
        //to make sure friendlist is added before set
        await Promise.all(friendList.map(async (id) => {
          const userRef = ref(database, 'userId/' + id);   
          await get(userRef)
          .then((user) => {
            friends.push(user.val());
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Error");
          });
          return;
        }));
        setFriendListData(friends);
        friendList.map((id) => {
          //attach listener to each of the friend to get their status update
          const unsubscribe = onValue(ref(database, 'userId/' + id), (snapshot) => {
            const user = snapshot.val();
            if (user) {
              const id = user.uid;
              //update the specific user with status update
              const newFriendList = friends.map((item) => item.uid === id ? user : item)
              setFriendListData(newFriendList);
              return () => {
                unsubscribe();
              }
            }
          })
        })
        return;
      } 
      setFriendListId([]);
      setFriendListData(friends);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const goToFLM = () => {
    //pass the friend list to prevent get data through network request twice
    navigation.navigate("FriendListMore", {friendListData, friendListId});
  };

  const renderFriendItem = ({ item }) => (
    <View>
      <TouchableOpacity 
      onPress={() => setFriendClicked(item)}
      style={styles.friendItem}>
        {item.photo ? (
          <Image 
          source={{uri: item.photo}}
          style={styles.avatar} />
        ) : (
          <Image
          source={require('../../../../assets/profileholder.png')} //if didnt set profile picture
          style={styles.avatar}
        />
        )}
        {/* status indicator */}
        {item.status > 0 && <View style={styles.statusIndicator}/>}
        <View style={styles.friendInfo}>
            <View style={styles.nameAndGender}>
                <Text style={styles.friendName} numberOfLines={1}>{item.username}</Text>
                {item.gender === 'male' ? (
                  <Fontisto name='male' size={10} color='dodgerblue' style={{marginLeft: 5}}/>
                  ) : (
                  <Fontisto name='female' size={10} color='pink' style={{marginLeft: 5}}/>
                  )}
            </View>
        </View>
      </TouchableOpacity>
      {/* separator */}
      <View style={styles.separator} />
    </View>
  );

  const back = () => {
    setFriendClicked(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>My Study Buddies</Text>
        <TouchableOpacity onPress={goToFLM}>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={friendListData}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.username}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          style={{ flex: 1 }}
        />
      </View>

      <Modal visible={friendClicked !== null} transparent animationType='fade' >
        {friendClicked && <View style={styles.userClickedContainer}>
          <View style={styles.userClicked}>
            <View style={styles.backAndAdd}>
              <TouchableOpacity
                style={{marginRight: 190}}
                onPress={back}>
                <Text style={styles.back}>{'\u2190'}</Text >  
              </TouchableOpacity>
              <Ionicons name="checkbox" size={40} color={'green'}/>
              </View>
              <View style={styles.photoContainer}>
                {friendClicked.photo ? (
                    <Image
                    source={{uri: friendClicked.photo}} 
                    style={styles.photo}/>
                ) : (
                    <Image
                    source={require('../../../../assets/profileholder.png')}
                    style={styles.photo}/>
                )}
              </View>
              <View style={{backgroundColor: 'white', height: 1, width: 250, bottom: 10}}/>
              <View style={styles.textContainer}>
              <View style={styles.nameAndGender}> 
                  <Text style={styles.text} numberOfLines={1}>{friendClicked.username}</Text>
                  {friendClicked.gender === 'male' ? (
                      <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft: 10}}/>
                  ) : (
                      <Fontisto name='female' size={15} color='pink' style={{marginLeft: 10}}/>
                  )}
              </View>
              <View style={styles.interests}>
                <Text style={styles.text2}>Interests: {friendClicked.interests ? friendClicked.interests.join(', ') : "-"}</Text>
              </View>
            </View>
          </View>
        </View>
        }
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 25,
    marginTop: -10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moreText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendStatus: {
    fontSize: 14,
    color: '#888888',
  },
  flatListContainer: {
    flex: 1,
    height: '33%',
  },
  flatListContent: {
    paddingBottom: 40,
  },
  nameAndGender: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "90%"
  },
  separator: {
    height: 0.5,
    backgroundColor: 'gray',
  },
  userClickedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor:'rgba(0, 0, 0, 0.5)'
  },
  userClicked: {
    width: 300,
    backgroundColor: 'thistle',
    borderRadius: 10,
    alignItems: 'center',
    padding:30
  },  
  backAndAdd: {
    flexDirection: "row",
    alignItems: 'center',
    bottom: 20
  },
  back: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  photoContainer: {
    borderRadius: 50,
    height: 100,
    width: 100,
    overflow: 'hidden',
    bottom: 30
  },
  photo: {
    height: 100,
    width: 100,
  },
  textContainer: {
    alignItems: 'center',
  },
  interests: {
    top: 5,
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: "bold"
  },
  text2: {
    fontSize: 20,
    color: 'white'
  },
  statusIndicator: {
    height: 10,
    width: 10,
    backgroundColor: 'rgb(0, 200, 0)',
    borderRadius: 5,
    position: 'absolute',
    left: 36,
    top: 39
  }
});

export default FriendList;
