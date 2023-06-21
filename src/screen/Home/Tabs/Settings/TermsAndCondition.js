import React from 'react';
import { TouchableOpacity, StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TermsAndCondition = ({ navigation }) => {
  const goToHome = () => navigation.navigate('Settings');

  const usageAgreement = `By using this app, you agree to abide by these terms and conditions. If you do not agree, please refrain from using the app.`;

  const appPurpose = `This app is provided for educational purposes only. It is not intended for commercial use.`;

  const userResponsibilities = `- Users must use the app in compliance with all applicable laws and regulations.
- Users are responsible for maintaining the confidentiality of their account information.
- Users must not engage in any unauthorized activities or misuse the app.`;

  const limitationOfLiability = `- The app and its developers shall not be held liable for any damages or losses incurred while using the app.
- The app is provided "as is" without any warranties or guarantees.`;

  const intellectualProperty = `- All intellectual property rights related to the app belong to the developers.
- Users are prohibited from copying, modifying, or distributing the app without prior consent.`;

  const termination = `- The developers reserve the right to terminate or suspend access to the app at any time.`;

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Ionicons name='document-text' size={30} style={styles.icon} color="white" />
      </View>
      <ScrollView>
        <Text style={styles.updated}>Updated June 2023</Text>
        <Text style={styles.acknowledgement}>
          Please read these terms and conditions carefully. By using the app, you acknowledge and agree to these terms.
        </Text>
        <Text style={styles.sectionTitle}>1. Usage Agreement</Text>
        <Text style={styles.terms}>{usageAgreement}</Text>
        <Text style={styles.sectionTitle}>2. App Purpose</Text>
        <Text style={styles.terms}>{appPurpose}</Text>
        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.terms}>{userResponsibilities}</Text>
        <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
        <Text style={styles.terms}>{limitationOfLiability}</Text>
        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.terms}>{intellectualProperty}</Text>
        <Text style={styles.sectionTitle}>6. Termination</Text>
        <Text style={styles.terms}>{termination}{'\n'}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  button: {
    marginLeft: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 15,
  },
  updated: {
    color: '#88888888',
    margin: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  terms: {
    fontSize: 14,
    lineHeight: 24,
    marginHorizontal: 20,
  },
  acknowledgement: {
    fontSize: 14,
    lineHeight: 24,
    marginHorizontal: 20,
    marginVertical: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50,
    marginBottom: 20
  },
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'white'
  },
});

export default TermsAndCondition;
