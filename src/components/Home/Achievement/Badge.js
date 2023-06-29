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
  faPenSquare,
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

import { auth, database } from '../../../../firebase'
import { ref, onValue } from 'firebase/database'


const Badge = () => {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
  };

  const uid = auth.currentUser.uid;

  // Get Username and listen for changes
  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'userId/' + uid), (snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val().username);
      }
    });
    return () => {
      unsubscribe();
    }
  })

  // Get Image and listens for changes
  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'userId/' + uid), (snapshot) => {
      if (snapshot.exists()) {
        setImage(snapshot.val().photo)
      }
    });
    return () => {
      unsubscribe();
    }
  })

  //Each badge has an id, name, icon, description,
  //requirement (in int), requirementString (the string that follows the int)
  //and an boolean unlocked
  const badges = [
    { id: '1', name:'Buddy Initiator', icon: faUser, description: 'Make 1 Study Buddy', requirement: 1, requirementString: 'Buddy', unlocked: false },
    { id: '2', name:'Friendly Collaborator', icon: faUserPlus, description: 'Make 10 Study Buddies', requirement: 10, requirementString: 'Buddies', unlocked: false },
    { id: '3', name:'Social Connector', icon: faUsers, description: 'Make 25 Study Buddies', requirement: 25, requirementString: 'Buddies', unlocked: false },
    { id: '4', name:'Kindred Spirit', icon: faHandHoldingHeart, description: 'Make 100 Study Buddies', requirement: 100, requirementString: 'Buddies', unlocked: false },
    { id: '5', name:'Time Tracker', icon: faClock, description: 'Spend 1 hour in the Study Session', requirement: 1, requirementString: 'hour', unlocked: false },
    { id: '6', name:'Time Alchemist', icon: faStopwatch, description: 'Spend 10 hours in the Study Session', requirement: 10, requirementString: 'hours', unlocked: false },
    { id: '7', name:'Hourglass Sage', icon: faHourglass, description: 'Spend 25 hours in the Study Session', requirement: 25, requirementString: 'hours', unlocked: false },
    { id: '8', name:'Master of Time', icon: faHourglass2, description: 'Spend 100 hours in the Study Session', requirement: 100, requirementString: 'hours', unlocked: false },
    { id: '9', name:'Knowledge Scribe', icon: faPencilAlt, description: 'Post 1 time in the Study Feed', requirement: 1, requirementString: 'post', unlocked: false },
    { id: '10', name:'Active Learner', icon: faStickyNote, description: 'Post 10 times in the Study Feed', requirement: 10, requirementString: 'posts', unlocked: false },
    { id: '11', name:'Thought Provoker', icon: faPencilSquare, description: 'Post 50 times in the Study Feed', requirement: 50, requirementString: 'posts', unlocked: false },
    { id: '12', name:'Wisdom Seeker', icon: faBook, description: 'Post 100 times in the Study Feed', requirement: 100, requirementString: 'posts', unlocked: false },
    { id: '13', name:'Comment Connoisseur', icon: faComment, description: 'Comment 1 time in the Study Feed', requirement: 1, requirementString: 'comment', unlocked: false },
    { id: '14', name:'Opinion Artisan', icon: faCommentSlash, description: 'Comment 10 times in the Study Feed', requirement: 10, requirementString: 'comments', unlocked: false },
    { id: '15', name:'Discussion Aficionado', icon: faCommentDots, description: 'Comment 100 times in the Study Feed', requirement: 100, requirementString: 'comments', unlocked: false },
    { id: '16', name:'Dialogue Maestro', icon: faComments, description: 'Comment 1000 times in the Study Feed', requirement: 1000, requirementString: 'comments', unlocked: false },
  ];

  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBorder}>
          {image ? (
            <Image source={{uri: image}} style={styles.icon} resizeMode="cover" />
          ) : (
            <Image source={require("../../../../assets/profileholder.png")} style={styles.icon} />
          )}
        </View>
      </View>
      <Text style={styles.name}>{username}</Text>

      {/* This view is still hardcoded */}
      <View>
        <Text style={styles.xp}>XP: 1302</Text>
        <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level 10</Text>
            <View style={styles.trophyContainer}>
              <Text style={styles.trophyText}>Bronze</Text>
              <Ionicons name="trophy" color="#CD7F32" style={styles.trophyIcon} />
            </View>
        </View>
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
            // Locking and unlocking logic not implemented yet
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
              // Locking and unlocking logic not implemented yet
              style={[styles.badgeIcon, !selectedBadge?.unlocked && styles.lockedBadgeIcon]}
              />
              <Text style={styles.badgeName}>{selectedBadge?.name}</Text>
            </View>

            <Text style={styles.description}>{selectedBadge?.description}</Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { 
                  maxWidth: '100%', 
                  // Replace 0 with actual progress
                  width: `${(0 / selectedBadge?.requirement) * 100}%`
                }]}></View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.progress}>Progress: </Text>
              {/* Replace 0 with actual progress */}
              <Text style={styles.progress}>0</Text>
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
    alignItems: 'center',
    marginTop: 20
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
  },
  xp: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    textAlign: 'center',
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
    color: '#e6b800',
  },
  lockedBadgeIcon: {
    color: 'gray',
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
  lockedBadgeIcon: {
    opacity: 0.5,
  },
  badgeName: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
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
});

export default Badge;
