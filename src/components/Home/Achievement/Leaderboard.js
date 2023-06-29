import React from 'react';
import { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Dimensions, Text, ScrollView, Image, FlatList } from 'react-native';
import { auth, database } from '../../../../firebase'
import { ref, onValue, get } from 'firebase/database'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'userId/' + uid), (snapshot) => {
      if (snapshot.exists()) {
        const friendList = snapshot.val().friendList;
  
        if (friendList && Array.isArray(friendList) && friendList.length > 0) {
          const promises = friendList.map(friendUid => {
            // Fetch the necessary data for each friend UID
            return get(ref(database, 'userId/' + friendUid))
              .then(friendSnapshot => {
                if (friendSnapshot.exists()) {
                  const { username, xp, photo } = friendSnapshot.val();
                  return { uid: friendUid, username, xp, photo };
                }
                return null;
              });
          });
  
          Promise.all(promises).then((data) => {
            // Create an object for the current user
            const currentUser = {
              uid: uid,
              username: snapshot.val().username,
              xp: snapshot.val().xp,
              photo: snapshot.val().photo,
            };
  
            // Concatenate the current user object with the existing data array
            const combinedData = [currentUser, ...data];
  
            // Sort the combined data based on XP in decreasing order
            const sortedData = combinedData.sort((a, b) => b.xp - a.xp);
  
            // Fill the top 3 positions
            const top3Data = sortedData.slice(0, 3);
            const remainingData = sortedData.slice(3);
  
            // Combine the top 3 and remaining data
            const filledData = [...top3Data, ...remainingData];
  
            setLeaderboardData(filledData);
  
            // Set the current user's rank
            setCurrentUserRank(sortedData.findIndex((item) => item.uid === uid));
          });
        } else {
          // If friendList is empty, leaderboardData will only contain the current user
          const currentUser = {
            uid: uid,
            username: snapshot.val().username,
            xp: snapshot.val().xp,
            photo: snapshot.val().photo,
          };
  
          setLeaderboardData([currentUser]);
  
          // Set the current user's rank as 0
          setCurrentUserRank(0);
        }
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  


  const renderItem = ({ item, index }) => {
    const isCurrentUserRank = currentUserRank !== null && currentUserRank === index + 3;
    
    return (
      <View style={[styles.itemContainer, isCurrentUserRank && styles.currentUserContainer]}>
        <View style={styles.leftContainer}>
          <Text style={styles.itemRank}>{index + 4}</Text>
          
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={styles.itemImage} />
          ) : (
            <Image source={require("../../../../assets/profileholder.png")} style={styles.itemImage} />
          )}
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemName}>{item.username}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.itemScore}>{item.xp}</Text>
        </View>
      </View>
    );
  };
  


  return (
    <ImageBackground
      source={require('../../../../assets/purple_bg.webp')}
      style={styles.container}
    >
      <View style={styles.top3container}>
        {/* Render the second place position */}
        
        <View>
          <View style={[styles.secondPlaceContainer, currentUserRank == 1 && styles.greenBorder]}>
          {leaderboardData.length > 1 && leaderboardData[1].photo ? (
              <Image source={{ uri: leaderboardData[1].photo }} style={styles.secondPlaceImage} />
            ) : (
              <Image source={require('../../../../assets/profileholder.png')} style={styles.secondPlaceImage} />
            )}
            <View style={styles.secondPlace}>
              <Text style={styles.numText2}>2</Text>
            </View>
            </View>
          {leaderboardData.length > 1  && (
            <View style={styles.details}>
              <Text style={styles.detailsText}>{leaderboardData[1].username}</Text>
              <Text style={styles.xpText}>{leaderboardData[1].xp}</Text>
            </View>
          )}
        </View>

        {/* Render the first place position */}
        <View>
          <View style={[styles.firstPlaceContainer, currentUserRank == 0 && styles.greenBorder]}>
          {leaderboardData.length > 0 && leaderboardData[0].photo ? (
            <Image source={{ uri: leaderboardData[0].photo }} style={styles.firstPlaceImage} />
          ) : (
            <Image source={require('../../../../assets/profileholder.png')} style={styles.firstPlaceImage} />
          )}
          <View style={styles.firstPlace}>
            <Text style={styles.numText}>1</Text> 
          </View>
          </View>
          {leaderboardData.length > 0 && (
            <View style={styles.details}>
              <Text style={styles.detailsText}>{leaderboardData[0].username}</Text>
              <Text style={styles.xpText}>{leaderboardData[0].xp}</Text>
            </View>
          )}
        </View>

        {/* Render the third place position */}
        <View>
         <View style={[styles.thirdPlaceContainer, currentUserRank == 2 && styles.greenBorder]}>
         {leaderboardData.length > 2 && leaderboardData[2].photo ? (
            <Image source={{ uri: leaderboardData[2].photo }} style={styles.secondPlaceImage} />
          ) : (
            <Image source={require('../../../../assets/profileholder.png')} style={styles.secondPlaceImage} />
          )}
          <View style={styles.thirdPlace}>
            <Text style={styles.numText2}>3</Text>
          </View>
          </View>
          {leaderboardData.length > 2 && (
            <View style={styles.details}>
              <Text style={styles.detailsText}>{leaderboardData[2].username}</Text>
              <Text style={styles.xpText}>{leaderboardData[2].xp}</Text>
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={leaderboardData.slice(3)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}      
      />
        {leaderboardData.length <= 3  && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Add more Study Buddies!</Text>
          <Text style={styles.emptySubText}>Compare your leaderboard with your friends.</Text>
        </View>
        )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top3container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  firstPlaceContainer: {
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 100,
    marginHorizontal: 20,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondPlaceContainer: {
    backgroundColor: 'white',
    width: 95,
    height: 95,
    borderRadius: 100,
    marginTop: 70,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdPlaceContainer: {
    backgroundColor: 'white',
    width: 95,
    height: 95,
    borderRadius: 100,
    marginTop: 70,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstPlace: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 100,
    marginTop: 50,
    borderWidth: 4,
    borderColor: 'white',
    left: 35,
    bottom: 90,
  },
  secondPlace: {
    position: 'absolute',
    backgroundColor: '#C0C0C0',
    width: 35,
    height: 35,
    borderRadius: 100,
    marginTop: 50,
    borderWidth: 4,
    borderColor: 'white',
    left: 25,
    bottom: 69,
  },
  thirdPlace: {
    position: 'absolute',
    backgroundColor: '#CD7F32',
    width: 35,
    height: 35,
    borderRadius: 100,
    marginTop: 50,
    borderWidth: 4,
    borderColor: 'white',
    left: 25,
    bottom: 69,
  },
  numText: {
    fontSize: 21,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 3,
  },
  numText2: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  firstPlaceImage: {
    width: 110,
    height: 110,
    borderRadius: 80,
  },
  secondPlaceImage: {
    width: 85,
    height: 85,
    borderRadius: 80,
  },
  thirdPlaceImage: {
    width: 85,
    height: 85,
    borderRadius: 80,
  },
  details: {
    alignItems: 'center',
    marginTop: 10,
  },
  detailsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'gray'
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  top3ItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 8,
  },
  itemRank: {
    fontSize: 17,
    fontWeight: '600',
    marginRight: 10,
  },
  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
  },
  itemScore: {
    fontSize: 17,
    fontWeight: '600',
  },
  currentUserContainer: {
    backgroundColor: '#98FF98', 
  },
  greenBorder: {
    borderColor: '#98FF98', 
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 15,
    bottom: 220,
    padding: 30,
    marginHorizontal: 40,
    marginBottom: -30
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  }
});

export default Leaderboard;
