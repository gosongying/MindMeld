import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, TextInput, StyleSheet, View, TouchableOpacity, Text, Keyboard, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Notes = ({ navigation }) => {
  const [noteText, setNoteText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleNoteChange = (text) => {
    setNoteText(text);
  };

  const clearNotes = () => {
    setShowModal(true)  
  }

  const clearNotesConfirm = () => {
    setShowModal(false)
    setNoteText('')
    Keyboard.dismiss();

  }

  const clearNotesCancel = () => {
    setShowModal(false)
    Keyboard.dismiss();
  }

  const handleDonePress = () => {
    Keyboard.dismiss();
  };

  const goToHome = () => navigation.navigate('StudyDashboard');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Notes</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.closeButton} onPress={clearNotes}>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={handleDonePress}>
          <AntDesign name="check" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TextInput
        style={styles.noteInput}
        multiline
        placeholder="Write your note here"
        value={noteText}
        onChangeText={handleNoteChange}
        returnKeyType="done"
      />
    </ScrollView>
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.labelContainer}>
            <AntDesign name="exclamationcircle" style={styles.warningIcon} />
            <Text style={styles.label}>Confirm to delete all tasks</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={clearNotesCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={clearNotesConfirm}>
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 5,
    borderRadius: 5,
  },
  doneButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  drawingButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#ccc',
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  }, 
});

export default Notes;
