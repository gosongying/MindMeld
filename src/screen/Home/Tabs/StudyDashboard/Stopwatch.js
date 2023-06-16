import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';


const Stopwatch = () => {
  const [time, setTime] = useState('0s 00');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        const currentElapsedTime = Date.now() - startTime;
        setElapsedTime(currentElapsedTime);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  useEffect(() => {
    if (isRunning) {
      setStartTime(Date.now() - elapsedTime);
    }
  }, [isRunning, elapsedTime]);

  const calculateTime = () => {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    let timeString = '';

    if (hours > 0) {
      timeString += hours + 'h ';
    }

    if (minutes > 0 || hours > 0) {
      timeString += minutes + 'm ';
    }

    timeString += seconds + 's ' + milliseconds.toString().padStart(2, '0');

    return timeString;
  };

  const handleStart = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setStartTime(Date.now() - elapsedTime);
    }
  };


  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setTime('0s 00');
  };


  useEffect(() => {
    setTime(calculateTime());
  }, [elapsedTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{time}</Text>
      <View style={styles.line} />
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 40,
    marginLeft: 40,
  },
  line: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Stopwatch;
