import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Tasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks((prevTasks) => [...prevTasks, { title: newTask, checked: false }]);
      setNewTask('');
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
      return updatedTasks;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Tasks To Do</Text>
        </View>

        <View style={styles.taskContainer}>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.taskItem}
                onPress={() => toggleTask(index)}
                onLongPress={() => removeTask(index)}
              >
                <View style={styles.checkbox}>
                  {item.checked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </View>
                <Text style={[styles.taskText, item.checked && styles.checkedText]}>{item.title}</Text>
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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
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
  taskText: {
    flex: 1,
    fontSize: 18,
    color: '#333333',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#777777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default Tasks;
