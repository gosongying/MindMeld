import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import React, { useState, useEffect } from "react";
import { auth, database } from '../../../../firebase';
import { onValue, ref, get } from "firebase/database";

const StudySessionTab = () => {

    const [isCheckingInvitation, setIsCheckingInvitation] = useState(false);
    const [invitationIds, setInvitationIds] = useState([]);
    const [invitationData, setInvitationData] = useState([]);
    const [inDetail, setInDetail] = useState([]);

    const currentUser = auth.currentUser;
    console.log(invitationData)

    useEffect(() => {
        //listen to the change of invitation list
        //to get the latest invitation list
        const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), async (snapshot) => {
            let invitation = [];
            const invitationList = snapshot.val().invitationList ? snapshot.val().invitationList : [];
            if (invitationList) {
                setInvitationIds(invitationList);
                await Promise.all(invitationList.map(async (id) => {
                    const sessionRef = ref(database, 'sessions/' + id);   
                    await get(sessionRef)
                    .then((session) => {
                        invitation.push(session.val());
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert("Error");
                    });
                    return;
                }));
                setInvitationData(invitation);
            } else {
                setInvitationIds([]);
                setInvitationData([]);
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);

    const renderInvitation = ({index, item}) => {
        if (inDetail.includes(index)) {
            return (
                <TouchableOpacity 
                onPress={() => setInDetail(inDetail.filter((i) => i !== index))}
                style={styles.flatListItemID}>
                    <View style={styles.sessionInfoID}>
                        <Text style={styles.sessionNameID}>{item.sessionName}</Text>
                    </View>
                    <View style={styles.acceptOrDeclineID}>
                        <TouchableOpacity>
                            <Ionicons name="checkmark" color={'green'} size={30}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Entypo name="cross" color={'red'} size={30}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity 
                style={styles.flatListItem}
                onPress={() => setInDetail([...inDetail, index])}>
                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionName}>{item.sessionName}</Text>
                        <Text style={styles.sessionDescription}>{item.sessionDescription}</Text>
                    </View>
                    
                    <View style={styles.acceptOrDecline}>
                        <TouchableOpacity>
                            <Ionicons name="checkmark" color={'green'} size={30}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Entypo name="cross" color={'red'} size={30}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View>
            <SessionHeader setIsCheckingInvitation={setIsCheckingInvitation}/>

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
                        style={{flex: 1,}}
                        />
                    </View>
                </View>
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
        width: '80%',
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
        marginTop: 5
    },
    acceptOrDecline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionInfo: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '70%'
    },
    sessionName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'purple',
    },
    flatListItemID: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000000',
        shadowOpacity: 0.4,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        backgroundColor: 'black',
    },
    sessionDescription: {
        fontSize: 18,
    },
});

export default StudySessionTab;