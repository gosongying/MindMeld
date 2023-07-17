import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Dimensions, Image, Animated, PanResponder, Alert} from 'react-native';
import { auth, database } from '../../../../firebase'
import { ref, onValue, update, push, get, set } from 'firebase/database'
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SearchBuddy = () => {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commonInterests, setCommonInterests] = useState(0)
  
    const position = new Animated.ValueXY();


    const onRelease = (event, gesture) => {
        const { dx } = gesture;
      
        if (dx > 110) {
          handleYup(users[currentIndex]);
        } else if (dx < -110) {
          handleNope(users[currentIndex]);
        }
        resetPosition();
      };
      
  
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          const { dx, dy } = gesture;
      
          // Ensure swipes is only horizonatal
          if (Math.abs(dx) > Math.abs(dy)) {
            position.setValue({ x: dx, y: 0 });
          }
        },
        onPanResponderRelease: onRelease,
        onPanResponderTerminate: onRelease,
    });

    const resetPosition = () => {
        Animated.timing(position, {
          toValue: { x: 0, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start();
      };
      

    useEffect(() => {
      const uid = auth.currentUser?.uid;
      const currentUserRef = ref(database, `userId/${uid}`);
      const allUsersRef = ref(database, 'userId/');
  
      const unsubscribeCurrentUser = onValue(currentUserRef, (snapshot) => {
        if (snapshot.exists()) {
          const currentUser = snapshot.val();
          const currentUserInterests = currentUser.interests || [];
          const currentUserFriends = currentUser.friendList || [];
    
          const unsubscribeAllUsers = onValue(allUsersRef, (snapshot) => {
            if (snapshot.exists()) {
              const allUsers = Object.values(snapshot.val());
    
              // Matching algorithm
              const matchedUsers = allUsers.filter(user => {
                if (user.uid === uid || currentUserFriends.includes(user.uid)) {
                    return false; // Exclude current user
                  }
                // Compare interests (at least one common interest)
                const userInterests = user.interests || [];
                const commonInterests = currentUserInterests.filter(interest => userInterests.includes(interest));
                setCommonInterests(commonInterests);
                return commonInterests.length > 0; 
              });
    
              setUsers(matchedUsers);
            }
          });
    
          return () => {
            unsubscribeAllUsers();
          };
        }
      });
    
      return () => {
        unsubscribeCurrentUser();
      };
    }, []);

    // To control curvature of the path
    const rotateAndTranslate = {
        transform: [
          {
            rotate: position.x.interpolate({
              inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
              outputRange: ['-25deg', '0deg', '25deg'],
              extrapolate: 'clamp',
            }),
          },
          ...position.getTranslateTransform(),
        ],
      };
      
  
    const renderCards = () => {
        const nextCardOpacity = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
          });
        
          const nextCardScale = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
          });

        return users.map((card, index) => {
          if (index < currentIndex) {
            return null
          } else if (index === currentIndex) {
            // current card
            return (
              <Animated.View
                key={index}
                style={[
                  styles.card,
                  position.getLayout(),
                  rotateAndTranslate,
                ]}
                {...panResponder.panHandlers}
              >
                <Card card={card} />
              </Animated.View>
            );
          } else {
            return (
                <Animated.View
                  key={index}
                  style={[
                    styles.card,
                    {
                      position: "absolute",
                      top: 142,
                      opacity: nextCardOpacity,
                      transform: [{ scale: nextCardScale }],
                    },
                  ]}
                >
                  <Card card={card} />
                </Animated.View>
              );
          }
        });
      };
      
  
      const handleYup = (card) => {
        // Add Friend
        console.log("Added as Friend: ", card.name);
        console.log("User ID: ", card.uid);
      
        const currentUserUid = auth.currentUser?.uid;
      
        // Retrieve the current friendList array from the database
        const friendListRef = ref(database, `userId/${currentUserUid}/friendList`);
        get(friendListRef)
          .then((snapshot) => {
            const friendList = snapshot.val() || [];

            console.log(friendList);
      
            // Check if the friend UID already exists in the friendList
            if (friendList.includes(card.uid)) {
              Alert.alert("Error", "Friend already added.");
              return;
            }
      
            // Update the friendList locally
            const updatedFriendList = [...friendList, card.uid];
      
            // Set the updated friendList array to the database
            set(friendListRef, updatedFriendList)
              .then(() => {
                Alert.alert("Success", "Friend added successfully!");
              })
              .catch((error) => {
                Alert.alert("Error", "Failed to add friend. Please try again.");
                console.log("Error adding friend:", error);
              });
          })
          .catch((error) => {
            Alert.alert("Error", "Failed to retrieve friend list. Please try again.");
            console.log("Error retrieving friend list:", error);
          });

        // Retrieve the current friendList array from the database
        const otherFriendListRef = ref(database, `userId/${card.uid}/friendList`);
        get(otherFriendListRef)
          .then((snapshot) => {
            const otherFriendList = snapshot.val() || [];

            console.log(otherFriendList);
      
            // Check if the friend UID already exists in the friendList
            if (otherFriendList.includes(currentUserUid)) {
              Alert.alert("Error", "Friend already added.");
              return;
            }
      
            // Update the friendList locally
            const updatedOtherFriendList = [...otherFriendList, currentUserUid];
      
            // Set the updated friendList array to the database
            set(otherFriendListRef, updatedOtherFriendList)
              .then(() => {
              })
              .catch((error) => {
                console.log("Error adding friend:", error);
              });
          })
          .catch((error) => {
            console.log("Error retrieving friend list:", error);
          });
      
        nextCard();
      };
  
    const handleNope = (card) => {
      // Do not add Friend
      console.log("Disliked: ", card.name);
      nextCard();
    };
  
    const nextCard = () => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      resetPosition();
    };
  

    const Card = ({ card }) => {
      const level = Math.floor(card.xp / 100) + 1;
      const trophyColour = level < 10 ? "#808080" : level < 20 ? "#B87333" : level < 30 ? '#C0C0C0' : level < 40 ? 'gold' : level < 50 ? '#50C878' : '#6EB2D4';
      const trophyText = level < 10 ? 'Iron' : level < 20 ? 'Bronze' : level < 30 ? 'Silver' : level < 40 ? 'Gold' : level < 50 ? 'Emerald' : 'Diamond';

      const likeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      });
    
      const nopeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
      });   
    

      return (
        <View style={styles.card}>
          {card.photo ? (
            <Image source={{ uri: card.photo }} style={styles.profilePicture} />
          ) : (
            <Image
              source={require('../../../../assets/profileholder.png')}
              style={styles.profilePicture}
            />
          )}
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.username}>{card.username}</Text>
            {card.gender === 'male' ? (
              <Fontisto name="male" size={18} color="dodgerblue" style={{ marginLeft: 10, marginTop: 11 }} />
            ) : card.gender === 'female' ? (
              <Fontisto name="female" size={18} color="pink" style={{ marginLeft: 10, marginTop: 11 }} />
            ) : (
              <View />
            )}
          </View>

        <View>
            
        </View>
          <View style={{marginRight: 150, marginVertical: 10}}>
            <Text style={styles.interestsLabel}>Achievements</Text>
            <View style={styles.levelContainer}>
                <Text style={styles.levelText}>Level {level}</Text>
                <View style={styles.trophyContainer}>
                    <Text style={styles.trophyText}>{trophyText}</Text>
                    <Ionicons
                        name="trophy"
                        color={trophyColour}
                        style={styles.trophyIcon}
                        size={15}
                    />
                </View>
            </View>
          </View>
          
          {card.interests ? (
            <View>
                <Text style={styles.interestsLabel}>Common Interests</Text>
                <Text style={styles.interests}>{commonInterests.join(", ")}</Text>
            </View>
            ) : (
            <Text style={styles.interests}>No common interests</Text>
            )}
            {currentIndex === users.indexOf(card) && (
                <Animated.View
                style={{
                    opacity: likeOpacity,
                    transform: [{ rotate: "-30deg" }],
                    position: "absolute",
                    top: 50,
                    left: 40,
                    zIndex: 1000
                }}
                >
                <Text
                    style={{
                    borderWidth: 1,
                    borderColor: "green",
                    color: "green",
                    fontSize: 28,
                    fontWeight: "800",
                    padding: 10
                    }}
                >
                    CONNECT
                </Text>
                </Animated.View>
            )}
            {currentIndex === users.indexOf(card) && (
                <Animated.View
                style={{
                    opacity: nopeOpacity,
                    transform: [{ rotate: "30deg" }],
                    position: "absolute",
                    top: 50,
                    right: 40,
                    zIndex: 1000
                }}
                >
                <Text
                    style={{
                    borderWidth: 1,
                    borderColor: "red",
                    color: "red",
                    fontSize: 28,
                    fontWeight: "800",
                    padding: 10
                    }}
                >
                    SKIP
                </Text>
                </Animated.View>
            )}
            </View>
        );
    };
  
    const NoMoreCards = () => (
      <View style={styles.noMoreCards}>
        <Text style={{color: 'gray'}}>No more study buddies found</Text>
      </View>
    );
  
    return (
      <ImageBackground source={require('../../../../assets/studyModeBG.webp')} style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Buddy Search</Text>
          <Text style={styles.description}>Search for Study Buddies to study together with.</Text>
          {users.length > currentIndex ? (
            renderCards().reverse()
          ) : (
            <NoMoreCards />
          )}
        </View>
      </ImageBackground>
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH * 0.9,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 15,
        color: '#FFF',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#FFF',
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        height: 300,
        width: 300,
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    noMoreCards: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    profilePicture: {
        width: 110,
        height: 110,
        borderRadius: 60,
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelText: {
        marginRight: 10,
        fontSize: 14,
    },
    trophyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trophyText: {
        marginRight: 5,
        fontSize: 14,
    },
    trophyIcon: {
        marginLeft: 5,
    },
    swipeText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    interestsLabel: {
        fontSize: 15,
        color: 'gray',
    },
    interests: {
        fontSize: 14,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        maxWidth: '75%'
    },
    });

export default SearchBuddy;
