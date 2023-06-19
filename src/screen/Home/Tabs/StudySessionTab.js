import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, FlatList, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import React, { useState, useEffect } from "react";
import { auth, database } from '../../../../firebase';
import { onValue, ref, get, runTransaction, child, update } from "firebase/database";

const StudySessionTab = () => {

    const [isCheckingInvitation, setIsCheckingInvitation] = useState(false);
    const [invitationIds, setInvitationIds] = useState([]);
    const [invitationData, setInvitationData] = useState([]);
    const [inDetail, setInDetail] = useState([]);
    const [join, setJoin] = useState(false);
    const [decline, setDecline] = useState(false);
    const [sessionIds, setSessionIds] = useState([]);
    const [sessionData, setSessionData] = useState([]);
    const [currentTimestamp, setCurrentTimestamp] = useState(new Date().getTime());

    const currentUser = auth.currentUser;

    /*const checkExpired = () => {
        const currentTimestamp = new Date().getTime();
        let expired = [];
        if (invitationIds) {
            const newInvitationData = invitationData.filter((session) => {
                if (session.endTime.timestamp - currentTimestamp < 60000) {
                    expired.push(session.id);
                    return false;
                } else {
                    return true;
                }
            });
            const newInvitationIds = invitationIds.filter((id) => !expired.includes(id));
            update(ref(database, 'userId/' + currentUser.uid), {
                invitationList: newInvitationIds
            });
        } 
    };*/

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTimestamp(new Date().getTime());
        }, 60000);
        const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), async (snapshot) => {
            let sessions = [];
            let ended = [];
            const sessionList = snapshot.val().upcomingSessions? snapshot.val().upcomingSessions: [];
            if (sessionList) {
                await Promise.all(sessionList.map(async (id) => {
                    console.log(currentUser.displayName)
                    const sessionRef = ref(database, 'sessions/' + id);
                    await get(sessionRef)
                    .then((session) => {
                        if (session !== null) {
                            console.log(session)
                            console.log(session.val())
                            if (session.val().endTime.timestamp <= currentTimestamp) {
                                ended.push(session.val().id);
                            } else {
                                sessions.push(session.val());
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert("An error occurs2");
                    });
                    return;
                }));
                const newSessionsList = sessionList.filter((id) => !ended.includes(id));
                update(ref(database, 'userId/' + currentUser.uid), {
                    upcomingSessions: newSessionsList
                })
                .then(() => {
                    setSessionIds(newSessionsList);
                    setSessionData(sessions);
                });
            } else {
                setSessionIds([]);
                setSessionData([]);
            }
        });
        return () => {
            clearInterval(interval);
            unsubscribe();
        }
    }, [currentTimestamp]);

    useEffect(() => {
        //to check if any invitation expired
        //listen to the change of invitation list
        //to get the latest invitation list
        const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), async (snapshot) => {
            let invitation = [];
            let expired = [];
            const invitationList = snapshot.val().invitationList ? snapshot.val().invitationList : [];
            if (invitationList) {
                await Promise.all(invitationList.map(async (id) => {
                    const sessionRef = ref(database, 'sessions/' + id);   
                    await get(sessionRef)
                    .then((session) => {
                        if (session.val().endTime.timestamp - currentTimestamp < 300000) {
                            expired.push(session.val().id);
                        } else {
                            invitation.push(session.val());
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert("Error");
                    });
                    return;
                }));
                const newInvitationList = invitationList.filter((id) => !expired.includes(id));
                update(ref(database, 'userId/' + currentUser.uid), {
                    invitationList: newInvitationList
                })
                .then(() => {
                    setInvitationIds(newInvitationList);
                    setInvitationData(invitation);
                });
            } else {
                setInvitationIds([]);
                setInvitationData([]);
            }
        });
        return () => {
            unsubscribe();
        }
    }, [currentTimestamp]);

    const showJoin = () => {
        setJoin(true);
        setTimeout(() => {
            setJoin(false);
        }, 2000);
    };

    const showDecline = () => {
        setDecline(true);
        setTimeout(() => {
            setDecline(false);
        }, 2000);
    };

    const acceptInvitation = (sessionId) => {
        const db = ref(database);
        //add the user into participants list of the session
        try {
            runTransaction(child(db, 'sessions/' + sessionId), (session) => {
                if (session) {
                    session.participants.push({
                        uid: currentUser.uid, 
                        username: currentUser.displayName
                    });
                    return session;
                } else {
                    return session;
                }
            });

            //remove the invitation from the user
            runTransaction(child(db, 'userId/' + currentUser.uid), (user) => {
                if (user) {
                    user.invitationList = user.invitationList.filter((id) => id !== sessionId);
                    if (user.upcomingSessions) {
                        user.upcomingSessions.push(sessionId);
                    } else {
                        user.upcomingSessions = [sessionId];
                    }
                    return user;
                } else {
                    return user;
                }
            }).then(() => {
                showJoin();
                setInDetail(inDetail.filter((id) => id !== sessionId));
            });
        } catch (error) {
            console.log(error);
            Alert.alert("An error occurs during accepting invitation");
        }
    };

    const declineInvitation = (sessionId) => {
        //add the user into participants list of the session
        try {
            //remove the invitation from the user
            runTransaction(ref(database, 'userId/' + currentUser.uid), (user) => {
                if (user) {
                    user.invitationList = user.invitationList.filter((id) => id !== sessionId);
                    return user;
                } else {
                    return user;
                }
            }).then(() => {
                showDecline();
                setInDetail(inDetail.filter((id) => id !== sessionId));
            });
        } catch (error) {
            console.log(error);
            Alert.alert("An error occurs during deleting invitation");
        }
    };

    const renderSession = ({item}) => {
        return (
            <View style={styles.session}>
                <View style={styles.sessionInfo2}>
                    <Text style={styles.sessionName2}>{item.sessionName}</Text>
                    <Text style={styles.sessionDescription2}>{item.sessionDescription}</Text>
                    <View style={styles.separator}/>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Fontisto name='date' size={16}/>
                        <Text style={[{marginLeft: 10}, styles.text]}>{item.selectedDate}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center', right: 1}}>
                        <Ionicons name='time-outline' size={20}/>
                        <Text style={[{marginLeft: 5}, styles.text]}>{item.startTime.string} - {item.endTime.string}</Text>
                    </View>
                    <Text style={styles.text2}>Host: {item.host.username}</Text>
                    <Text style={styles.text2}>Participants: {item.participants.map((user) => user.username).join(', ')}</Text>
                    <Text style={styles.text2}>To-do's: {item.tasks ? item.tasks.map((task) => task.title).join(', ') : ''}</Text>
                    <Text style={[styles.text2, !item.studyModeEnabled && {textDecorationLine: 'line-through'}]}>Study Mode</Text>
                </View>
                <View style={styles.acceptOrDecline2}>
                    <TouchableOpacity  style={{right: 4, bottom: 5}}>
                        <Ionicons name="enter-outline" color={'black'} size={35}/>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{top: 5}}>
                        <MaterialCommunityIcons name="delete-outline" color={'red'} size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderInvitation = ({item}) => {
        if (inDetail.includes(item.id)) {
            return (
                <TouchableOpacity 
                onPress={() => setInDetail(inDetail.filter((i) => i !== item.id))}
                style={styles.flatListItem}>
                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionName}>{item.sessionName}</Text>
                        <Text style={styles.sessionDescription}>{item.sessionDescription}</Text>
                        <View style={styles.separator}/>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <Fontisto name='date' size={16}/>
                            <Text style={[{marginLeft: 10}, styles.text]}>{item.selectedDate}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems:'center', right: 1}}>
                            <Ionicons name='time-outline' size={20}/>
                            <Text style={[{marginLeft: 5}, styles.text]}>{item.startTime.string} - {item.endTime.string}</Text>
                        </View>
                        <Text style={styles.text}>Host: {item.host.username}</Text>
                        <Text style={styles.text}>Participants: {item.participants.map((user) => user.username).join(', ')}</Text>
                        <Text style={styles.text}>To-do's: {item.tasks ? item.tasks.map((task) => task.title).join(', ') : ''}</Text>
                        <Text style={[styles.text, !item.studyModeEnabled && {textDecorationLine: 'line-through'}]}>Study Mode</Text>
                    </View>
                    <View style={styles.acceptOrDecline}>
                        <TouchableOpacity onPress={() => acceptInvitation(item.id)}>
                            <Ionicons name="checkmark" color={'green'} size={35}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => declineInvitation(item.id)}>
                            <Entypo name="cross" color={'red'} size={35}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity 
                style={styles.flatListItem}
                onPress={() => setInDetail([...inDetail, item.id])}>
                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionName}>{item.sessionName}</Text>
                        <Text style={styles.sessionDescription}>{item.sessionDescription}</Text>
                    </View>
                    
                    <View style={styles.acceptOrDecline}>
                        <TouchableOpacity onPress={() => acceptInvitation(item.id)}>
                            <Ionicons name="checkmark" color={'green'} size={35}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => declineInvitation(item.id)}>
                            <Entypo name="cross" color={'red'} size={35}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View>
            <SessionHeader setIsCheckingInvitation={setIsCheckingInvitation}/>
            <FlatList 
            data={sessionData}
            renderItem={renderSession}
            contentContainerStyle={{alignItems: 'center'}}
            keyExtractor={(session) => session.id}
            />


            {/* Inivitation message */}
            <Modal visible={isCheckingInvitation} transparent animationType="fade">
                <View style={styles.invitationBackground}>
                    <View style={styles.invitationContainer}>
                        <View style={styles.invitationHeader}>
                            <TouchableOpacity
                            onPress={() => setIsCheckingInvitation(false)}>
                                <Text style={styles.back}>{'\u2190'}</Text >  
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Invitation</Text>
                        </View>
                        <FlatList
                        data={invitationData}
                        renderItem={renderInvitation}
                        keyExtractor={(item) => item.id}
                        style={{flex: 1}}
                        contentContainerStyle={{alignItems: 'center'}}
                        />
                    </View>
                </View>


                {/* message when accept the invitation */}
                {join && (
                    <View style={styles.joinContainer}>
                        <Text style={styles.joinText}>Join successfully!</Text>
                    </View>
                )}

                {/* message when decline the invitation */}
                {decline && (
                    <View style={styles.declineContainer}>
                        <Text style={styles.declineText}>Decline</Text>
                    </View>
                )}
            </Modal>
        </View>
    );
};

