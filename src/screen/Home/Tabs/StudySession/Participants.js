import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { auth, database } from '../../../../../firebase';
import { get, onValue, ref, runTransaction, child } from 'firebase/database';

const Participants = ({session, navigation}) => {
    const currentUser = auth.currentUser;
    const [participantClicked, setParticipantClicked] = useState(null);
    const [participantsData, setParticipantsData] = useState([]);
    const [participantsId, setParticipantsId] = useState([]);
    const [friendListId, setFriendListId] = useState([]);
    const [username, setUsername] = useState('');

    const sessionId = session.id;

    console.log(participantsData)
    
    useEffect(() => {
    //listen to the change of participant list
    //to get the latest participant list
    const unsubscribe = onValue(ref(database, 'sessions/' + sessionId), async (snapshot) => {
        let participantsData2 = [];
        if (snapshot.val()) {
            const participantsId2 = snapshot.val().onlineParticipants ? snapshot.val().onlineParticipants: [];
            if (participantsId2) {
            //to make sure participants is added before set
            await Promise.all(participantsId2.map(async (id) => {
                const userRef = ref(database, 'userId/' + id);  
                await get(userRef)
                .then((user) => {
                    participantsData2.push(user.val());
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert("Error");
                });
                return;
            }));
            console.log(participantsData2)
            setParticipantsData(participantsData2);
            setParticipantsId(participantsId2);
            /*participantsId2.map((id) => {
                //attach listener to each of the friend to get their status update
                const unsubscribe = onValue(ref(database, 'userId/' + id), (snapshot) => {
                    const user = snapshot.val();
                    const id = user.uid;
                    //update the specific user with status update
                    const newParticipantsData = participantsData2.map((item) => item.uid === id ? user : item)
                    setParticipantsData(newParticipantsData);
                    return () => {
                        unsubscribe();
                    }
                })
            })*/
            return;
        }
        setParticipantsId([]);
        setParticipantsData(participantsData2);
    }
    });
    return () => {
        unsubscribe();
    }
}, []);

    useEffect(() => {
        const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), (snapshot) => {
            const friendList = snapshot.val().friendList? snapshot.val().friendList: [];
            if (friendList) {
                setFriendListId(friendList);
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);  

    const clickUser = (user) => {
        setParticipantClicked(user)
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
                            source={require("../../../../../assets/profileholder.png")}
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
                    </TouchableOpacity>
                    {/* separator */}
                    <View style={styles.separator} />
                </View>
            );
        } 
    };

    const quitSession = () => {
        try {
            const db = ref(database);
            Promise.all([
                //to remove the user from session online participants
                runTransaction(child(db, 'sessions/' + sessionId), (session) => {
                    if (session) {
                        session.onlineParticipants = session.onlineParticipants.filter((id) => id !== currentUser.uid);
                        return session;
                    } else {
                        return;
                    }
                }),
                //to remove the session from user ongoing sessions
                runTransaction(child(db, 'userId/' + currentUser.uid), (user) => {
                    if (user) {
                        user.ongoingSessions = user.ongoingSessions.filter((id) => id !== sessionId);
                        return user;
                    } else {
                        return user;
                    }
                })
            ])
            .then(() => {
                navigation.goBack();
            });
        } catch (error) {
            console.log(error);
            Alert.alert("An error occurs when quiting session")
        }
    };

    const addFriend = (id) => {
        try {
            const userRef = ref(database, 'userId/');
            const me = child(userRef, currentUser.uid);
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
            });
            //update other user friendlist
            runTransaction(other, (profile) => {
                if (profile) {
                    const friendList = profile.friendList;
                    if (friendList) {
                        //if the user has friends before
                        friendList.push(currentUser.uid);
                        return profile;
                    } else {
                        //if the user did not have friends before
                        profile.friendList = [currentUser.uid];
                        return profile;
                    }
                } else {
                    return profile;
                }
            }).then(() => {
                get(other)
                .then((snapshot) => {
                    setParticipantsData([...participantsData, snapshot.val()])
                })
            });
            Alert.alert("Added successfully!");
        } catch (error) {
            console.log(error);
            Alert.alert("An error occurs during adding friends");
        } 
    };

    const back = () => {
        setParticipantClicked(null);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                    onPress={quitSession}
                    style={styles.button} 
                    >
                    <Text style={styles.back}>{'\u2190'}</Text >  
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Participants</Text>
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
                </View>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                data={participantsData}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.username}
                contentContainerStyle={styles.flatListContent}
                style={{ flex: 1 }}
                />
            </View>

            {/* Prompt for adding friend */}
            <Modal visible={participantClicked !== null} transparent animationType='fade'>
                {participantClicked !== null && (
                    <View style={styles.userSearchedContainer}>
                    <View style={styles.userSearched}>
                        <View style={styles.backAndAdd}>
                            <TouchableOpacity
                            style={{marginRight: 190}}
                            onPress={back}>
                                <Text style={styles.back2}>{'\u2190'}</Text >  
                            </TouchableOpacity>
                            { participantClicked.uid === currentUser.uid ? (
                                <View style={{height: 40,width:40}}/>
                            ) : !friendListId.includes(participantClicked.uid) ? (
                                <TouchableOpacity onPress={() => addFriend(participantClicked.uid)}>
                                    <Ionicons name='add' size={40} style={{color:'white'}}/>
                                </TouchableOpacity>
                            ) : (
                                <Ionicons name="checkbox" size={40} color={'green'}/>
                            )}
                        </View>
                        <View style={styles.photoContainer}>
                            {participantClicked.photo ? (
                                <Image
                                source={{uri: participantClicked.photo}} 
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
                            <Text style={styles.text} numberOfLines={1}>{participantClicked.username}</Text>
                                {participantClicked.gender === 'male' ? (
                                    <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft: 10}}/>
                                ) : (
                                    <Fontisto name='female' size={15} color='pink' style={{marginLeft: 10}}/>
                                )}
                            </View>
                            <View style={styles.interests}>
                                <Text style={styles.text2}>Interests: {participantClicked.interests ? participantClicked.interests.join(', ') : "-"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                )}
            </Modal>
        </View>
    )
};

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
        borderRadius: 20
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
        width: 90,
        height: 90,
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
        fontSize: 24,
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
        backgroundColor: '#BAA8BA',
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
        top: 15
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
        fontSize: 20,
        color: 'white'
    },
    interests: {
        top: 5,
    },
    statusIndicator: {
        height: 12,
        width: 12,
        backgroundColor: 'rgb(0, 200, 0)',
        borderRadius: 6,
        position: 'absolute',
        left: 75, 
        top: 65
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
});


export default Participants;
