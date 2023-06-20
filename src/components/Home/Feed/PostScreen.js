import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Dimensions, Keyboard, Alert, Modal, ScrollView} from 'react-native';
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

const database = firebase.database()

const PostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(post.open);
  const [editCommentModal, setEditCommentModal] = useState(false)
  const [editedComment, setEditedComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const [currentPostId, setCurrentPostId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPostTitle, setEditedPostTitle] = useState('');
  const [editedPostContent, setEditedPostContent] = useState('');

  const editPost = () => {
    const postRef = database.ref(`posts/${currentPostId}`);
    postRef.update({
      title: editedPostTitle,
      content: editedPostContent,
    });
  
    setEditModalVisible(false);
    setEditedPostTitle('');
    setEditedPostContent('');
    setCurrentPostId(null);
  };

  const openEditModal = (post) => {
    setCurrentPostId(post.id);
    setEditedPostTitle(post.title);
    setEditedPostContent(post.content);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditedPostTitle('');
    setEditedPostContent('');
  };



  useEffect(() => {
    // Check the user authentication status
    const authListener = firebase.auth().onAuthStateChanged((user) => {
      setUserAuthenticated(!!user);
    });
  
    // Fetch the comments for the post from the database
    const postCommentsRef = database.ref(`posts/${post.id}/comments`);
    const commentsListener = postCommentsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setComments(commentArray);
      } else {
        setComments([]);
      }
    });
  
    return () => {
      authListener(); // Remove the auth listener
      postCommentsRef.off('value', commentsListener); // Remove the comments listener
    };
  }, [post.id]);
  
  useEffect(() => {
    const postRef = database.ref(`posts/${post.id}`);
    
    // Fetch the initial value of commentsCount
    postRef.child('commentsCount').once('value', (snapshot) => {
      const count = snapshot.val();
      post.commentsCount = count || 0;
    });
  
    // Store the initial value of commentsCount
    let previousCount = post.commentsCount;
  
    // Listen for changes to the commentsCount property
    const commentsCountListener = postRef.child('commentsCount').on('value', (snapshot) => {
      const count = snapshot.val() || 0;
  
      if (count > previousCount) {
        // Handle the increase in commentsCount here
        // For example, you can update the UI or perform any necessary actions
      } else if (count < previousCount) {
        // Handle the decrease in commentsCount here
        // For example, you can update the UI or perform any necessary actions
      }
  
      post.commentsCount = count;
      previousCount = count;
    });
  
    return () => {
      postRef.child('commentsCount').off('value', commentsCountListener); // Remove the commentsCount listener
    };
  }, [post.id]);


  const renderComment = ({ item }) => {
    const isCurrentUser = item.author === firebase.auth().currentUser.displayName;
  
    const deleteComment = (postId) => {

      if (post.isClosed) {
        Alert.alert('Error', 'You cannot delete comments on a closed post');
        return;
      }
      
      const commentRef = database.ref(`posts/${post.id}/comments/${item.id}`);
      commentRef.remove();
      const postRef = database.ref(`posts/${postId}`);
      postRef.transaction((post) => {
        if (post) {
          post.commentsCount = (post.commentsCount || 0) - 1;
        }
        return post;
      });

      // Alert is too slow

      // if (post.isClosed) {
      //   Alert.alert('Error', 'You cannot delete comments on a closed post.');
      //   return;
      // }
  
      // Alert.alert('Confirmation', 'Are you sure you want to delete this comment?', [
      //   { text: 'Cancel', style: 'cancel' },
      //   {
      //     text: 'Delete',
      //     style: 'destructive',
      //     onPress: () => {
      //       // Delete the comment from the database

  
      //       // Decrement the comments count for the post

      //     },
      //   },
      // ]);
    };



    const editComment = (newText) => {
      const commentRef = database.ref(`posts/${post.id}/comments/${selectedItem.id}`);
      console.log(commentRef);
      commentRef.update({ comment: newText });
    
      setEditedComment('');
      setEditCommentModal(false);
    };
  
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

        <Modal visible={editCommentModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={{ marginTop: 50 }}>
              <Text style={{ color: '#888888' }}>Editing your comment to </Text>
              <Text style={{ fontWeight: 'bold' }}>{post.title}</Text>
            </Text>
            <TextInput
              style={[styles.modalInput, { borderWidth: 0, borderColor: 'transparent' }]}
              multiline
              placeholder="Edit your comment"
              onChangeText={setEditedComment}
              autoFocus={true}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss(); // Dismiss the keyboard
                  setEditedComment('')
                  setEditCommentModal(false);
                }}
                style={[styles.modalButton]} 
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss(); // Dismiss the keyboard
                  editComment(editedComment);
                }}
                style={[styles.modalButton, { backgroundColor: editedComment === '' ? '#CCCCCC' : '#8A2BE2' }]} // Update the background color when disabled
                disabled={editedComment === ''}
              >
                <Text style={[styles.modalButtonText, { color: editedComment === '' ? '#888888' : 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.username}>{item.author}</Text>
              {isCurrentUser && (
              <View style={{flexDirection: 'row', marginLeft: 10, marginTop: -2}}>

              <TouchableOpacity style={{ marginRight: 3 }} 
              onPress={() => {
                  if (post.isClosed) {
                    Alert.alert('Error', 'You cannot edit comments on a closed post.');
                  } else {
                    setSelectedItem(item);
                    setEditCommentModal(true);
                  }
                }}>
                <Ionicons name="pencil" size={18} color="#8A2BE2" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 3}} onPress={() => deleteComment(post.id)}>
                <Ionicons name="trash" size={18} color="red" />
              </TouchableOpacity>
               </View>
              )}
           </View>

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
    const username = user ? user.displayName : 'Anonymous User';

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

    scrollToBottom();
    setCommentText('');
    Keyboard.dismiss();
  };

  const closePost = (postId) => {
    Alert.alert(
      'Confirmation',
      'The post cannot be opened again after closed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            const postRef = database.ref(`posts/${postId}`);
            postRef.update({
              isClosed: true,
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  
    
  const openPost = () => {
    Alert.alert(
      'Post Closed',
      'Closed post cannot be opened.',
    );
  };

  const deletePost = () => {
    Alert.alert('Confirmation', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Delete the post from the database
          const postRef = database.ref(`posts/${post.id}`);
          postRef.remove();
  
          // Navigate back to the previous screen
          navigation.goBack();
        },
      },
    ]);
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
  
      const interval = setInterval(calculateTimeSinceCreation, 1000); // Update every second
  
      return () => clearInterval(interval);
    }, [timestamp]);
  
    return <Text style={styles.timeSinceCreation}>{timeText}</Text>;
  };

  const screenWidth = Dimensions.get('window').width;

  const flatListRef = useRef(null); 

