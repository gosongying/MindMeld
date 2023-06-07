import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  ScrollView,
  Keyboard
} from 'react-native';
import axios from 'axios';

const Dictionary = ({ navigation }) => {
  const goToHome = () => navigation.navigate('StudyDashboard');

  const [word, setWord] = useState('');
  const [definitions, setDefinitions] = useState([]);

  const handleSearch = async () => {
    try {
      const apiKey = '08ac014c-67c5-4237-841d-0ee87e8cb982';
      const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`;

      const response = await axios.get(apiUrl);
      const data = response.data;
      Keyboard.dismiss(); 

      if (Array.isArray(data) && data.length > 0) {
        const wordDefinitions = data.map(entry => {
          if (entry.hasOwnProperty('shortdef')) {
            return entry.shortdef[0];
          } else {
            return 'No definition found.';
          }
        });
        setDefinitions(wordDefinitions);
      } else {
        setDefinitions(['No definition found.']);
      }
    } catch (error) {
      console.log(error);
      setDefinitions(['An error occurred. Please try again later.']);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Dictionary</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setWord}
          value={word}
          placeholder="Enter a word"
          placeholderTextColor="#777777"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.definitionContainer}>
          {definitions.map((definition, index) => (
            <View key={index} style={styles.definitionBox}>
              <Text style={styles.definition}>{definition}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.attributionContainer}>
        <Text style={styles.attributionText}>
          Powered by Merriam-Webster
        </Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 0,
    marginLeft: 10,
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 60,
    marginBottom: -30,
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 35,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%',
    color: '#333333',
    backgroundColor: '#f0f0f0',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  searchButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  definitionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  definitionBox: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 20,
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
});

export default Dictionary;
