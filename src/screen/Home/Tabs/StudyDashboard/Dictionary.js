import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import axios from 'axios';

const Dictionary = ({ navigation }) => {
  const goToHome = () => navigation.navigate('StudyDashboard');

  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');

  const handleSearch = async () => {
    try {
      const apiKey = '08ac014c-67c5-4237-841d-0ee87e8cb982';
      const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`;

      const response = await axios.get(apiUrl);
      const data = response.data;

      // Extract the first definition from the response
      if (Array.isArray(data) && data.length > 0) {
        const firstEntry = data[0];
        if (firstEntry.hasOwnProperty('shortdef')) {
          const firstDefinition = firstEntry.shortdef[0];
          setDefinition(firstDefinition);
        } else {
          setDefinition('No definition found.');
        }
      } else {
        setDefinition('No definition found.');
      }
    } catch (error) {
      console.log(error);
      setDefinition('An error occurred. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setWord}
          value={word}
          placeholder="Enter a word"
          placeholderTextColor="#777777"
        />
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      <View style={styles.definitionContainer}>
        <View style={styles.definitionBox}>
          <Text style={styles.definition}>{definition}</Text>
        </View>
      </View>

      <View style={styles.attributionContainer}>
        <Text style={styles.attributionText}>
          Powered by Merriam-Webster
        </Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    color: '#333333',
  },
  searchButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    alignSelf: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  definitionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  definitionBox: {
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 100,
  },
  definition: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  attributionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  attributionText: {
    fontSize: 14,
    color: '#777777',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default Dictionary;
