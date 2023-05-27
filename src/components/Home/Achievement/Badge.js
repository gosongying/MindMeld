import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Badge = () => {
  const badges = [
    { id: '1', icon: 'book', unlocked: true },
    { id: '2', icon: 'heart', unlocked: true },
    { id: '3', icon: 'bulb', unlocked: false },
    { id: '4', icon: 'cog', unlocked: false },
    { id: '5', icon: 'document', unlocked: true },
    { id: '6', icon: 'flash', unlocked: false },
    { id: '7', icon: 'bar-chart', unlocked: true },
    { id: '8', icon: 'medal', unlocked: false },
    { id: '9', icon: 'hourglass', unlocked: false },
    { id: '10', icon: 'key', unlocked: true },
    { id: '11', icon: 'megaphone', unlocked: true },
    { id: '12', icon: 'rocket', unlocked: true },
    { id: '13', icon: 'search', unlocked: false },
    { id: '14', icon: 'star', unlocked: true },
    { id: '15', icon: 'umbrella', unlocked: true },
    { id: '16', icon: 'trophy', unlocked: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBorder}>
          <Image source={require('../../../../assets/profileholder.png')} style={styles.icon} resizeMode="cover" />
        </View>
      </View>
      <Text style={styles.name}>Your Name</Text>
      <Text style={styles.xp}>XP: 1302</Text>
      <View style={styles.badgesContainer}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badgeItem}>
            <Ionicons
              name={badge.icon}
              size={30}
              style={[styles.badgeIcon, !badge.unlocked && styles.lockedBadgeIcon]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBorder: {
    borderRadius: 60,
    padding: 2,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  xp: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
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
});

export default Badge;
