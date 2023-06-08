import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, SafeAreaView, View, KeyboardAvoidingView } from 'react-native';
import AnalogClock from 'react-native-clock-analog';
import TimeFeature from './ClockTab';

const Clock = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);

    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const formattedDate = now.toLocaleDateString(undefined, options);
      setCurrentDate(formattedDate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const goToHome = () => navigation.navigate('StudyDashboard');

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
      <View style={styles.clockContainer}>
        <AnalogClock
          size={200}
          colorClock="#333333"
          colorCenter="#333333"
          colorNumber="#333333"
          showSeconds
        />
        <Text style={styles.clockText}>{currentTime}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <KeyboardAvoidingView style={styles.timeFeatureContainer} behavior="padding">
        <TimeFeature />
      </KeyboardAvoidingView>
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
    marginTop: 20,
  },
  dateText: {
    fontSize: 18,
    color: '#808080',
    marginTop: 10,
    marginLeft: 30,
  },
  timeFeatureContainer: {
    flex: 1,
    marginTop: 20,
  },
});

export default Clock;
