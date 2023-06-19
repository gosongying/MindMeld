import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Keyboard, Dimensions } from 'react-native';
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

const Feeds = ( {navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); 

  // Function to toggle the sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'newest' ? 'oldest' : 'newest'));
  };

  const sortPosts = (filteredPosts) => {
    if (sortOrder === 'newest') {
      return filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      return filteredPosts.sort((a, b) => a.timestamp - b.timestamp);
    }
  };
  
  const filterPosts = () => {
    if (searchText.trim().length === 0) {
      return posts;
    }
  
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredPosts;
  };


  const clearSearch = () => {
    setSearchText('')
    Keyboard.dismiss()
  };

  const titleInputRef = useRef(null);

  const navigateToFeed = (post) => {
    // const timeSinceCreation = calculateTimeSinceCreation(timestamp);
  
    // Navigate to the PostScreen with the selected post and timeSinceCreation
    navigation.navigate('PostScreen', { post });
  };
  
  const createNewPost = () => {
    const user = firebase.auth().currentUser;
    const username = user ? user.displayName : 'Unknown User';

    // Create the post data object
    const postData = {
      title: newPostTitle,
      author: username,
      content: newPostContent,
      timestamp: new Date().getTime(),
      aggregateScore: 0, 
      commentsCount: 0, 
      comments: []
    };
  
    // Save the post data to the Realtime Database
    const newPostRef = database.ref(`posts`).push(postData);
    const postId = newPostRef.key;
    newPostRef.set(postData)
  
      // Close the modal and reset the input values
      setShowModal(false);
      setNewPostTitle('');
      setNewPostContent('');
  };

  
  useEffect(() => {
    // Fetch the posts from the database on component mount
    database.ref('posts').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setPosts(postArray);
      } else {
        setPosts([]);
      }
    });

    if (showModal) {
      titleInputRef.current.focus();
    }
  }, [showModal]);


  useEffect(() => {
    if (showModal) {
      // Focus on the title input field when the modal is shown
      titleInputRef.current.focus();
    }
  }, [showModal]);

  const limitTextToFourLines = (text) => {
    const lines = text.split('\n');
    return lines.slice(0, 4).join('\n');
  };

  const likePost = (postId) => {
    const postRef = database.ref(`posts/${postId}`);


    postRef.transaction((post) => {
      if (post) {
        if (post.isLiked) {
          post.likes -= 1;
          post.isLiked = false;
        }
        else if (!post.likes) {
          post.likes = 1;
          post.isLiked = true;
        } else {
          post.likes += 1;
          post.isLiked = true;
        }
        post.aggregateScore = (post.likes || 0) - (post.dislikes || 0);
      }
      
      return post;
    });
  };
  
  const dislikePost = (postId) => {
    const postRef = database.ref(`posts/${postId}`);
  
    postRef.transaction((post) => {
      if (post) {
        if (post.isDisliked) {
          post.dislikes -= 1
          post.isDisliked = false;
        }
        else if (!post.dislikes) {
          post.dislikes = 1;
          post.isDisliked = true;
        } else {
          post.dislikes += 1;
          post.isDisliked = true;
        }
        post.aggregateScore = (post.likes || 0) - (post.dislikes || 0);
      }
      
      return post;
    });
  };
  
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search Title"
          placeholderTextColor="#888888"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.closeButton} onPress={clearSearch}>
          <Ionicons name="close-outline" size={36} color="#8A2BE2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.newFeedButton}>
          <Ionicons name="add" size={36} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {sortPosts(filterPosts()).map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.forumItem}
            onPress={() => navigateToFeed(post)} // Pass the selected post to the navigateToFeed function
          >

            <View style={{ flexDirection: 'row' }}>
              <View style={{ maxWidth: screenWidth * 0.7 }}>
                <Text style={styles.forumTitle}>{post.title}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginBottom: 10, }}>
                <Text>{post.author}</Text>
              </View>
            </View>

            <Text numberOfLines={4} style={styles.forumContent}>{limitTextToFourLines(post.content)}</Text>

            <View style={styles.postFooter}>
              <View style={styles.postMetrics}>
                <View style={styles.itemContainer}>   
                  <TouchableOpacity
                    onPress={() => likePost(post.id)}
                    style={styles.likeButton}
                    disabled={post.isDisliked}
                  >
                    <Ionicons name="arrow-up" size={24} color={post.isLiked ? 'green' : '#888'} />
                  </TouchableOpacity>
                   <Text style={styles.aggregateScore}>{post.aggregateScore}</Text>
                  <TouchableOpacity
                    onPress={() => dislikePost(post.id)}
                    style={styles.dislikeButton}
                    disabled={post.isLiked}
                  >
                    <Ionicons name="arrow-down" size={24} color={post.isDisliked ? 'red' : "#888"} />
                  </TouchableOpacity>
                </View>
              
              <View style={{marginLeft: 85}}> 
                <View style={styles.commentsCount}>
                  <Ionicons name="chatbubble-outline" size={20} color="#888" />
                  <Text style={styles.commentsCountText}>{post.commentsCount}</Text>
                </View>
                </View>
              </View>
             <View>
                <View style={styles.timeSinceCreation}>
                 <DynamicTimeText timestamp={post.timestamp} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15}}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name='close-outline' size={32} color ='#000000'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={createNewPost}  disabled={newPostTitle.trim().length === 0}>
              <Text style={[styles.createButtonText, { opacity: newPostTitle.trim().length === 0 ? 0.3 : 1 }]}>Create Feed</Text>
            </TouchableOpacity>
          </View>


          <TextInput
            ref={titleInputRef}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder="Title"
            placeholderTextColor="#888888"
            style={styles.input1}
          />
          <TextInput
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder="body text (optional)"
            placeholderTextColor="#888888"
            style={[styles.input2, styles.contentInput]}
            multiline
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 5,
    marginTop: 20,
    marginBottom: 5,
  },
  closeButton: {},
  newFeedButton: {},
  closeButton: {
  },
  newFeedButton: {
  },
  itemContainer: {
    flexDirection: 'row',
  },
  forumItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  forumTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: -5
  },
  forumContent: {
    fontSize: 15,
    color: '#888',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 8,

  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
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
    height: 600,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginLeft: -5,
  },
  aggregateScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 3,
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    width: 260
  },
});

export default Feeds;
