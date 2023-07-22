import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, database } from '../../../../../firebase';
import { ref, runTransaction, set, get, onValue, update, child } from 'firebase/database';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const SelectBuddies2 = ({navigation, route}) => {
    const currentUser = auth.currentUser;

    const [username, setUsername] = useState('');
    //when clicking friends' profile
    const [isCheckingFriend, setIsCheckingFriend] = useState(false);
    const [friendListData, setFriendListData] = useState([]);
    const [friendListId, setFriendListId] = useState([]);
    const [friendClicked, setFriendClicked] = useState(null);
    const [buddiesInvited, setBuddiesInvited] = useState([]);
    const [isSelectingInterests, setIsSelectingInterests] = useState(false);
    const [isSelectingGender, setIsSelectingGender] = useState(false);
    const [interests, setInterests] = useState([]);
    const [gender, setGender] = useState('');

    const data = [
        { key: '1', value: 'Sciences' },
        { key: '2', value: 'Business and Management' },
        { key: '3', value: 'Humanities' },
        { key: '4', value: 'Engineering' },
        { key: '5', value: 'Social Sciences' },
        { key: '6', value: 'Health and Medical' },
        { key: '7', value: 'Arts and Fine Arts' },
        { key: '8', value: 'Technology' },
        { key: '9', value: 'Environmental and Sustainability Studies' },
        { key: '10', value: 'Education' },
        { key: '11', value: 'Law and Legal Studies' },
        { key: '12', value: 'Language' },
        { key: '13', value: 'Math and Statistics' },
      ];

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

                //const id = user.uid;
                const id = user?.uid; // include null check

                //update the specific user with status update
                const newFriendList = friends.map((item) => item.uid === id ? user : item)
                setFriendListData(newFriendList);
                return () => {
                  unsubscribe();
                }
              });
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
        setFriendClicked({...user, trophyColour: trophyColour, trophyText: trophyText, level: level});
    };

    const toggleInvite = (user) => {
        if (buddiesInvited.includes(user.uid)) {
            setBuddiesInvited(buddiesInvited.filter((id) => id !== user.uid));
        } else {
            setBuddiesInvited([...buddiesInvited, user.uid]);
        }
    };

    const renderInterestItem = ({ item }) => (
        <TouchableOpacity
          style={[styles.toggleButton, interests.includes(item.value) && styles.toggleButtonSelected]}
          onPress={() => handleToggleInterest(item.value)}
        >
          <Text style={styles.toggleButtonText}>{item.value}</Text>
        </TouchableOpacity>
    );

    const checkInterests = (userInterests) => {
        if (!userInterests) {
            if (interests.length !== 0) {
                return false;
            } else {
                return true;
            }
        } else {
            if (interests.length === 0) {
                return true;
            } else {
                return userInterests.some((interest) => interests.includes(interest));
            }
        }
    };

    const checkGender = (userGender) => {
        if (gender) {
            return gender === userGender;
        } else {
            return true;
        }
    }

    const handleToggleInterest = (selectedInterest) => {
        if (interests.includes(selectedInterest)) {
          setInterests(interests.filter((interest) => interest !== selectedInterest));
        } else {
          setInterests([...interests, selectedInterest]);
        }
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

    const renderFriendItem = ({ item }) => {
        if ((item.username.startsWith(username) || !username) && checkInterests(item.interests) && checkGender(item.gender)) {
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
                        {item.status && <View style={styles.statusIndicator}/>}
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
                        <TouchableOpacity 
                        style={[styles.invite, buddiesInvited.includes(item.uid) && styles.invited]}
                        onPress={() => toggleInvite(item)}>
                            {buddiesInvited.includes(item.uid) ? (
                                <Text style={styles.inviteText}>{'\u2713'}</Text>
                            ) : (
                                <Text style={styles.inviteText}>Invite</Text>
                            )}
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {/* separator */}
                    <View style={styles.separator} />
                </View>
            );
        } 
    };

    const back = () => {
        setIsCheckingFriend(false);
        setFriendClicked(null);
    };

    const next = () => {
        navigation.navigate("SelectToDo", {
            ...route.params,
            buddiesInvited
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton} 
                    >
                      <Text style={styles.back}>{'\u2190'}</Text >  
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={next}
                    style={styles.nextButton} 
                    >
                      <Text style={styles.next}>Next</Text >  
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Select Buddies</Text>
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
            <View>
                <View style={styles.filter}>
                    <TouchableOpacity style={[styles.interestsBox, isSelectingInterests && {backgroundColor: 'gray'}]} onPress={() => setIsSelectingInterests(!isSelectingInterests)}>
                        {isSelectingInterests ? (
                            <Text style={styles.filterText}>Interests {'\u2193'}</Text>
                        ) : (
                            <Text style={styles.filterText}>Interests</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.gender, isSelectingGender && {backgroundColor: 'gray'}]} onPress={() => setIsSelectingGender(!isSelectingGender)}>
                        {isSelectingGender ? (
                            <Text style={styles.filterText}>Gender {'\u2193'}</Text>
                        ) : (
                            <Text style={styles.filterText}>Gender</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.separator2}/>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                data={friendListData}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.username}
                style={{ flex: 1}}
                />
            </View>

            {/* Prompt for adding friend */}
            <Modal visible={isCheckingFriend} transparent animationType='fade'>
                {friendClicked &&
                <View style={styles.userSearchedContainer}>
                    <View style={styles.userSearched}>
                        <View style={styles.backAndAdd}>
                            <TouchableOpacity
                            style={{marginRight: 190}}
                            onPress={back}>
                                <Text style={styles.back2}>{'\u2190'}</Text >  
                            </TouchableOpacity>
                            <Ionicons name="checkmark" size={35} color={'green'}/>
                        </View>
                        <View style={styles.photoContainer}>
                            {friendClicked.photo ? (
                                <Image
                                source={{uri: friendClicked.photo}} 
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
                            <Text style={styles.text} numberOfLines={1}>{friendClicked.username}</Text>
                                {friendClicked.gender === 'male' ? (
                                    <Fontisto name='male' size={15} color='dodgerblue' style={{marginLeft: 10}}/>
                                ) : (
                                    <Fontisto name='female' size={15} color='pink' style={{marginLeft: 10}}/>
                                )}
                            </View>
                            <View style={styles.levelContainer}>
                                <Text style={styles.levelText}>Level {friendClicked.level}</Text>
                                <View style={styles.trophyContainer}>
                                <Text style={styles.trophyText}>{friendClicked.trophyText}</Text>
                                <Ionicons name="trophy" color={friendClicked.trophyColour} style={styles.trophyIcon} size={15}/>
                                </View>
                            </View>
                            <View style={styles.interests}>
                                <Text style={styles.text2}>Interests: {friendClicked.interests ? friendClicked.interests.join(', ') : "-"}</Text>
                            </View>
                        </View>
                    </View>
                </View>}
            </Modal>

            {isSelectingInterests &&
            <View style={styles.interestsModal}>
                <FlatList
                data={data}
                renderItem={renderInterestItem}
                keyExtractor={(item) => item.key}
                extraData={interests}
                style={styles.list}
                />
            </View>
            }

            {isSelectingGender &&
            <View style={styles.genderModal}>
                <View style={{right: 15}}>
                    <TouchableOpacity
                    style={[styles.toggleButton, gender === 'male' && styles.toggleMaleSelected]}
                    onPress={handleToggleMale}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.toggleButtonText}>Male</Text>
                            <Fontisto name='male' size={15} style={{marginLeft:5}}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.toggleButton, gender === 'female' && styles.toggleFemaleSelected]}
                    onPress={handleToggleFemale}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.toggleButtonText}>Female</Text>
                            <Fontisto name='female' size={15} style={{marginLeft:5}}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            }
            <View style={styles.dots}>
                <View style={styles.dot1}/>
                <View style={styles.dot2}/>
            </View>
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
        height: 150,
        backgroundColor: '#DC582A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        right: 30,
    },
    flatListContainer: {
        height: "100%",
        flex: 1,
        width: "100%",
        top: 20,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 45,
        marginRight: 10,
    },
    friendInfo: {
        flex: 1,
        marginLeft: 5
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
        backgroundColor: '#DC582A',
    },
    back: {
        fontSize: 35,
        color: "white",
        fontWeight: "bold",
    },
    backButton: {
       bottom: 28,
       right: 55
    },
    nextButton: {
        bottom: 28,
        left: 220
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
        top: 35
    },
    searchContainer: {
        right: 10,
        flexDirection: 'row',
        top: 30,
        alignItems: 'center'
    },
    searchIcon: {
        right: 5
    },
    addIcon: {
        left: 80,
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
        backgroundColor: 'white',
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
        backgroundColor: 'salmon',
        //height: 250,
        borderRadius: 10,
        alignItems: 'center',
        padding:30,
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
        left: 42, 
        top: 42
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
    invite: {
        width: 70,
        height: 25,
        borderRadius: 10,
        backgroundColor: 'navy',
        right: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inviteText: {
        fontSize: 15,
        color: 'white',
        fontWeight:'bold'
    },
    invited: {
        backgroundColor: '#DC582A'
    },
    filter: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        top: 10,
    },
    interestsBox: {
        backgroundColor: 'lightgray',
        width: 120,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    gender: {
        backgroundColor: 'lightgray',
        width: 120,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButton: {
        backgroundColor: 'lightgray',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
      //  marginBottom: 10,
        marginRight: 10,
        width: 150,
        alignItems: "center",
        borderWidth: 1
    },
    toggleButtonSelected: {
        backgroundColor: '#DC582A'
    },
    toggleButtonText: {
        fontSize: 16,
    },
    interestsModal: {
        top: 200,
        left: 50,
        position: 'absolute'
    },
    list: {
        right: 20,
        height: 300
    },
    genderModal: {
        top: 200,
        left: 210,
        position: 'absolute'
    },
    toggleMaleSelected: {
        backgroundColor: 'dodgerblue'
    },
    toggleFemaleSelected: {
        backgroundColor: "pink"
    },
    separator2: {
        height: 1,
        backgroundColor: '#DC582A',
        top: 20
    },
    next: {
        fontSize: 20,
        color: 'white',
        top: 10,
        fontWeight: 'bold'
    },
    dots: {
        position: "absolute",
        flexDirection: "row",
        alignItems: 'center',
        top: 55,
    },
    dot1: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'orange',
        right: 5
    },
    dot2: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        left: 5
    },
    filterText: {
        fontWeight: 'bold',
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
});


export default SelectBuddies2;