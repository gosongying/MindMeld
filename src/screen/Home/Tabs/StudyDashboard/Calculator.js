import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, SafeAreaView, TextInput, View } from 'react-native';
import axios from 'axios';

const Calculator = ({ navigation }) => {
  const goToHome = () => navigation.navigate('StudyDashboard');

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleCalculation = async () => {
    try {
      const apiKey = 'Y36GEU-TW4VU6G736';
      const apiUrl = `http://api.wolframalpha.com/v1/result?appid=${apiKey}&i=${encodeURIComponent(input)}`;

      const response = await axios.get(apiUrl);
      const result = response.data;

      setResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="Enter your calculation"
          placeholderTextColor="#777777"
          keyboardType='numeric'
          editable={false}
        />

      <Text style={styles.resultValue}>={result}</Text>

      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton onPress={() => setInput(input + '7')} text="7" />
          <CalcButton onPress={() => setInput(input + '8')} text="8" />
          <CalcButton onPress={() => setInput(input + '9')} text="9" />
          <CalcButton onPress={() => setInput(input + '÷')} text="÷" />
        </View>
        <View style={styles.row}>
          <CalcButton onPress={() => setInput(input + '4')} text="4" />
          <CalcButton onPress={() => setInput(input + '5')} text="5" />
          <CalcButton onPress={() => setInput(input + '6')} text="6" />
          <CalcButton onPress={() => setInput(input + '×')} text="×" />
        </View>
        <View style={styles.row}>
          <CalcButton onPress={() => setInput(input + '1')} text="1" />
          <CalcButton onPress={() => setInput(input + '2')} text="2" />
          <CalcButton onPress={() => setInput(input + '3')} text="3" />
          <CalcButton onPress={() => setInput(input + '-')} text="-" />
        </View>
        <View style={styles.row}>
          <CalcButton onPress={() => setInput(input + '0')} text="0" />
          <CalcButton onPress={() => setInput(input + '.')} text="." />
          <CalcButton onPress={() => handleCalculation()} text="=" />
          <CalcButton onPress={() => setInput(input + '+')} text="+" />
        </View>
        <View style={styles.row}>
          <CalcButton onPress={() => setInput(input + '(')} text="(" />
          <CalcButton onPress={() => setInput(input + ')')} text=")" />
          <CalcButton onPress={() => setInput(input + '^')} text="^" />
          <CalcButton onPress={handleBackspace} text="⌫" />
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={goToHome}>
        <Text style={styles.back}>{'\u2190'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const CalcButton = ({ onPress, text }) => (
  <TouchableOpacity style={styles.calcButton} onPress={onPress}>
    <Text style={styles.calcButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'right',
    width: '100%',
    color: '#333333',
  },
  resultValue: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calcButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    marginHorizontal: 10, 
  },
  calcButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
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

export default Calculator;
