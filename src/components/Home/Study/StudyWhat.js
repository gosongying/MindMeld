import React, { useState } from 'react';
import { View, Image, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';

const StudyWhat = ({ navigation }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    navigation.navigate('CreateStudySession'); // Navigate to CreateStudySession screen
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/studywhat.png')}
        style={styles.image}
      />
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={[
            styles.button,
            isPressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 330,
    borderRadius: 10,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    backgroundColor: '#DC582A',
    padding: 10,
    borderRadius: 10,
    width: 130,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudyWhat;
