import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Dimensions, Keyboard, Alert, Modal, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {auth, database} from '../../../../firebase';
import {increment, onValue, ref, runTransaction, push, update, remove} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';


const useUsername = (uid) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const userIdRef = ref(database, `userId/${uid}/username`);

    const handleSnapshot = (snapshot) => {
      const username = snapshot.val();
      setUsername(username);
    };

    const unsubscribe = onValue(userIdRef, handleSnapshot);
    //userIdRef.on('value', handleSnapshot);

    return () => {
      // Cleanup the event listener when the component unmounts
      //userIdRef.off('value', handleSnapshot);
      unsubscribe();
    };
  }, [uid]);

  return username;
};

const PostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [editCommentModal, setEditCommentModal] = useState(false)
  const [editedComment, setEditedComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPostTitle, setEditedPostTitle] = useState('');
  const [editedPostContent, setEditedPostContent] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [postTitle, setPostTitle] = useState(post.title)
  const [postContent, setPostContent] = useState(post.content)
  const [postIsClosed, setPostIsClosed] = useState(post.isClosed)

  const username = useUsername(post.userId);

  const editPost = () => {
    const postRef = ref(database, `posts/${currentPostId}`);
    update(postRef, {
      title: editedPostTitle,
      content: editedPostContent,
    });
  
    setEditModalVisible(false);
    setEditedPostTitle('');
    setEditedPostContent('');
    setCurrentPostId(null);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditedPostTitle('');
    setEditedPostContent('');
  };

  useEffect(() => {
    // Check if the post exists
    const postRef = ref(database, `posts/${post.id}`);
    const unsubscribe = onValue(postRef, (snapshot) => {
      const postData = snapshot.val();
      if(!postData) {
        Alert.alert('Post Deleted', 'The post you are viewing has been deleted.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    })

    /*const postListener = postRef.on('value', (snapshot) => {
      const postData = snapshot.val();
      if (!postData) {
        Alert.alert('Post Deleted', 'The post you are viewing has been deleted.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    });*/
  
    return () => {
      // Cleanup event listener when the component unmounts
      //postRef.off('value', postListener);
      unsubscribe();
    };
  }, [navigation, post.id]);
  ;

  useEffect(() => {
    // Check the user authentication status
    const authListener = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(user);
    });
  
    // Fetch the comments for the post from the database
    const postCommentsRef = ref(database, `posts/${post.id}/comments`);
    // Remove the previous listener before adding a new one
    //postCommentsRef.off('value');

    const commentsListener = onValue(postCommentsRef, (snapshot) => {
      const data = snapshot.val();
      if(data) {
        const commentArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setComments(commentArray);
      } else {
        setComments([]);
      }
    });

    /*const commentsListener = postCommentsRef.on('value', (snapshot) => {
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
    });*/
  
    // Listen for changes to the comments count specifically
    const commentsCountRef = ref(database, `posts/${post.id}/commentsCount`);
    const commentsCountListener = onValue(commentsCountRef, (snapshot) => {
      const commentsCount = snapshot.val();
      setCommentsCount(commentsCount);
    })

    /*const commentsCountListener = commentsCountRef.on('value', (snapshot) => {
      const commentsCount = snapshot.val();
      setCommentsCount(commentsCount);
    });*/
  
    // Listen for changes to the title, content, and isClosed properties of the post
    const postRef = ref(database, `posts/${post.id}`);
    const postListener = onValue(postRef, (snapshot) => {
      const postData = snapshot.val();
      if (
        postData &&
        (postTitle !== postData.title ||
          postContent !== postData.content ||
          postIsClosed !== postData.isClosed)
      ) {
        setPostTitle(postData.title);
        setPostContent(postData.content);
        setPostIsClosed(postData.isClosed);
        Alert.alert('Post Updated', 'The post has been modified.');
      }
    })

    /*const postListener = postRef.on('value', (snapshot) => {
      const postData = snapshot.val();
      if (
        postData &&
        (postTitle !== postData.title ||
          postContent !== postData.content ||
          postIsClosed !== postData.isClosed)
      ) {
        setPostTitle(postData.title);
        setPostContent(postData.content);
        setPostIsClosed(postData.isClosed);
        Alert.alert('Post Updated', 'The post has been modified.');
      }
    });*/
  
    return () => {
      authListener(); // Remove the auth listener
      //postCommentsRef.off('value', commentsListener); // Remove the comments listener
      //commentsCountRef.off('value', commentsCountListener); // Remove the comments count listener
      //postRef.off('value', postListener); // Remove the post listener
      commentsListener();
      commentsCountListener();
      postListener();
    };
  }, [post.id]);

  

  const CommentItem = ({ item }) => {
    console.log(item);
    console.log(auth.currentUser);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
      const userIdRef = ref(database, `userId/${item.uid}/username`);
    
      const handleSnapshot = (snapshot) => {
        const commentUsername = snapshot.val();
        const displayName = commentUsername || 'Unknown User';
        setDisplayName(displayName);
      };
    
      const unsubscribe = onValue(userIdRef, handleSnapshot);
      //userIdRef.on('value', handleSnapshot);
    
      return () => {
        //userIdRef.off('value', handleSnapshot);
        unsubscribe();
      };
    }, [item.uid]);
    
  
    const isCurrentUser = item.uid === auth.currentUser?.uid;

    const deleteComment = (postId) => {
      if (post.isClosed) {
        Alert.alert('Error', 'You cannot delete comments on a closed post');
        return;
      }
  
      const commentRef = ref(database, `posts/${post.id}/comments/${item.id}`);
      remove(commentRef);
      const postRef = ref(database, `posts/${postId}`);
      runTransaction(postRef, (post) => {
        if (post) {
          post.commentsCount = (post.commentsCount || 0) - 1;
        }
        return post;
      })

      /*ostRef.transaction((post) => {
        if (post) {
          post.commentsCount = (post.commentsCount || 0) - 1;
        }
        return post;
      });*/
    };
    return (
      <View
        style={[
          styles.commentContainer,
          isCurrentUser ? styles.currentUserComment : styles.otherUserComment,
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.username}>{displayName}</Text>

            {auth.currentUser?.uid === item?.uid && (
              <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: -2 }}>
                <TouchableOpacity
                  style={{ marginRight: 3 }}
                  onPress={() => {
                    if (post.isClosed) {
                      Alert.alert('Error', 'You cannot edit comments on a closed post.');
                    } else {
                      setSelectedItem(item);
                      setEditCommentModal(true);
                    }
                  }}
                >
                  <Ionicons name="pencil" size={18} color="#8A2BE2" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 3 }}
                  onPress={() => deleteComment(post.id)}
                  testID={`${item.id}`}
                >
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
    const uid = auth.currentUser.uid;
    const postCommentsRef = ref(database, `posts/${postId}/comments`);
    const postRef = ref(database, `posts/${postId}`);
    

    const userRef = ref(database, 'userId/' + uid);

    // Create the comment data object
    const commentData = {
      comment,
      uid,
      timestamp: new Date().getTime()
    };

    push(postCommentsRef, commentData);

    update(postRef, {
      commentsCount: increment(1)//firebase.database.ServerValue.increment(1),
    })

    // Adds 1 XP to the user
    update(userRef, {
      xp: increment(1)//firebase.database.ServerValue.increment(1),
    });

    // Adds 1 to number of Comments
    update(userRef, {
      numberOfComments: increment(1)//firebase.database.ServerValue.increment(1),
    });

    scrollToBottom();
    setCommentText('');
    Keyboard.dismiss();
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

const editComment = (newText) => {
  const commentRef = ref(database, `posts/${post.id}/comments/${selectedItem.id}`);
  console.log(commentRef);
  update(commentRef, { comment: newText });

  setEditedComment('');
  setEditCommentModal(false);
};

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
              <View>
                <Text style={styles.title}>{postTitle}</Text>
              </View>
            </View>


        <Text style={styles.content}>{postContent}</Text>

        
        <View style={styles.postFooter}>
          <Text style={{ color: postIsClosed  ? 'red' : 'green' }}>{postIsClosed ? 'Closed' : 'Open'}</Text>

          <View style={styles.commentsCount}>
            <Ionicons name="chatbubble-outline" size={20} color="#888" />
            <Text style={styles.commentsCountText}>{commentsCount}</Text>
          </View>

          <View>
            <DynamicTimeText timestamp={post.timestamp} />
          </View>
        </View>
        <Text style={{ marginTop: 25 }}>
          Posted by: {username}
        </Text>
      </View>
        
      <View style={{ 
          padding: 15, 
          borderRadius: 10, }}>
          <FlatList
          ref={flatListRef} 
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CommentItem item={item} />}
          contentContainerStyle={styles.commentsContainer}
          scrollEnabled={false} // Disable scrolling of the FlatList
        />
      </View>
    </ScrollView>   
        
    <View style={styles.footerContainer}>
      {postIsClosed ? (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={[styles.commentInput, { backgroundColor: '#E0E0E0', textAlign: 'center' }]}
            placeholder="Post is closed"
            placeholderTextColor="#888"
            editable={false}
          />
        </View>
      ) : (
        <View style={styles.commentInputContainer}>
          {auth.currentUser && auth.currentUser.isAnonymous ? (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={[styles.commentInput, { backgroundColor: '#E0E0E0',  textAlign: 'center' }]}
                placeholder="Guests cannot comment"
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
              // Use optional chaining and nullish coalescing operator for null check
              defaultValue={selectedItem?.comment ?? ''} 
              onChangeText={setEditedComment}
              autoFocus={true}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss(); // Dismiss the keyboard
                  setEditedComment('')
                  setEditCommentModal(false);
                }}
                style={[styles.cancelButton]} 
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginRight: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});

export default PostScreen;