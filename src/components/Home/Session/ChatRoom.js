import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Modal, Alert, AppState } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth, database } from "../../../../firebase";
import { runTransaction, ref, onValue, get } from 'firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

const ChatRoom = ({ navigation, session }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().getTime());


  const chatId = session.chatId;

  const differenceInMilliseconds = Math.abs(session.endTime.timestamp - currentTimestamp);
  const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
  
  // To scroll to bottom of scrollList 
  const scrollViewRef = useRef(null);

  const currentUser = auth?.currentUser;
  
  // To listen for new messages and update the messages state
  useEffect(() => {
    const messagesRef = ref(database, 'chat/' + chatId);
  
    const unsubscribe = onValue(messagesRef, async (snapshot) => {
      let newMessageList = [];
      if (snapshot.exists()) {
        const messageList = snapshot.exists()? (snapshot.val().messages? snapshot.val().messages: []): [];
        if (messageList) {
        await Promise.all(
            messageList.map(async (message) => {
              //to get username of sender
              const userRef = ref(database, 'userId/' + message.sender);
              await get(userRef)
              .then((snapshot) => {
                const username = snapshot.val().username;
                const newMessage = {
                  ...message, 
                  username: username
                }
                newMessageList.push(newMessage);
              })
              .catch((error) => {
                console.log(error);
                Alert.alert("An error occurs");
              });
              return
            })
        )
        setMessages(newMessageList);
        messageList.map((message) => {
          //to attach listener to user to get their latest profile
          const unsubscribe = onValue(ref(database, 'userId/' + message.sender), (snapshot) => {
            const username = snapshot.val().username;
            const uid = snapshot.val().uid;
            //update the specific user with status update
            const newMessageList2 = newMessageList.map((message) => {
              if (message.sender === uid) {
                message.username = username
                return message;
              } else {
                return message;
              }
            });
            setMessages(newMessageList2);
            return () => {
              unsubscribe();
            }
          })
        });
        return;
      }
      }
      setMessages(newMessageList);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Scroll to the bottom of the ScrollView when messages are available
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    //to update current timestamp periodically
    const interval = setInterval(() => {
      setCurrentTimestamp(new Date().getTime());
    }, 30000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (session.endTime.timestamp <= currentTimestamp) {
      Alert.alert("The session is ended");
      goToHome();
      return;
    } 
    get(ref(database, 'sessions/' + session.id))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        Alert.alert("The session is closed by the host");
        goToHome();
      }
    })
  }, [currentTimestamp]);

  useEffect(() => {
    const handleStateChange = (state) => {
      console.log(state)
      if (state === 'background' || state === 'inactive') {
        goToHome();
      }
    };

    const subscribe = AppState.addEventListener('change', handleStateChange);

    return () => {
      subscribe.remove();
    }
  }, [])
  
  const renderMessageItems = () => {
    return messages.map((item) => {
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
          {!isCurrentUser && <Text style={styles.messageSender}>{item.username}</Text>}
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

  const goToHome = () => {
    //remove session from user ongoing session first
    try {
      runTransaction(ref(database, 'userId/' + currentUser?.uid), (user) => {
        if (user) {
          user.ongoingSessions = null;
          return user;
        } else {
          return user;
        }
      })
      .then(() => {
        navigation.goBack();
      })
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurs during quiting session");
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }
  
    const sender = currentUser?.uid;
  
    const newMessage = {
      sender,
      content: inputMessage.trim(),
      timestamp: new Date().getTime(), // Add the timestamp property
    };
  
    runTransaction(ref(database, 'chat/' + chatId), (chat) => {
      if (chat) {
        if (chat.messages) {
          //if there is messages in the chat room alr
          chat.messages.push(newMessage);
          return chat;
        } else {
          //if there is no messages there before
          chat.messages = [newMessage];
          return chat;
        }
      } else {
        return chat;
      }
    });

    setInputMessage('');
  };

  const os = Platform? (Platform.OS === 'ios'? 'padding': null): null;

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={os}
      >
        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', top: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: -2}}>
              <MaterialIcons name='arrow-left' size={30}/>
              <Text>Participants</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: -2}}>
              <Text>To-do List</Text>
              <MaterialIcons name="arrow-right" size={30} />
            </View>
          </View>
          <View style={styles.header}>
          <TouchableOpacity style={styles.quitButton} onPress={goToHome}>
            <Text style={styles.quit}>Quit</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
          <TouchableOpacity style={styles.closeButton}>
            <AntDesign name="infocirlceo" size={24} color="#fff" onPress={() => setShowModal(true)} />
          </TouchableOpacity>
          </View>
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
            autoCapitalize='none'
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
                Start Time: {session.startTime.string}
              </Text>
              <Text style={styles.label2}>
                End Time: {session.endTime.string}
              </Text>
              <Text style={styles.label2}>
                Time Left: {hours} hours {minutes} mins
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
  closeButton: {
    right: 20,
    top: 8
  },
  quit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
},
  quitButton: {
    backgroundColor: "rgba(255,0,0,0.5)",
    borderRadius: 15,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    top: 10,
    paddingVertical: 5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    top: 15
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
    fontSize: 16
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
  label1: {
    fontSize: 15, 
    marginLeft: 20,
    textAlign: 'center',
    paddingVertical: 2,
    right: 8
  },
  label2: {
    fontSize: 15, 
    marginLeft: 20,
    textAlign: 'center',
    paddingVertical: 2,
    right: 12
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
    maxWidth: "80%"
  },
  headerContainer: {
    height: 130,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center'
  }
});

export default ChatRoom;