// Scroll the ScrollView and FlatList to the bottom
const scrollToBottom = () => {
  if (scrollViewRef.current && comments.length > 0) {
    scrollViewRef.current.scrollToEnd({ animated: true });

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: comments.length - 1, animated: true });
    }
  }
};

const scrollViewRef = useRef(null);

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.feedText}>Feed</Text>
      </View>
      
      <ScrollView ref={scrollViewRef}>
      <View style={{ 
          padding: 15, 
          borderWidth: 1,
          marginHorizontal: 10,
          borderRadius: 10,
          marginBottom: -10 }}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ maxWidth: screenWidth * 0.65 }}>
                <Text style={styles.title}>{post.title}</Text>
              </View>

              <View style={{ 
                 flex: 1,
                 alignItems: 'flex-end',
                 marginTop: -8,
                 marginBottom: 10}}>
                
                <View style={{marginTop: -3}}>
                {/* Lock, Edit and Delete Pressables */}
                {userAuthenticated && post.author === firebase.auth().currentUser?.displayName && (
                <View style={styles.postButtons}>

                  {/* Keep in view */}
                    {/* {post.isClosed ? (
                    <TouchableOpacity
                        style={styles.openButton}
                        onPress={() => openPost(post.id)}
                    >
                        <Ionicons name="lock-closed-outline" size={24} color="red" />
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => closePost(post.id)}
                    >
                        <Ionicons name="lock-open-outline" size={24} color="green" />
                    </TouchableOpacity>
                    )}

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        if (post.isClosed) {
                        Alert.alert("Error", "You cannot edit a closed post.");
                        } else {
                        openEditModal(post);
                        }
                    }}
                    >
                    <Ionicons name="pencil" size={24} color="#8A2BE2" />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePost(post.id)}
                    >
                    <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity> */}
                </View>
                )}
                <Text style={{marginRight: -10, marginTop: 8}}>Posted by: {post.author}</Text>
                </View>
              </View>
            </View>


        <Text style={styles.content}>{post.content}</Text>

        
        <View style={styles.postFooter}>
          <Text>{post.isClosed ? 'Closed' : 'Open'}</Text>

          <View style={styles.commentsCount}>
            <Ionicons name="chatbubble-outline" size={20} color="#888" />
            <Text style={styles.commentsCountText}>{post.commentsCount}</Text>
          </View>

          <View>
            <DynamicTimeText timestamp={post.timestamp} />
          </View>
        </View>
      </View>
        
      <View style={{ 
          padding: 15, 
          borderRadius: 10, }}>
          <FlatList
          ref={flatListRef} 
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          contentContainerStyle={styles.commentsContainer}
          scrollEnabled={false} // Disable scrolling of the FlatList
        />
      </View>
    </ScrollView>

        
        
       <View style={styles.footerContainer}>
       {post.isClosed ? (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={[styles.commentInput, { backgroundColor: '#E0E0E0' }]}
              placeholder="Post is closed"
              placeholderTextColor="#888"
              editable={false}
            />
          </View>
        ) : (
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
              <Text style={styles.postButton}>Comment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={editModalVisible && currentPostId !== null} animationType="fade">
        <View style={styles.modalContainer2}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
            <TouchableOpacity onPress={closeEditModal}>
              <Ionicons name='close-outline' size={32} color='#000000' />
            </TouchableOpacity>
            <TouchableOpacity onPress={editPost} disabled={editedPostTitle.trim().length === 0}>
              <Text style={[styles.createButtonText, { opacity: editedPostTitle.trim().length === 0 ? 0.3 : 1 }]}>Edit Post</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={editedPostTitle}
            onChangeText={setEditedPostTitle}
            placeholder="Title"
            placeholderTextColor="#888888"
            style={[styles.input1, {maxWidth: '100%'}]}
          />
          <TextInput
            value={editedPostContent.trimEnd()}
            onChangeText={setEditedPostContent}
            placeholder="Body text (optional)"
            placeholderTextColor="#888888"
            style={[styles.input2, styles.contentInput]}
            multiline
            textAlignVertical="top"
          />
        </View>
      </Modal>
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
    fontSize: 15,
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
    fontSize: 14, 
  },
  comment: {
    fontSize: 14,
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
  postButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 5,
    marginRight: 5,
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  modalContainer2: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  modalInput: {
    height: '40%',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 25,
    fontSize: 24,
    fontWeight: 'bold'
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  contentInput: {
    height: 300,
    textAlignVertical: 'top',
  },
  footerContainer: {
    paddingHorizontal: 10,
  },
});

export default PostScreen;