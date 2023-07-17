import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  Modal,
  TextInput,
  Keyboard,
  Switch
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Notecards = ({ navigation }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isFrontVisible, setIsFrontVisible] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false)
  const [shuffleToggle, setShuffleToggle] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);

  useEffect(() => {
    const loadNoteCards = async () => {
      try {
        const savedNoteCards = await AsyncStorage.getItem('notecards');
        if (savedNoteCards) {
          setFlashcards(JSON.parse(savedNoteCards));
        }
      } catch (error) {
        console.log('Error loading flashcards:', error);
      }
    };
  
    loadNoteCards();
  }, []);
  
  useEffect(() => {
    const saveNoteCards = async () => {
      try {
        await AsyncStorage.setItem('notecards', JSON.stringify(flashcards));
      } catch (error) {
        console.log('Error saving flashcards:', error);
      }
    };
  
    saveNoteCards();
  }, [flashcards]);
  

  const goToHome = () => navigation.goBack();

  const flipCard = () => {
    setIsFrontVisible(!isFrontVisible);
  };

  const flipToFront = () => {
    setIsFrontVisible(true);
  }

  const createCard = () => {
    if (frontText && backText) {
      const newCard = {
        id: Date.now().toString(),
        front: frontText,
        back: backText,
      };
      const updatedFlashcards = [...flashcards, newCard];
      const updatedIndex = updatedFlashcards.length - 1; // Set index to the last card
  
      flipToFront();
      setFlashcards(updatedFlashcards);
      setCurrentIndex(updatedIndex);
      setFrontText('');
      setBackText('');
      setIsModalVisible(false);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      flipToFront();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      flipToFront();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    flipToFront();
    setFlashcards([]);
  };

  const cancelCreate = () => {
    setIsModalVisible(false);
    setFrontText('');
    setBackText('');
    Keyboard.dismiss();
  };

  const confirmCreate = () => {
    createCard();
    Keyboard.dismiss();
  };

  const renderCard = () => {
    const card = flashcards[currentIndex];
  
    const handleDelete = () => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards.splice(currentIndex, 1);
    
      let updatedIndex = currentIndex;
    
      if (updatedIndex === updatedFlashcards.length) {
        // If the deleted flashcard was the last one
        updatedIndex--;
      }
    
      if (updatedFlashcards.length === 0) {
        // If there are no more flashcards
        updatedIndex = 0;
      }
    
      flipToFront();
      setFlashcards(updatedFlashcards);
      setCurrentIndex(updatedIndex);
    };
    
    
  
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={flipCard}>
        <View style={[styles.card, isFrontVisible ? styles.frontCard : styles.backCard]}>
          <Text style={styles.cardText}>{isFrontVisible ? card.front : card.back}</Text>
          {isFrontVisible ? null : (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} testID={`${currentIndex}`}>
              <Ionicons name="close-outline" size={36} color="#FF0000"/>
            </TouchableOpacity>
          ) }
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderEmptyCard = () => {
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={flipCard}>
        <View style={[styles.card, isFrontVisible ? styles.frontCard : styles.backCard]}>
          <Text style={styles.cardText}>No notecards yet</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  const goToFirst = () => {
    flipToFront();
    setCurrentIndex(0);
  }

  // Randomly jumps to another index
  const jumpIndex = () => {
    if (flashcards.length > 0) {
      const randomIndex = Math.floor(Math.random() * flashcards.length);
      flipToFront();
      setCurrentIndex(randomIndex);
    }
  };

  // Using Fisher-Yates algorithm to shuffle entire card array
  const shuffleCards = () => {
    const shuffledFlashcards = [...flashcards];
    for (let i = shuffledFlashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledFlashcards[i], shuffledFlashcards[j]] = [shuffledFlashcards[j], shuffledFlashcards[i]];
    }
    setFlashcards(shuffledFlashcards);
    flipToFront();
    setCurrentIndex(0); // Reset the current index to the first card
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notecards</Text>
          <TouchableOpacity style={styles.createCardButton} onPress={() => setIsModalVisible(true)} testID='add'>
            <AntDesign name="plus" size={24} color="#fff" />
          </TouchableOpacity>
      </View>

      <View style={{marginBottom: 170}}/>

      {flashcards.length > 0 ? renderCard() : renderEmptyCard()}

      <View style={styles.navigationContainer}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.navigationButton} onPress={goToFirst} >
            <Ionicons name="refresh" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 4}}  onPress={jumpIndex}>
            <Ionicons name="shuffle-outline" size={28} color="#333"/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginRight: 30}}>
        <TouchableOpacity
          style={[styles.navigationButton, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
          disabled={currentIndex === 0}
          onPress={handlePreviousCard}
        >
          <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? '#ccc' : '#333'} />
        </TouchableOpacity>

        <Text style={styles.indexText}>{flashcards.length === 0 ? '0 / 0' : `${currentIndex + 1} / ${flashcards.length}`}</Text>

        <TouchableOpacity
          style={[styles.navigationButton, { opacity: currentIndex === Math.max(flashcards.length - 1, 0) ? 0.5 : 1 }]}
          disabled={currentIndex === flashcards.length - 1}
          onPress={handleNextCard}
        >
          <Ionicons name="arrow-forward" size={24} color={currentIndex === Math.max(flashcards.length - 1, 0) ? '#ccc' : '#333'} />
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navigationButton} onPress={() => setShowSettingModal(true)} testID='setting'>
          <Ionicons name="settings-outline" size={24} color="#333"/>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainerCard}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Card</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Front Text"
                  placeholderTextColor="#999999"
                  value={frontText}
                  onChangeText={setFrontText}
                  multiline={true}
                  maxHeight={140}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Back Text"
                  placeholderTextColor="#999999"
                  value={backText}
                  onChangeText={setBackText}
                  multiline={true}
                  maxHeight={140}
                />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelCreate}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmCreate}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSettingModal}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.toggleContainer}>
               <Text style={styles.modalTitle2}>Options</Text>
            </View>
            <View style={styles.toggleContainer}>
              <Text style={styles.label1}>Shuffle your notecards</Text>
              <Switch
                value={shuffleToggle}
                onValueChange={(value) => setShuffleToggle(value)}
                style={styles.toggleSwitch}
              />
            </View>

            <View style={styles.toggleContainer}>
              <Text style={styles.label2}>Delete all notecards</Text>
              <Switch
                value={deleteToggle}
                onValueChange={(value) => setDeleteToggle(value)}
                style={styles.toggleSwitch}
                testID='reset'
              />
            </View>
                        
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShuffleToggle(false)
                  setDeleteToggle(false)
                  setShowSettingModal(false)}}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  if (shuffleToggle) {
                    shuffleCards();
                  }
                  if (deleteToggle) {
                    reset();
                  }
                  setShuffleToggle(false)
                  setDeleteToggle(false)
                  setShowSettingModal(false);
                }}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    width: 340,
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
  },
  
  frontCard: {
    backgroundColor: '#8A2BE2',
  },
  backCard: {
    backgroundColor: '#333',
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navigationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  createCardButton: {
    marginLeft: 10,
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
  indexText: {
    fontSize: 18,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 40,
    
  },
  modalContainerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -300, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  modalInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#777777',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginRight: 6,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    borderRadius: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  label1: {
    fontSize: 16,
    color: '#000000',
    marginRight: 38,
  },
  label2: {
    fontSize: 16,
    color: '#FF0000',
    marginRight: 58,
  },  
  modalTitle2: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleSwitch: {
    marginRight: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Notecards;
