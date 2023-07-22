import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, database } from "../../../../../firebase";
import { ref, runTransaction, set, get, onValue, update, child } from 'firebase/database';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';

const FriendListSetting = ({navigation}) => {
    const currentUser = auth?.currentUser;

    const [username, setUsername] = useState('');
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    //when clicking friends' profile
    const [isCheckingFriend, setIsCheckingFriend] = useState(false);
    const [usernameAdded, setUsernameAdded] = useState('');
    const [friendOrFriendSearched, setFriendOrFriendSearched] = useState(null);
    const [friendOrFriendSearchedId, setFriedOrFriendSearchedId] = useState('');
    const [friendListData, setFriendListData] = useState([]);
    const [friendListId, setFriendListId] = useState([]);
    //friend being deleted
    const [deletingFriend, setDeletingFriend] = useState(null);

    useEffect(() => {
        //listen to the change of friend list
        //to get the latest friend list
        const unsubscribe = onValue(ref(database, 'userId/' + currentUser?.uid), async (snapshot) => {
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

    const clickUser = (user) => {
        const level = Math.floor(user.xp / 100) + 1;
        const trophyColour = level<10?"#808080":level<20?"#B87333":level<30? '#C0C0C0':level<40?'gold':level<50?'#50C878':'#6EB2D4';
        const trophyText = level<10?'Iron':level<20?'Bronze':level<30?'Silver':level<40?'Gold':level<50?'Emerald':'Diamond';
        setIsCheckingFriend(true);
        setFriendOrFriendSearched({...user, trophyColour: trophyColour, trophyText: trophyText, level: level});
        setFriedOrFriendSearchedId(user.uid);
    };

    const renderFriendItem = ({ item }) => {
        if (item.username.startsWith(username) || !username) {
            return (
                <View>
                    <TouchableOpacity 
                    style={styles.friendItem}
                    onPress={() => clickUser(item)}>
                        { item.photo ? (
                            <Image 
                            source={{uri: item.photo}} 
                            style={styles.avatar}/>
                        ) : (
                            <Image
                            source={require('../../../../../assets/profileholder.png')} // Replace with actual image source
                            style={styles.avatar}/>
                        )}
                        {/* status indicator */}
                        {item.status > 0 && <View style={styles.statusIndicator}/>}
                        <View style={styles.friendInfo}>
                            <View style={styles.nameAndGender}>
                                <Text style={styles.friendName} numberOfLines={1}>{item.username}</Text>
                                {item.gender === 'male' ? (
                                    <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft:5}}/>
                                    ) : (
                                    <Fontisto name='female' size={15} color='pink' style={{marginLeft: 5}}/>
                                    )}
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleChat(item)}>
                            <Ionicons name="chatbubble-outline" size={25} style={{right: 40}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDeletingFriend(item)}>
                            <MaterialIcons 
                            name={"delete"}
                            size={25} 
                            style={{right: 35}}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {/* separator */}
                    <View style={styles.separator} />
                </View>
            );
        } 
    };

    const deleteFriend = (user) => {
        console.log(user);
        const userRef = ref(database, 'userId/');
        const me = child(userRef, currentUser.uid);
        const other = child(userRef, user.uid);
        const newFriendList = friendListId.filter((id) => id !== user.uid);
        try {
            runTransaction(me, (profile) => {
                if (profile) {
                    profile.friendList = newFriendList;
                    return profile;
                } else {
                    return profile;
                }
            }).then(() => {
                setFriendListId(newFriendList);
                setFriendListData(friendListData.filter((profile) => profile !== user));
            });

            runTransaction(other, (profile) => {
                if (profile) {
                    profile.friendList = profile.friendList.filter((id) => id !== currentUser.uid);
                    return profile;
                } else {
                    return profile;
                }
            }).then(() => {
                setDeletingFriend(null);
            })
        } catch (error) { 
            console.log(error);
            Alert.alert("Error");
        }
    };

    const handleSearchFriend = (username) => {
        if (!username) {
            Alert.alert("Username cannot be empty");
            return;
        }
        const usernameRef = ref(database, 'usernames/' + username);
        //to check if the username exists
        get(usernameRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userIdRef = ref(database, 'userId/' + snapshot.val().uid);
                get(userIdRef)
                .then((snapshot) => {
                    const level = Math.floor(snapshot.val().xp / 100) + 1;
                    const trophyColour = level<10?"black":level<20?"#B87333":level<30? '#C0C0C0':level<40?'gold':level<50?'#50C878':'#6EB2D4';
                    const trophyText = level<10?'Iron':level<20?'Bronze':level<30?'Silver':level<40?'Gold':level<50?'Emerald':'Diamond';
                    setFriendOrFriendSearched({...snapshot.val(), level: level, trophyColour: trophyColour, trophyText: trophyText});
                    setFriedOrFriendSearchedId(snapshot.val().uid);
                })
            } else {
                Alert.alert("Username not found");
            }
        })
        .catch((error) => {
            console.log(error);
            Alert.alert("An error occurs");
        })
    };

    const addFriend = (id) => {
        try {
            const userRef = ref(database, 'userId/');
            const me = child(userRef, currentUser?.uid);
            const other = child(userRef, id);
            const newFriendList = [...friendListId, id];
            //update current user friendlist
            runTransaction(me, (profile) => {
                if (profile) {
                    profile.friendList = newFriendList;
                    return profile;
                } else {
                    return profile;
                }
            }).then(() => setFriendListId(newFriendList));
            //update other user friendlist
            runTransaction(other, (profile) => {
                if (profile) {
                    const friendList = profile.friendList;
                    if (friendList) {
                        //if the user has friends before
                        friendList.push(currentUser?.uid);
                        return profile;
                    } else {
                        //if the user did not have friends before
                        profile.friendList = [currentUser?.uid];
                        return profile;
                    }
                } else {
                    return profile;
                }
            }).then(() => {
                get(other)
                .then((snapshot) => {
                    //friendListData.push(snapshot.val());
                    setFriendListData([...friendListData, snapshot.val()])
                })
            });
            //to display list of friends
            setFriendOrFriendSearched(null);
            setFriedOrFriendSearchedId('');
            setIsAddingFriend(false);
            setUsernameAdded('');
            Alert.alert("Added successfully!");
        } catch (error) {
            console.log(error);
            Alert.alert("Error occurs during adding friends");
        } 
    };
    const cancel = () => {
        setIsAddingFriend(false);
        setFriedOrFriendSearchedId('');
        setFriendOrFriendSearched(null);
        setUsernameAdded('');
    };

    const back = () => {
        setIsCheckingFriend(false);
        setFriedOrFriendSearchedId('');
        setFriendOrFriendSearched(null);
    }

    const handleChat = (item) => {
        const userIds = [currentUser.uid, item.uid].sort(); // Sort user IDs alphabetically
        const chatSessionId = userIds.join('-'); // Combine user IDs
      
        navigation.navigate('ChatUser', { chatSessionId, otherUser: item });
      };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.button} 
                    >
                    <Text style={styles.back}>{'\u2190'}</Text >  
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Study Buddy</Text>
                </View>
                <View style={styles.searchContainer}>
                
                    <Ionicons 
                    style={styles.searchIcon}
                    name='search' 
                    color='white' 
                    size={30}/>
                    <TextInput 
                    style={styles.search}
                    placeholder='Search'
                    autoCapitalize='none'
                    clearButtonMode='while-editing'
                    value={username}
                    onChangeText={(text) => setUsername(text)}>
                    </TextInput>
                    <TouchableOpacity 
                    style={styles.addIcon} 
                    testID='addFriend'
                    onPress={() => setIsAddingFriend(true)}>
                        <Ionicons 
                        name='person-add-outline' 
                        size={30} 
                        color='white'
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                data={friendListData}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.username}
                contentContainerStyle={styles.flatListContent}
                style={{ flex: 1 }}
                />
            </View>

            {/* Prompt for adding friend */}
            <Modal visible={isAddingFriend || isCheckingFriend} transparent animationType='fade'>
                 { friendOrFriendSearched ? (
                    <View style={styles.userSearchedContainer}>
                        <View style={styles.userSearched}>
                            <View style={styles.backAndAdd}>
                                <TouchableOpacity
                                style={{marginRight: 190}}
                                onPress={back}>
                                    <Text style={styles.back2}>{'\u2190'}</Text >  
                                </TouchableOpacity>
                                { friendOrFriendSearchedId === currentUser?.uid ? (
                                    <View style={{height: 40,width:40}}/>
                                ) : !friendListId.includes(friendOrFriendSearchedId) ? (
                                    <TouchableOpacity onPress={() => addFriend(friendOrFriendSearchedId)} testID='add'>
                                        <Ionicons name='add' size={40} style={{color:'white'}}/>
                                    </TouchableOpacity>
                                ) : (
                                    <Ionicons name="checkmark" size={35} color={'green'}/>
                                )}
                            </View>
                            <View style={styles.photoContainer}>
                                {friendOrFriendSearched.photo ? (
                                    <Image
                                    source={{uri: friendOrFriendSearched.photo}} 
                                    style={styles.photo}/>
                                ) : (
                                    <Image
                                    source={require('../../../../../assets/profileholder.png')}
                                    style={styles.photo}/>
                                )}
                                
                            </View>
                            <View style={{backgroundColor: 'white', height: 1, width: 250, bottom: 10}}/>
                            <View style={styles.textContainer}>
                                <View style={styles.nameAndGender}> 
                                <Text style={styles.text} numberOfLines={1}>{friendOrFriendSearched.username}</Text>
                                    {friendOrFriendSearched.gender === 'male' ? (
                                        <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft: 10}}/>
                                    ) : (
                                        <Fontisto name='female' size={15} color='pink' style={{marginLeft: 10}}/>
                                    )}
                                </View>
                                <View style={styles.levelContainer}>
                                    <Text style={styles.levelText}>Level {friendOrFriendSearched.level}</Text>
                                    <View style={styles.trophyContainer}>
                                    <Text style={styles.trophyText}>{friendOrFriendSearched.trophyText}</Text>
                                        <Ionicons name="trophy" color={friendOrFriendSearched.trophyColour} style={styles.trophyIcon} size={15}/>
                                    </View>
                                </View>
                                <View style={styles.interests}>
                                    <Text style={styles.text2}>Interests: {friendOrFriendSearched.interests ? friendOrFriendSearched.interests.join(', ') : "-"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    ) : (
                    <View style={styles.promptContainer}>
                      <View style={styles.prompt}>
                        <Text style={styles.promptText}>Add Friends</Text>
                        <View style={styles.addFriendSearchContainer}>
                            <TextInput
                            style={styles.addFriend}
                            placeholder='Enter username'
                            placeholderTextColor={'gray'}
                            value={usernameAdded}
                            onChangeText={(text) => setUsernameAdded(text.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim())}
                            autoCapitalize='none'
                            clearButtonMode='while-editing'
                            autoCorrect={false}
                            autoFocus
                            testID='Enter username'
                            />
                            <TouchableOpacity 
                            style={styles.searchIcon}
                            onPress={() => handleSearchFriend(usernameAdded)}
                            testID='searchFriend'>
                                <Ionicons 
                                name='search' 
                                color='white' 
                                size={30}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={cancel}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
            </Modal>

            {/* Prompt for deleting friend */}
            <Modal visible={deletingFriend !== null} transparent animationType='fade'>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.labelContainer}>
                            <AntDesign name="exclamationcircle" style={styles.warningIcon} />
                            {deletingFriend !== null &&
                            <Text style={styles.label}>Confirm to unfriend {deletingFriend.username}?</Text>
                            }   
                        </View>
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setDeletingFriend(null)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={() => deleteFriend(deletingFriend)}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        width: "100%",
        height: 140,
        backgroundColor: '#8A2BE2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        bottom: 8,
        right: 18
    },
    flatListContainer: {
        height: "100%",
        flex: 1,
        width: "100%",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 45,
        marginRight: 10,
    },
    flatListContent: {
        paddingBottom: 40,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    friendStatus: {
        fontSize: 18,
        color: '#888888',
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        left: 20,
        top: 5
    },
    separator: {
        height: 1,
        backgroundColor: 'thistle',
    },
    back: {
        fontSize: 35,
        color: "white",
        fontWeight: "bold",
    },
    button: {
       bottom: 20,
       right: 80
    },
    search: {
        backgroundColor: 'white',
        width: "50%",
        height: 30,
        borderRadius: 10,
        textAlign: 'left',
        paddingLeft: 10,
    },
    headerTop: {
        flexDirection: 'row',
        top: 30
    },
    searchContainer: {
        flexDirection: 'row',
        right: 35,
        top: 20,
        alignItems: 'center',
        marginLeft: 30,
    },
    searchIcon: {
        right: 5
    },
    addIcon: {
        left: 80,
        marginLeft: -20,
    },
    promptContainer: {
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor:'rgba(0, 0, 0, 0.5)', //to make the background blur.
    },
    prompt: {
        bottom: 30,
        width: 300, 
        backgroundColor: 'thistle',
        padding: 30, 
        borderRadius: 10,
        alignItems: 'center',
    },
    addFriend: {
        width: "90%",
        backgroundColor: 'white',
        borderRadius: 10,
        height: 40,
        paddingLeft: 10,
        textAlign: 'left',
        right: 20,
        fontSize: 18,
    }, 
    promptText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        bottom: 20
    },
    addFriendSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 15,
        bottom: 5
    },
    cancel: {
        fontSize: 20,
        color: 'white',
        top: 10,
        fontWeight: 'bold'
    },
    userSearchedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor:'rgba(0, 0, 0, 0.5)'
    },
    userSearched: {
        width: 300,
        backgroundColor: 'thistle',
        //height: 250,
        borderRadius: 10,
        alignItems: 'center',
        padding:30
    },
    backAndAdd: {
        flexDirection: "row",
        alignItems: 'center',
        bottom: 20
    },
    back2: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold",
    },
    add: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        left: 5
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
    nameAndGender: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "80%"
    },
    text: {
        fontSize: 24,
        color: 'white',
        fontWeight: "bold",
    },
    text2: {
        fontSize: 17,
        color: 'white'
    },
    interests: {
        top: 5,
    },
    statusIndicator: {
        height: 10,
        width: 10,
        backgroundColor: 'rgb(0, 200, 0)',
        borderRadius: 5,
        position: 'absolute',
        left: 45,
        top: 46
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        maxHeight: '50%',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    warningIcon: {
        marginRight: 10,
        fontSize: 24,
        color: '#FF0000',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },  
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    cancelButton: {
        backgroundColor: '#999',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginRight: 6, 
    },
    confirmButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginLeft: 6, 
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 10,
      },
      levelText: {
        marginRight: 10,
        fontSize: 18,
        color: 'white'
      },
      trophyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      trophyText: {
        marginRight: 5,
        fontSize: 18,
        color: 'white'
      },
      trophyIcon: {
        marginLeft: 5,
      },
})


export default FriendListSetting;
