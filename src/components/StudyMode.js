import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const StudyMode = () => {
  const [studyModeActive, setStudyModeActive] = useState(false);

  const toggleStudyMode = () => {
    setStudyModeActive(!studyModeActive);
  };

  return (
    <ImageBackground source={require('../../assets/studyModeBG.webp')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Study Mode</Text>
        <Text style={styles.description}>
          Study Mode restricts access to distractions and helps you focus on your tasks.
        </Text>
        <Pressable style={styles.button} onPress={toggleStudyMode}>
          <Text style={styles.buttonText}>
            {studyModeActive ? 'Deactivate' : 'Activate'} Study Mode
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth * 0.9,
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
});

export default StudyMode;
