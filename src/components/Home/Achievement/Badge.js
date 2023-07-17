import React from 'react';
import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faUserPlus,
  faUsers,
  faHandHoldingHeart,
  faStopwatch,
  faHourglass,
  faClock,
  faPencilAlt,
  faStickyNote,
  faBook,
  faComment,
  faComments,
  faCommentDots,
  faHourglass2,
  faCommentSlash,
  faPencilSquare
} from '@fortawesome/free-solid-svg-icons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { auth, database } from '../../../../firebase'
import { ref, onValue } from 'firebase/database'
import * as Progress from 'react-native-progress';

const Badge = () => {
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');
  const [xp, setXp] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // States for badges
  const [numberOfStudyBuddies, setNumberOfStudyBuddies] = useState(0);
  const [timeInStudySession, setTimeInStudySession] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfFeeds, setNumberOfFeeds] = useState(0)

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
  };

  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'userId/' + currentUser.uid), (snapshot) => {
      //to listen to the change of user profile.
      if (snapshot.exists()) {
        const user = snapshot.val();
        setUsername(user.username);
        setPhoto(user.photo);
        setXp(user.xp);
        setNumberOfStudyBuddies(user.friendList ? user.friendList.length : 0);
        setNumberOfFeeds(user.numberOfFeeds);
        setNumberOfComments(user.numberOfComments);   
        setTimeInStudySession(user.timeInSession);
      }
      return () => {
        unsubscribe();
      }
    })
  }, []);

  const badges = [
    {
      id: '1',
      name: 'Buddy Initiator',
      icon: faUser,
      description: 'Make 1 Study Buddy',
      progress: numberOfStudyBuddies,
      requirement: 1,
      requirementString: 'Buddy',
      unlocked: numberOfStudyBuddies >= 1
    },
    {
      id: '2',
      name: 'Friendly Collaborator',
      icon: faUserPlus,
      description: 'Make 10 Study Buddies',
      progress: numberOfStudyBuddies,
      requirement: 10,
      requirementString: 'Buddies',
      unlocked: numberOfStudyBuddies >= 10
    },
    {
      id: '3',
      name: 'Social Connector',
      icon: faUsers,
      description: 'Make 25 Study Buddies',
      progress: numberOfStudyBuddies,
      requirement: 25,
      requirementString: 'Buddies',
      unlocked: numberOfStudyBuddies >= 25
    },
    {
      id: '4',
      name: 'Kindred Spirit',
      icon: faHandHoldingHeart,
      description: 'Make 100 Study Buddies',
      progress: numberOfStudyBuddies,
      requirement: 100,
      requirementString: 'Buddies',
      unlocked: numberOfStudyBuddies >= 100
    },
    {
      id: '5',
      name: 'Time Tracker',
      icon: faClock,
      description: 'Spend 1 hour in the Study Session',
      progress: timeInStudySession.toFixed(1),
      requirement: 1,
      requirementString: 'hour',
      unlocked: timeInStudySession >= 1
    },
    {
      id: '6',
      name: 'Time Alchemist',
      icon: faStopwatch,
      description: 'Spend 10 hours in the Study Session',
      progress: timeInStudySession.toFixed(1),
      requirement: 10,
      requirementString: 'hours',
      unlocked: timeInStudySession >= 10
    },
    {
      id: '7',
      name: 'Hourglass Sage',
      icon: faHourglass,
      description: 'Spend 25 hours in the Study Session',
      progress: timeInStudySession.toFixed(1),
      requirement: 25,
      requirementString: 'hours',
      unlocked: timeInStudySession >= 25
    },
    {
      id: '8',
      name: 'Master of Time',
      icon: faHourglass2,
      description: 'Spend 100 hours in the Study Session',
      progress: timeInStudySession.toFixed(1),
      requirement: 100,
      requirementString: 'hours',
      unlocked: timeInStudySession >= 100
    },
    {
      id: '9',
      name: 'Knowledge Scribe',
      icon: faPencilAlt,
      description: 'Post 1 time in the Study Feed',
      progress: numberOfFeeds,
      requirement: 1,
      requirementString: 'post',
      unlocked: numberOfFeeds >= 1
    },
    {
      id: '10',
      name: 'Active Learner',
      icon: faStickyNote,
      description: 'Post 10 times in the Study Feed',
      progress: numberOfFeeds,
      requirement: 10,
      requirementString: 'posts',
      unlocked: numberOfFeeds >= 10
    },
    {
      id: '11',
      name: 'Thought Provoker',
      icon: faPencilSquare,
      description: 'Post 50 times in the Study Feed',
      progress: numberOfFeeds,
      requirement: 50,
      requirementString: 'posts',
      unlocked: numberOfFeeds >= 50
    },
    {
      id: '12',
      name: 'Wisdom Seeker',
      icon: faBook,
      description: 'Post 100 times in the Study Feed',
      progress: numberOfFeeds,
      requirement: 100,
      requirementString: 'posts',
      unlocked: numberOfFeeds >= 100
    },
    {
      id: '13',
      name: 'Comment Connoisseur',
      icon: faComment,
      description: 'Comment 1 time in the Study Feed',
      progress: numberOfComments,
      requirement: 1,
      requirementString: 'comment',
      unlocked: numberOfComments >= 1
    },
    {
      id: '14',
      name: 'Opinion Artisan',
      icon: faCommentSlash,
      description: 'Comment 10 times in the Study Feed',
      progress: numberOfComments,
      requirement: 10,
      requirementString: 'comments',
      unlocked: numberOfComments >= 10
    },
    {
      id: '15',
      name: 'Discussion Aficionado',
      icon: faCommentDots,
      description: 'Comment 100 times in the Study Feed',
      progress: numberOfComments,
      requirement: 100,
      requirementString: 'comments',
      unlocked: numberOfComments >= 100
    },
    {
      id: '16',
      name: 'Dialogue Maestro',
      icon: faComments,
      description: 'Comment 1000 times in the Study Feed',
      progress: numberOfComments,
      requirement: 1000,
      requirementString: 'comments',
      unlocked: numberOfComments >= 1000
    }
  ];
  

  const level = Math.floor(xp / 100) + 1;
  const trophyColour = level<10?"#808080":level<20?"#B87333":level<30? '#C0C0C0':level<40?'gold':level<50?'#50C878':'#6EB2D4';
  const trophyText = level<10?'Iron':level<20?'Bronze':level<30?'Silver':level<40?'Gold':level<50?'Emerald':'Diamond';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBorder}>
          {photo ? (
            <Image source={{uri: photo}} style={styles.icon} resizeMode="cover" />
          ) : (
            <Image source={require("../../../../assets/profileholder.png")} style={styles.icon} />
          )}
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>{username}</Text>

      <View style={{alignItems: 'center'}}>
        <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {level}</Text>
            <View style={styles.trophyContainer}>
              <Text style={styles.trophyText}>{trophyText}</Text>
                <Ionicons name="trophy" color={trophyColour} style={styles.trophyIcon} size={15}/>
            </View>
        </View>
        <Progress.Bar 
          progress={(xp%100)/100} 
          width={200} 
          height={20}
          borderRadius={40}
          color='mediumpurple'
          unfilledColor='lightgray'
          borderWidth={0}
          style={{marginVertical: 5}}/>
        <Text style={styles.xp}>{xp} XP</Text>
        <Text>{100 - xp%100} XP to next level</Text>
      </View>

      <View style={styles.badgesContainer}>
        {badges.map((badge) => (
          <TouchableOpacity 
          key={badge.id} 
          style={styles.badgeItem}
          onPress={() => handleBadgePress(badge)}>
        
          <FontAwesomeIcon
            icon={badge.icon}
            size={32}
            style={[styles.badgeIcon, !badge.unlocked && styles.lockedBadgeIcon]}
          />
        </TouchableOpacity>
        ))}

      </View>
      <Modal
        visible={selectedBadge !== null}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.badgeInfoContainer}>
              <FontAwesomeIcon
              icon={selectedBadge?.icon}
              size={18}

              style={[styles.badgeIcon, !selectedBadge?.unlocked && styles.lockedBadgeIcon]}
              />
              <Text style={styles.badgeName}>{selectedBadge?.name}</Text>
            </View>

            <Text style={styles.description}>{selectedBadge?.description}</Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { 
                  maxWidth: '100%', 
                  width: `${(selectedBadge?.progress / selectedBadge?.requirement) * 100}%`,
                  backgroundColor: selectedBadge?.progress >= selectedBadge?.requirement ? 'green' : 'red',
                },
                ]}></View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.progress}>Progress: </Text>
              <Text style={[styles.progress, selectedBadge?.progress < selectedBadge?.requirement ? styles.red : styles.green]}>
                {selectedBadge?.progress}
              </Text>
              <Text style={styles.progress}> / {`${selectedBadge?.requirement} ${selectedBadge?.requirementString}`}</Text>
            </View>


            <TouchableOpacity onPress={() => setSelectedBadge(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBorder: {
    borderRadius: 60,
    padding: 3,
  },
  icon: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    maxWidth: '75%'
  },
  xp: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    position: "absolute",
    bottom: 22,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
  },
  badgeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: '#e6e6e6',
    borderRadius: 35,
  },
  badgeIcon: {
    color: '',
  },
  lockedBadgeIcon: {
    color: 'gray',
    opacity: 0.5,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  badgeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 20,
    color: 'black',
  },
  badgeName: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 8,
  },
  description: {
    marginVertical: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  progress: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
  }, 
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
});

export default Badge;
