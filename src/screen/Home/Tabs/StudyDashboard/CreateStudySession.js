import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Keyboard,
  Alert
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth } from '../../../../../firebase';

const CreateStudySession = ({ navigation }) => {

  const dateOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // This enforces 24-hour format
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  //const [selectedDate, setSelectedDate] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');

  useEffect(() => {
    const currentDate = new Date(); // Get the current date
    currentDate.setMinutes(currentDate.getMinutes() + 1); // Add 1 minute to the current time
  }, []);


  const minimumDate = new Date(new Date().getTime() + 60000);
  const minimumEnd = startTime? new Date(startTime.getTime() + 60000): new Date(minimumDate.getTime() + 60000);

  const goToHome = () => navigation.navigate('StudyDashboard');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (time) => {
    if (endTime) {
      //if end time set already
      if (time.getTime() >= endTime.getTime()) {
        //if end time earlier than start time
        Alert.alert("End time cannot be earlier than start time");
        hideStartTimePicker();
        return;
      }
    }
    setStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };

  const createStudySession = () => {
    if (!sessionName) {
      Alert.alert('Session Name cannot be empty');
      return;
    } else if (!startTime) {
      Alert.alert("Please select start time");
      return;
    } else if (!endTime) {
      Alert.alert("Please select end time");
    } else {
        navigation.navigate('SelectBuddies', {
          sessionName, 
          sessionDescription,
          startTime: {
            string: new Intl.DateTimeFormat([], dateOptions).format(startTime),//startTime.toLocaleTimeString([], { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), 
            timestamp: startTime.getTime()//selectedDate.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds(), startTime.getMilliseconds())
          },
          endTime:  {
            string: new Intl.DateTimeFormat([], dateOptions).format(endTime),//endTime.toLocaleTimeString([], { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            timestamp: endTime.getTime()//selectedDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds(), endTime.getMilliseconds())
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.container} onPress={() => Keyboard.dismiss()}>
      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Create Study Session</Text>
      <Text style={styles.subheading}>Session Name</Text>
      <TextInput 
      style={styles.input1} 
      placeholder="Enter session name"
      autoCapitalize='none'
      autoCorrect={false}
      clearButtonMode='while-editing'
      value={sessionName}
      placeholderTextColor={'gray'}
      onChangeText={(text) => setSessionName(text)}/>

      <View>
        <Text style={styles.subheading}>Session Description</Text>
        <TextInput 
        value={sessionDescription}
        onChangeText={(text) => setSessionDescription(text)}
        style={styles.input2} 
        multiline
        clearButtonMode='while-editing'
        placeholder='Enter description'
        autoCapitalize='none'
        autoCorrect={false}
        placeholderTextColor={'gray'}
        blurOnSubmit
        />
      </View>

      {/* <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Enable Study Mode</Text>
        <TouchableOpacity
          style={[styles.checkbox, studyModeEnabled && styles.checkboxActive]}
          onPress={() => setStudyModeEnabled(!studyModeEnabled)}
        >
          {studyModeEnabled && <Text style={styles.checkmark}>&#x2713;</Text>}
        </TouchableOpacity>
      </View> */}

      {/*<Text style={styles.subheading}>Select Date</Text>
      <TouchableOpacity style={styles.calendarButton} onPress={showDatePicker}>
        <Text style={styles.calendarButtonText}>
          {selectedDate ? selectedDate.toDateString() : 'Select Date'}
        </Text>
    </TouchableOpacity>*/}
      <Text style={styles.subheading}>Select Time</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={styles.startTimeButton} onPress={showStartTimePicker} testID='startTime'>
            <Text style={styles.startTimeButtonText}>
            {startTime ? new Intl.DateTimeFormat([], dateOptions).format(startTime) : 'Select Start Time'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endTimeButton} onPress={showEndTimePicker} testID='endTime'>
            <Text style={styles.endTimeButtonText}>
            {endTime ? new Intl.DateTimeFormat([], dateOptions).format(endTime) : 'Select End Time'}
            </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.createButton} onPress={createStudySession} testID='CreateStudySession'>
        <Text style={styles.createButtonText}>Create Study Session</Text>
      </TouchableOpacity>
      {/*<DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        textColor="#000000"
        minimumDate={minimumDate}
    />*/}
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        date={minimumDate}
        mode='datetime'
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
        textColor="#000000"
        minimumDate={minimumDate}
        maximumDate={endTime}
        testID='startTimePicker'
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        date={minimumEnd}
        mode="datetime"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
        textColor="#000000"
        minimumDate={minimumEnd}
        testID='endTimePicker'
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: 20,
   // paddingTop: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    top: 40
  },
  backButton: {
    position: 'absolute',
    top: -15,
    left: 10,
    zIndex: 1,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    bottom: 5
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sessionTypeButton: {
    backgroundColor: '#DCDCDC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#DC582A',
  },
  input1: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontWeight: 'normal',
  },
  input2: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    marginBottom: 30,
    height: 130,
    width: "100%",
    textAlign: 'left',
    paddingHorizontal: 10,
    fontWeight: 'normal',
  },
  calendarButton: {
    backgroundColor: '#DCDCDC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  startTimeButton: {
    backgroundColor: '#DCDCDC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: 170,
  },
  startTimeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  endTimeButton: {
    backgroundColor: '#DCDCDC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: 170,
  },
  endTimeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#DC582A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: "90%",
    alignSelf: 'center'
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  checkboxLabel2: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    left: 170
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#DC582A',
  },
});

export default CreateStudySession;
