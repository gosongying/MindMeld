import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';

const Clock = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState(null);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setAlarm = () => {
    const alarm = new Date(year, month, day, hours, minutes);
    setAlarmTime(alarm);
    setIsAlarmSet(true);
  };

  const clearAlarm = () => {
    setAlarmTime(null);
    setIsAlarmSet(false);
  };

  const playAlarm = () => {
    SoundPlayer.playSoundFile('alarm.mp3', 'mp3');
  };

  const goToHome = () => navigation.navigate('StudyDashboard');

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
      <View style={styles.clockContainer}>
        <Text style={styles.clockText}>{currentTime}</Text>
      </View>
      <View style={styles.alarmContainer}>
        <Text style={styles.alarmStatus}>
          {isAlarmSet ? `Alarm set for ${alarmTime}` : 'No alarm set'}
        </Text>
        <View style={styles.alarmForm}>
          <TextInput
            style={styles.input}
            placeholder="Set alarm (HH:MM)"
            placeholderTextColor="#777777"
            onChangeText={setAlarmTime}
            value={alarmTime}
          />
          <TouchableOpacity style={styles.setAlarmButton} onPress={setAlarm}>
            <Text style={styles.setAlarmButtonText}>Set Alarm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearAlarmButton} onPress={clearAlarm}>
            <Text style={styles.clearAlarmButtonText}>Clear Alarm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
  },
  clockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
  },
  alarmContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  alarmStatus: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333333',
  },
  alarmForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#777777',
  },
  setAlarmButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  setAlarmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearAlarmButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 10,
  },
  clearAlarmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Clock;
