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
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { onValue, ref, runTransaction } from 'firebase/database';
import { database, auth } from '../../../../../firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ToDoList = ({ navigation, session }) => {
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
    const unsubscribe = onValue(ref(database, 'sessions/' + session.id), (snapshot) => {
        if (snapshot.val()) {
            const toDoList = snapshot.val().tasks? snapshot.val().tasks: [];
            setTasks(toDoList);
        }
    });
    return () => {
        unsubscribe();
    }
  }, [])
  

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
      setTaskTime('');
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

  const removeTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);
      runTransaction(ref(database, 'sessions/' + session.id), (session) => {
        if (session) {
            session.tasks = updatedTasks;
            return session;
        } else {
            return session;
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("An error occurs when deleting tasks");
      });
      return updatedTasks;
    });
  };
  
  const handleConfirm = () => {
    const newTaskTime = taskTime ? taskTime : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setTasks((prevTasks) => [...prevTasks, { title: newTask, checked: false, time: newTaskTime }]);
    runTransaction(ref(database, 'sessions/' + session.id), (session) => {
        if (session) {
            if (session.tasks) {
                //if there is existing tasks
                session.tasks.push({ title: newTask, checked: false, time: newTaskTime });
            } else {
                //if there is no existing tasks in the session
                session.tasks = [{ title: newTask, checked: false, time: newTaskTime }];
            }
            return session;
        } else {
            return session;
        }
    })
    .then(() => {
        setNewTask('');
        setTaskTime('');
        setShowModal(false);
        Keyboard.dismiss();
    })
    .catch((error) => {
        console.log(error);
        Alert.alert("An error occurs when adding new tasks");
    })
  };

  const handleCancel = () => {
    const newTaskTime = taskTime ? taskTime : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setNewTask('');
    setTaskTime('');
    setShowModal(false);
    Keyboard.dismiss();
  };

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
        setShowMessage(false) 
    }, 2000);
  };

  const minimumDate = new Date(new Date().getTime() + 60000); 

  const confirmReset = () => {
    setShowModal2(true)
  };

  const confirmDelete = () => {
    runTransaction(ref(database, 'sessions/' + session.id), (session) => {
        if (session) {
            if (session.tasks) {
                session.tasks = null;
                return;
            }
        } else {
            return session;
        }
    })
    .then(() => {
        setTasks([]);
        setShowModal2(false);
    })
    .catch((error) => {
        console.log(error);
        Alert.alert("An error occurs when deleting all tasks");
    })
  }
  const cancelDelete = () => {
    setShowModal2(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <View style={styles.arrow}>
            <MaterialIcons name='arrow-left' size={30} />
            <Text>Chat Room</Text>
        </View>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.closeButton} onPress={confirmReset}>
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
              >
                <TouchableOpacity style={styles.checkbox} onPress={() => toggleTask(index)}>
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
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
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
               <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
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
    paddingVertical: 20,
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    right: 30,
    top: 10
  },
  arrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 10
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

export default ToDoList;