const SessionHeader = ({setIsCheckingInvitation}) => {
    const [sessionName, setSessionName] = useState('');
    return (
        <View style={styles.headerContainer}>
            <View style={styles.backgroundPattern} />
            <Text style={styles.title}>Study Session</Text>
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
                value={sessionName}
                onChangeText={(text) => setSessionName(text)}>
                </TextInput>
                <TouchableOpacity
                style={styles.news}
                onPress={() => setIsCheckingInvitation(true)}>
                    <MaterialCommunityIcons 
                    name='bell-outline'
                    size={30}
                    color={'white'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        right: 10,
        top: 5,
        alignItems: 'center'
    },
    searchIcon: {
        right: 5
    },
    search: {
        backgroundColor: 'white',
        width: "50%",
        height: 30,
        borderRadius: 10,
        textAlign: 'left',
        paddingLeft: 10,
    }, 
    headerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#8A2BE2',
        marginBottom: 5,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        bottom: 10
    },
    news: {
        left: 45
    },
    invitationBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    invitationContainer: {
        height: '45%',
        width: '85%',
        borderRadius: 20,
        backgroundColor: 'white'
    },
    back: {
        fontSize: 35,
        fontWeight: 'bold',
        right: 65,
        color: 'white'
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        right: 15
    },
    invitationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'mediumpurple',
        height: '20%'
    },
    flatListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 5,
        backgroundColor: 'lavender',
        borderWidth: 0.2,
        marginVertical: 6,
        width: '95%'
    },
    session: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 5,
        backgroundColor: 'lavender',
        borderWidth: 0.2,
        marginVertical: 6,
        width: '95%',
    },
    acceptOrDecline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        right: 5,
    },
    acceptOrDecline2: {
        alignItems: 'center',
        right: 15,
    },
    sessionInfo: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '70%',
    },
    sessionInfo2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '80%',
        right: 5
    },
    sessionName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'purple',
        width: '90%'
    },
    sessionName2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'purple',
        width: '90%'
    },
    sessionDescription: {
        fontSize: 18,
        width: '90%'
    },
    sessionDescription2: {
        fontSize: 20,
        width: '90%'
    },
    text: {
        fontSize: 15,
        marginTop: 2,
        width: '90%'
    },
    text2: {
        fontSize: 18,
        marginTop: 2,
        width: '90%'
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        width: '90%',
        marginVertical: 7
    },
    joinContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(100, 100, 250, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 40,
        top: 160,
        left: 130,
        borderRadius: 20,
    },
    joinText: {
        fontSize: 16,
        color: 'white'
    },
    declineContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        top: 160,
        left: 135,
        borderRadius: 20,
    },
    declineText: {
        fontSize: 16,
        color: 'white'
    }
});

export default StudySessionTab;