import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Keyboard, StyleSheet } from 'react-native';

const CountdownTimer = () => {
  const [time, setTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('300');

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          }
          return prevTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning((prevState) => !prevState);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(parseInt(inputTime, 10));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let timeString = '';

    if (hours > 0) {
      timeString += hours + 'h ';
    }

    if (minutes > 0 || hours > 0) {
      timeString += minutes + 'm ';
    }

    timeString += seconds.toString().padStart(2, '0') + 's';

    return timeString;
  };

  const handleTimeChange = (newTime) => {
    setInputTime(newTime);
  };

  const handleDoneEditing = () => {
    setTime(parseInt(inputTime, 10));
    Keyboard.dismiss();
  };

  return (
      <View style={styles.container}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
        <View style={styles.buttonRow}>
        <Text style={styles.label}>Countdown Time:</Text>
            <View style={styles.buttonRow}>
                <TextInput
                 style={styles.input}
                 value={inputTime}
                 onChangeText={handleTimeChange}
                 keyboardType="numeric"
                 returnKeyType="done"
                 placeholder='in seconds'
                onSubmitEditing={handleDoneEditing}
            />
            <Text style={styles.second}>s</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={handleStartStop}>
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
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 20,
    marginBottom: -5,
    marginLeft: 40,
  },
  line: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: -20,
    paddingHorizontal: 10,
  },
  second: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 5,
  },
});

export default CountdownTimer;
