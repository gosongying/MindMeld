import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, 
TouchableWithoutFeedback, Keyboard, Modal, Alert, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth, database } from "../../../../firebase";
import { runTransaction, ref, onValue, get, set, push } from 'firebase/database';

const ChatUser = ({ route, navigation }) => {
    const { chatSessionId, otherUser: initialOtherUser } = route.params;
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(initialOtherUser); // Initialize otherUser from route.params
    const scrollViewRef = useRef(null);
    const currentUser = auth.currentUser;

  const goToHome = () => navigation.goBack();

  useEffect(() => {
    const messagesRef = ref(database, 'chat/' + chatSessionId);
    const otherUserRef = ref(database, 'userId/' + otherUser.uid);
  
    const unsubscribe = onValue(messagesRef, async (snapshot) => {
      if (snapshot.exists()) {
        const messageList = snapshot.exists() ? (snapshot.val().messages ? snapshot.val().messages : []) : [];
        if (messageList) {
            console.log(messageList);
          setMessages(messageList)
        }
    }});

    const unsubscribeOtherUser = onValue(otherUserRef, (snapshot) => {
        const updatedOtherUser = snapshot.val();
        setOtherUser(updatedOtherUser);
      });

    return () => {
      unsubscribe();
      unsubscribeOtherUser();
    };
  }, [chatSessionId, otherUser.uid]);
  
  // Scroll to the bottom of the ScrollView when messages are available
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  

  const renderMessageItems = () => {
    console.log(messages);
    if (messages.length === 0) {
        return null;
      }

    const messageList = Object.values(messages);

    return messageList.map((item) => {
      const isCurrentUser = item.sender === currentUser?.uid;
      const messageDate = new Date(item.timestamp);
      const messageTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <View
          key={item.timestamp}
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer,
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.messageContent}>{item.content}</Text>
            <View>
              <Text style={styles.time}>{messageTime}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
  
    const newMessage = {
      sender: currentUser.uid,
      content: inputMessage.trim(),
      timestamp: new Date().getTime(),
    };
  
    const chatRef = ref(database, 'chat/' + chatSessionId + '/messages');
  
    // Push the new message to the chat reference
    push(chatRef, newMessage)
      .then(() => {
        setInputMessage('');
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  };
  

  return (

    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={styles.backButton} onPress={goToHome}>
                    <Text style={styles.back}>{'\u2190'}</Text>
                </TouchableOpacity>
            <View style={{flexDirection:'row', marginTop: 43}}>
                {otherUser.photo ? (
                <Image source={{ uri: otherUser.photo }} style={styles.profilePicture} />
            ) : (
                <Image
                source={require('../../../../assets/profileholder.png')}
                style={styles.profilePicture}
                />
            )}
            <View style={{marginTop: -5}}>
                <Text style={styles.username}>{otherUser.username}</Text>
                {otherUser.status ? (
                    <Text style={{ color: 'gray', marginLeft: 10 }}>Online</Text>
                    ) : (
                    <Text style={{ color: 'gray', marginLeft: 10 }}>Offline</Text>
                    )}
            </View>
            </View>
            </View>
        </View>


        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
            {renderMessageItems()}
        </ScrollView>

        <View style={styles.inputContainer}>
            <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            style={[styles.input, { fontFamily: 'Arial', fontSize: 16 }]}
            
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  closeButton: {
    right: 20,
    top: 10,
  },
  backButton: {
    marginRight: 20,
    marginTop: 40,
    marginLeft: 20,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    top: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    right: 25,
    marginTop: 15,
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
    // paddingTop: 0,
  },
  messageContent: {
    fontSize: 16,
    maxWidth: '80%',
  },
  headerContainer: {
    height: 110,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    marginTop: 12,
    marginLeft: 10,
    fontWeight: '700',
    color: 'white',
    fontSize: 18,
  }
});

export default ChatUser;
