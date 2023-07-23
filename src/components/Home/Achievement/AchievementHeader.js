import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AchievementHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const xpSystemExplanation = `
  Each feed post earns you 5 XP.
  Each comment earns you 1 XP.
  Each minute spent in a study session earns you 1 XP.
`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <TouchableOpacity onPress={openModal}>
        <AntDesign name="questioncircleo" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>XP System</Text>
            <Text style={[styles.modalContent, styles.alignText]}>
              Study Session: 1 XP / min{'\n'}
              Feed post: 5 XP{'\n'}
              Feed comment: 1 XP
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginLeft: 25,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  alignText: {
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AchievementHeader;
