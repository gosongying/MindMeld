import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';

const SignUpPage2 = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interests, setInterests] = useState([]);
  const [username] = useState('Your Name'); // Hardcoded username from previous screen
  const [confirmUsername, setConfirmUsername] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleConfirmDetails = () => {
    // Perform any necessary actions to confirm details (e.g., API calls, data validation)

    // Navigate to the next screen
    navigation.navigate('Home');
  };

  const handleToggleConfirmUsername = () => {
    setConfirmUsername(!confirmUsername);
  };

  const handleToggleInterest = (selectedInterest) => {
    if (interests.includes(selectedInterest)) {
      setInterests(interests.filter((interest) => interest !== selectedInterest));
    } else {
      setInterests([...interests, selectedInterest]);
    }
  };

  const handleToggleAgreeTerms = () => {
    setAgreeTerms(!agreeTerms);
  };

  const renderInterestItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.toggleButton, interests.includes(item) && styles.toggleButtonSelected]}
      onPress={() => handleToggleInterest(item)}
    >
      <Text style={styles.toggleButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create your account</Text>

      <View style={styles.formRow}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.label}>Study of Interest:</Text>
        <View style={styles.toggleButtonContainer}>
          <FlatList
            data={[
              'Sciences',
              'Business and Management',
              'Humanities',
              'Engineering',
              'Social Sciences',
              'Health and Medical',
              'Arts and Fine Arts',
              'Technology',
              'Environmental and Sustainability Studies',
              'Education',
              'Law and Legal Studies',
              'Language',
              'Math and Statistics',
            ]}
            renderItem={renderInterestItem}
            keyExtractor={(item) => item}
            extraData={interests}
            numColumns={2} // Display interests in two columns
          />
        </View>
      </View>

      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationTitle}>Confirmation</Text>

        <Text style={styles.usernameText}>
          Username: <Text style={styles.boldText}>{username}</Text>
        </Text>

        <TouchableOpacity style={styles.toggleContainer} onPress={handleToggleConfirmUsername}>
          <View style={[styles.checkbox, confirmUsername && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>Confirm username</Text>
        </TouchableOpacity>

        {confirmUsername && (
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.toggleContainer} onPress={handleToggleAgreeTerms}>
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>Agree to Terms and Conditions</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, (!confirmUsername || !agreeTerms) && styles.nextButtonDisabled]}
        onPress={handleConfirmDetails}
        disabled={!confirmUsername || !agreeTerms}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flex: 0.5,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginLeft: 10,
  },
  checkboxChecked: {
    backgroundColor: 'gray',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usernameText: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#710ef1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  toggleButton: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  toggleButtonText: {
    fontSize: 16,
  },
  toggleButtonSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker overlay
  },
});

export default SignUpPage2;
