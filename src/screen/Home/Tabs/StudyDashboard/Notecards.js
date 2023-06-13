import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Notecards = ({ navigation }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isFrontVisible, setIsFrontVisible] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setshowModal] = useState(false);

  const goToHome = () => navigation.navigate('StudyDashboard');

  const flipCard = () => {
    setIsFrontVisible(!isFrontVisible);
  };

  const createCard = () => {
    if (frontText && backText) {
      const newCard = {
        id: Date.now().toString(),
        front: frontText,
        back: backText,
      };
      setFlashcards([...flashcards, newCard]);
      setFrontText('');
      setBackText('');
      setIsModalVisible(false);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setFlashcards([]);
    setshowModal(false);
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
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={flipCard}>
        <View style={[styles.card, isFrontVisible ? styles.frontCard : styles.backCard]}>
          <Text style={styles.cardText}>{isFrontVisible ? card.front : card.back}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyCard = () => {
    return <Text style={styles.emptyText}>No flashcards yet</Text>;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notecards</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setshowModal(true)}>
            <AntDesign name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.createCardButton} onPress={() => setIsModalVisible(true)}>
            <AntDesign name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {flashcards.length > 0 ? renderCard() : renderEmptyCard()}

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navigationButton, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
          disabled={currentIndex === 0}
          onPress={handlePreviousCard}
        >
          <AntDesign name="caretleft" size={24} color={currentIndex === 0 ? '#ccc' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navigationButton, { opacity: currentIndex === flashcards.length - 1 ? 0.5 : 1 }]}
          disabled={currentIndex === flashcards.length - 1}
          onPress={handleNextCard}
        >
          <AntDesign name="caretright" size={24} color={currentIndex === flashcards.length - 1 ? '#ccc' : '#333'} />
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
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Back Text"
                  placeholderTextColor="#999999"
                  value={backText}
                  onChangeText={setBackText}
                  multiline={true}
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
        visible={showModal}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.labelContainer}>
              <AntDesign name="exclamationcircle" style={styles.warningIcon} />
              <Text style={styles.label}>Confirm to delete all notecards</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setshowModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={reset}>
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
    width: 300,
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
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -300, // Adjust the value as needed
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
  warningIcon: {
    marginRight: 10,
    fontSize: 24,
    color: '#FF0000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },  
});

export default Notecards;
