import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Dimensions, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';

const StudyMode = () => {
  const [studyModeActive, setStudyModeActive] = useState(false);
  const [studyModeTimer, setStudyModeTimer] = useState(null);
  const [studyModeDuration, setStudyModeDuration] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const toggleStudyMode = () => {
    if (studyModeActive) {
      clearInterval(studyModeTimer);
      setStudyModeTimer(null);
      setTimeRemaining(0);
    } else {
      setModalVisible(true);
    }
    
    // Delay the execution of toggleStudyMode to avoid 
    // the brief display of "Study Mode Active" and "Time Remaining: 00:00"
    setTimeout(() => {
      setStudyModeActive(!studyModeActive);
    }, 9999999999999999);
  };

  const handleConfirmDuration = () => {
    const duration = parseFloat(studyModeDuration.trim());
  
    if (studyModeDuration.trim() === '') {
      Alert.alert('Invalid Duration', 'Missing value is not allowed');
    } else if (!isNaN(duration) && Number.isInteger(duration) && duration <= 120 && duration > 0) {
      setStudyModeActive(true); // Activate Study Mode
      setTimeRemaining(duration * 60 * 1000); // Convert duration to milliseconds
      setModalVisible(false);
  
      const timer = setInterval(() => {
        setStudyModeActive(false);
        clearInterval(timer);
      }, duration * 60 * 1000); // Convert duration to milliseconds
      setStudyModeTimer(timer);
    } else if (duration > 120) {
      Alert.alert('Invalid Duration', 'Maximum study mode duration is 120 minutes.');
    } else if (duration === 0) {
      Alert.alert('Invalid Duration', 'Duration cannot be zero.');
    } else if (!Number.isInteger(duration)) {
      Alert.alert('Invalid Duration', 'Decimal values are not allowed.');
    }
  };
  

  useEffect(() => {
    if (studyModeActive) {
      const countdown = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            clearInterval(countdown);
            setStudyModeActive(false);
            setStudyModeTimer(null);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [studyModeActive]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <ImageBackground source={require('../../../../assets/studyModeBG.webp')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Study Mode</Text>
        <Text style={styles.description}>
          Study Mode restricts access to distractions and helps you focus on your tasks.
        </Text>
        <Pressable style={[styles.button, studyModeActive && styles.buttonActive]} onPress={toggleStudyMode} disabled={studyModeActive}>
          <Text style={styles.buttonText}>
            {studyModeActive ? 'Study Mode Active' : 'Activate Study Mode'}
          </Text>
        </Pressable>
        {studyModeActive && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Time Remaining:</Text>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        )}
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Study Mode {"\n"} Duration (Minutes)</Text>
            <TextInput
              style={styles.durationInput}
              placeholder="Enter duration in minutes (up to 120)"
              keyboardType="number-pad"
              onChangeText={setStudyModeDuration}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDuration}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  buttonActive: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  durationInput: {
    width: '80%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default StudyMode;
