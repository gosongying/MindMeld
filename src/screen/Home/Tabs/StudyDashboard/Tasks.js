import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const Tasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [taskTime, setTaskTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date());
    }, 1000);

    return () => {
      clearInterval(interval); 
    };
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.log('Error loading tasks:', error);
      }
    };
  
    loadTasks();
  }, []);
  
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.log('Error saving tasks:', error);
      }
    };
  
    saveTasks();
  }, [tasks]);
  

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);

    const formattedTime = `${date.getDate()}/${date.getMonth() + 1} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setTaskTime(formattedTime);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setShowModal(true);
      setTaskTime(`${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      //setTaskTime('');
      Keyboard.dismiss(); 
    }
  };

  const toggleTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index].checked = !updatedTasks[index].checked;
      return updatedTasks;
    });
  };  

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
        setShowMessage(false) 
    }, 2000);
  };

  const removeTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);
      return updatedTasks;
    });
  };
  
  const handleConfirm = () => {
    const newTaskTime = taskTime ? taskTime : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setTasks((prevTasks) => [...prevTasks, { title: newTask, checked: false, time: newTaskTime }]);
    setNewTask('');
    setTaskTime('');
    setShowModal(false);
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    const newTaskTime = taskTime ? taskTime : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setNewTask('');
    setTaskTime('');
    setShowModal(false);
    Keyboard.dismiss();
  }

  const minimumDate = new Date(new Date().getTime() + 60000); 

  const goToHome = () => navigation.goBack();
  const confirmReset = () => {
    setShowModal2(true)
    
  }
  const confirmDelete = () => {
    setTasks([]);
    setShowModal2(false)
  }
  const cancelDelete = () => {
    setShowModal2(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.closeButton} onPress={confirmReset} testID='reset'>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showMessage && (
        <View style={styles.message}> 
            <Text style={styles.messageText}>Hold to remove</Text>
        </View>
      )}
        <View style={styles.taskContainer}>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.taskItem}
                onPress={handleShowMessage}
                onLongPress={() => removeTask(index)}
                testID={`${index}`}
              >
                <TouchableOpacity style={styles.checkbox} onPress={() => toggleTask(index)} testID={`check${index}`}>
                  {item.checked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskText, item.checked && styles.checkedText]}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskTime}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            )}            
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.taskList}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setNewTask}
            value={newTask}
            placeholder="Enter a new task"
            placeholderTextColor="#777777"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask} testID='add'>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Task Due:</Text>
              <View style={styles.modalInput}>
                <TouchableOpacity onPress={showDatepicker}>
                  <Text style={styles.datePickerText}>
                     {taskTime ? taskTime : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} 
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="datetime"
                  onConfirm={handleDateConfirm}
                  onCancel={() => setShowDatePicker(false)}
                  minimumDate={minimumDate}
                  textColor="#000000"
                />
              </View>
              <View style={styles.buttonContainer}>
               <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                 <Text style={styles.buttonText}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} testID='confirm'>
                  <Text style={styles.buttonText}>Confirm</Text>
               </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showModal2}
          animationType="fade"
          transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
               <View style={styles.labelContainer}>
                <AntDesign name="exclamationcircle" style={styles.warningIcon} />
                <Text style={styles.label}>Confirm to delete all tasks</Text>
               </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmDelete}>
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
  backButton: {
    marginRight: 10,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
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
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  taskContainer: {
    flex: 1,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  taskList: {
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#777777',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#777777',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    fontSize: 18,
    color: '#007bff',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  taskTime: {
    fontSize: 16,
    color: '#333333',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#777777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#777777',
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  datePickerText: {
    textAlign: 'center'
  },
  message: {
    position: 'absolute',
    width: 120,
    height: 30,
    backgroundColor: 'rgba(0,80,200, 0.5)',
    top: 110,
    left: 130,
    zIndex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems:'center'
  },
  messageText: {
    fontSize: 16,
    color: 'white'
  },
});

export default Tasks;
