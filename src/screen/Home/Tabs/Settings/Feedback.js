import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBW9gyTZcDHmnAIzCXQKfKmrz1yCrot2ZQ",
  authDomain: "orbital-265b4.firebaseapp.com",
  databaseURL: "https://orbital-265b4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "orbital-265b4",
  storageBucket: "orbital-265b4.appspot.com",
  messagingSenderId: "927371819112",
  appId: "1:927371819112:web:0320800c1c8e8edf9763dd"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();


const Feedback = ({ navigation }) => {
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackText, setFeedbackText] = useState('');


  const goToHome = () => navigation.navigate('Settings');

  const handleSendFeedback = async () => {
    if (feedbackTitle.trim() === '' || feedbackText.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback title and content.');
      Keyboard.dismiss();
      return;
    } 

    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }

    try {
      const feedbackData = {
        title: feedbackTitle.trim(),
        text: feedbackText.trim(),
        userName: user.displayName || 'Unknown User',
      };

      await database.ref('feedbacks').push(feedbackData);

      Alert.alert('Success', 'Thank you for your feedback!');
      setFeedbackTitle('');
      setFeedbackText('');
      Keyboard.dismiss();
    } catch (error) {
      console.log('Error sending feedback:', error);
      Alert.alert('Error', 'Failed to send feedback. Please try again.');
    }
  };
  

  const handleClearFeedback = () => {
    setFeedbackText('');
    setFeedbackTitle('')
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={'padding'}
        >
          <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={goToHome}>
              <Text style={styles.back}>{'\u2190'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Feedback</Text>
            <Ionicons name='chatbubbles' size={30} style={styles.icon} color={'white'} />
          </View>
          <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.text}>
              We value your feedback and suggestions to improve our app. If you have any ideas, feature requests, or general feedback, we would love to hear from you. 
              {'\n\n'}Please send us your thoughts below:
            </Text>
            <TextInput
              style={styles.inputTitle}
              placeholder="Enter your feedback title here"
              value={feedbackTitle}
              onChangeText={setFeedbackTitle}
            />
            <TextInput
              style={styles.input}
              multiline
              placeholder="Enter your feedback here"
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
         </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFeedback}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>

        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'white',
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    marginHorizontal: 30,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 30,
    marginTop: 10,
    minHeight: 100,
    height: 300,
  },
  inputTitle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 30,
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#999',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginRight: 6, 
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft: 6, 
  },
  scrollContent: {
    flexGrow: 1,
  },  
});

export default Feedback;
