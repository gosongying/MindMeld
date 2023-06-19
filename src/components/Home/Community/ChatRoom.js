import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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

const ChatRoom = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // To scroll to bottom of scrollList 
  const scrollViewRef = useRef(null);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
  
    const user = firebase.auth().currentUser;
    const sender = user ? user.displayName : 'Unknown User';
  
    const newMessage = {
      sender,
      content: inputMessage.trim(),
      timestamp: new Date().getTime(), // Add the timestamp property
    };
  
    database.ref('messages').push(newMessage);
    setInputMessage('');
  };
  
  // To listen for new messages and update the messages state
  useEffect(() => {
    const messagesRef = database.ref('messages');
  
    const handleSnapshot = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    };
  
    messagesRef.on('value', handleSnapshot);
  
    return () => {
      messagesRef.off('value', handleSnapshot);
    };
  }, []);
  
  // Scroll to the bottom of the ScrollView when messages are available
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const renderMessageItems = () => {
    return messages.map((item) => {
      const isCurrentUser = item.sender === firebase.auth().currentUser?.displayName;
      const messageDate = new Date(item.timestamp);
      const messageTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <View
          key={item.id}
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer,
          ]}
        >
          {!isCurrentUser && <Text style={styles.messageSender}>{item.sender}</Text>}
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.time}>{messageTime}</Text>
          </View>
        </View>
      );
    });
  };

  const goToHome = () => navigation.goBack();

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goToHome}>
            <Text style={styles.back}>{'\u2190'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
          <TouchableOpacity style={styles.closeButton}>
            <AntDesign name="infocirlceo" size={24} color="#fff" onPress={() => setShowModal(true)} />
          </TouchableOpacity>
        </View>

        <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {renderMessageItems()}
      </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            style={styles.input}
            multiline
            textAlignVertical="top" 
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Session Information:</Text>
            </View>
              <Text style={styles.label2}>
                Date: 17 June 2023
              </Text>
              <Text style={styles.label2}>
                Start Time: 15 : 00
              </Text>
              <Text style={styles.label2}>
                End Time: 18 : 00
              </Text>
              <TouchableOpacity style={styles.returnButton} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>Return</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginRight: 10,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    marginLeft: 10,
  },
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
    color: '#fff',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: -10,
  },
  label2: {
    fontSize: 15, 
    marginLeft: 20,
    textAlign: 'center',
    paddingVertical: 2,
  },
  returnButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  time: {
    marginTop: 4,
    marginLeft: 10,
    color: '#88888888',
  },
  currentUserMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherUserMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContent: {
    fontSize: 16,
  },
});

export default ChatRoom;
