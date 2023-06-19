import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Dimensions, Keyboard} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const PostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Fetch the comments for the post from the database
    const postRef = database.ref(`posts/${post.id}/comments`);
    postRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setComments(commentArray);
      } else {
        setComments([]);
      }
    });

    return () => {
      postRef.off();
    };
  }, []);

  useEffect(() => {
    // Listen for changes to the commentsCount property
    const postRef = database.ref(`posts/${post.id}`);
    postRef.child('commentsCount').on('value', (snapshot) => {
      const count = snapshot.val();
      post.commentsCount = count || 0;
    });

    return () => {
      postRef.child('commentsCount').off();
    };
  }, []);

  const renderComment = ({ item }) => {
    const isCurrentUser = item.author === firebase.auth().currentUser.displayName;
  
    return (
      <View
        style={[
          styles.commentContainer,
          isCurrentUser ? styles.currentUserComment : styles.otherUserComment,
        ]}
      >
        <View style={{    
          flexDirection: 'row',
          justifyContent: 'space-between',}}>
          <Text style={styles.username}>{item.author}</Text>
          <DynamicTimeText timestamp={item.timestamp} />
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    );
  };
  
  const goBack = () => {
    navigation.goBack();
  };

  const addComment = (postId, comment) => {
    const user = firebase.auth().currentUser;
    const username = user ? user.displayName : 'Unknown User';

    // Create the comment data object
    const commentData = {
      author: username,
      comment,
      timestamp: new Date().getTime()
    };

    // Save the comment to the database
    const postCommentsRef = database.ref(`posts/${postId}/comments`);
    postCommentsRef.push(commentData);

    // Increment the comments count for the post
    const postRef = database.ref(`posts/${postId}`);
    postRef.transaction((post) => {
      if (post) {
        post.commentsCount = (post.commentsCount || 0) + 1;
      }
      return post;
    });
    setCommentText('');
  };

  const DynamicTimeText = ({ timestamp }) => {
    const [timeText, setTimeText] = useState('');
  
    useEffect(() => {
      const calculateTimeSinceCreation = () => {
        const currentTime = new Date().getTime();
        const timeDiffInMinutes = Math.floor((currentTime - timestamp) / (1000 * 60));
  
        if (timeDiffInMinutes < 1) {
          setTimeText('<1 minute ago');
        } else if (timeDiffInMinutes < 60) {
          setTimeText(`${timeDiffInMinutes} minute${timeDiffInMinutes !== 1 ? 's' : ''} ago`);
        } else {
          const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
  
          if (timeDiffInHours < 24) {
            setTimeText(`${timeDiffInHours} hour${timeDiffInHours !== 1 ? 's' : ''} ago`);
          } else {
            const timeDiffInDays = Math.floor(timeDiffInHours / 24);
  
            if (timeDiffInDays < 30) {
              setTimeText(`${timeDiffInDays} day${timeDiffInDays !== 1 ? 's' : ''} ago`);
            } else {
              const timeDiffInMonths = Math.floor(timeDiffInDays / 30);
  
              if (timeDiffInMonths < 12) {
                setTimeText(`${timeDiffInMonths} month${timeDiffInMonths !== 1 ? 's' : ''} ago`);
              } else {
                const timeDiffInYears = Math.floor(timeDiffInMonths / 12);
                setTimeText(`${timeDiffInYears} year${timeDiffInYears !== 1 ? 's' : ''} ago`);
              }
            }
          }
        }
      };
  
      calculateTimeSinceCreation();
  
      const interval = setInterval(calculateTimeSinceCreation, 60000); // Update every minute
  
      return () => clearInterval(interval);
    }, [timestamp]);
  
    return <Text style={styles.timeSinceCreation}>{timeText}</Text>;
  };

  const screenWidth = Dimensions.get('window').width;

  const flatListRef = useRef(null); 

  // Scroll the FlatList to the bottom
  const scrollToBottom = () => {
    if (flatListRef.current && comments.length > 0) {
      flatListRef.current.scrollToIndex({ index: comments.length - 1, animated: true });
    }
  };
  useEffect(() => {
    // Add event listeners to detect keyboard events
    Keyboard.addListener('keyboardDidShow', scrollToBottom);
    Keyboard.addListener('keyboardDidHide', scrollToBottom);

    // Clean up the event listeners
    return () => {
      Keyboard.removeListener('keyboardDidShow', scrollToBottom);
      Keyboard.removeListener('keyboardDidHide', scrollToBottom);
    };
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={350}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.feedText}>Feed</Text>
      </View>

      <View style={{ 
          padding: 10, 
          borderWidth: 1,
          marginHorizontal: 10,
          borderRadius: 10, }}>
           <View style={{ flexDirection: 'row' }}>
              <View style={{ maxWidth: screenWidth * 0.7 }}>
                <Text style={styles.title}>{post.title}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginTop: 10, }}>
                <Text>{post.author}</Text>
              </View>
            </View>

        <Text style={styles.content}>{post.content}</Text>


        <View style={styles.postFooter}>
          <View style={styles.postMetrics}>
            {/* <TouchableOpacity
              onPress={() => likePost(post.id)}
              style={styles.likeButton}
              disabled={post.isDisliked}
            > */}
            <View style={styles.likeButton}>
               <Ionicons name="arrow-up" size={24} color={post.isLiked ? 'green' : '#888'} />
            </View>
              
            {/* </TouchableOpacity> */}
            <Text style={styles.aggregateScore}>{post.aggregateScore}</Text>
            {/* <TouchableOpacity
              onPress={() => dislikePost(post.id)}
              style={styles.dislikeButton}
              disabled={post.isLiked}
            > */}
            <View style={styles.dislikeButton}>
              <Ionicons name="arrow-down" size={24} color={post.isDisliked ? 'red' : '#888'} />
            </View>

            {/* </TouchableOpacity> */}
          </View>

          <View style={styles.commentsCount}>
            <Ionicons name="chatbubble-outline" size={20} color="#888" />
            <Text style={styles.commentsCountText}>{post.commentsCount}</Text>
          </View>

          <View>
            <DynamicTimeText timestamp={post.timestamp} />
          </View>
        </View>

          <FlatList
          ref={flatListRef} 
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          contentContainerStyle={styles.commentsContainer}
        />

          
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => addComment(post.id, commentText)}
              disabled={!commentText}
            >
              <Text style={styles.postButton}>Post</Text>
           </TouchableOpacity>
         </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  back: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  feedText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconText: {
    marginLeft: 5,
    color: '#888',
  },
  timeSinceCreation: {
    marginLeft: 'auto',
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  postMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeButton: {
    marginRight: 5,
  },
  dislikeButton: {
    marginRight: 10,
  },
  aggregateScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  commentsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
  },
  commentsCountText: {
    marginLeft: 5,
    color: '#888',
  },
  timeSinceCreation: {
    color: '#888',
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  currentUserComment: {
    backgroundColor: '#DDECFE',
  },
  otherUserComment: {
    backgroundColor: '#E5E5EA',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  comment: {
    fontSize: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  commentButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostScreen;
