import React from 'react';
import { TouchableOpacity, StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpandSupport = ({ navigation }) => {
  const goToHome = () => navigation.goBack();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <Ionicons name='help-circle' size={30} style={styles.icon} color='white'/>
      </View>
      <ScrollView>
        <Text style={[styles.text, {marginTop: 15}]}>
          Welcome to the Help & Support page! Here you can find useful information and resources to assist you with any questions or issues you may have.
        </Text>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.text}>
          Q: Nunc tempus nunc id fringilla facilisis?
          {'\n'}
          A: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium orci non rhoncus ornare. Morbi a molestie nisi. Nunc sit amet tincidunt odio, venenatis aliquam lacus.
          {'\n'}
          {'\n'}
          Q: Curabitur aliquam magna nisl, eu placerat leo vehicula eget?
          {'\n'}
          A: Integer eleifend libero eget ultrices ullamcorper. Suspendisse ullamcorper odio in tellus eleifend lacinia. Morbi elementum rhoncus lectus non interdum.
          {'\n'}
          {'\n'}
          Q: Morbi eleifend nisi et libero iaculis posuere?
          {'\n'}
          A: Phasellus lacinia ut diam nec tincidunt. Maecenas malesuada tempor gravida. Integer egestas tortor ac neque cursus sagittis. Nunc est massa, rhoncus quis enim at, fringilla blandit nulla.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>
          If you couldn't find the information you were looking for in the FAQ section or need further assistance, feel free to reach out to our support team through the feedback form. 
          {'\n'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  icon: {
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 18,
    marginHorizontal: 20,
  },
});

export default HelpandSupport;
