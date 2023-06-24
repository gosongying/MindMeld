import React from 'react';
import { TouchableOpacity, StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const About = ({ navigation }) => {
  const goToHome = () => navigation.goBack();

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.back}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About Us</Text>
        <Ionicons name='information-circle' size={30} style={styles.icon} color={'white'}/>
      </View>
      <ScrollView>
        <Text style={[styles.text, {marginTop: 15}]}>
          <Text style={styles.sectionTitle}>Who we are:</Text>
          {'\n'}We are Janssen Lau and Go Song Ying, year 1 computer science students from the National University of Singapore who are passionate about helping students enjoy the studying process. We noticed that many existing apps were insufficient in achieving what we desired, so we decided to create our own app called MindMeld.
          {'\n\n'}
          <Text style={styles.sectionTitle}>Problem Motivation:</Text>
          {'\n'}As we all know, studying can be a difficult and daunting task for many students, including us. With the ever-increasing number of distractions that surround us, from social media to video games on our mobile phones, it’s no wonder that students often struggle to stay motivated and focused on their studies.
          {'\n\n'}
          <Text style={styles.sectionTitle}>What We Offer:</Text>
          {'\n'}Our app, MindMeld, aims to address this problem by gamifying {'('}WIP{')'} the studying process and providing a platform that eliminates most distractions. We believe that by turning studying into an engaging and enjoyable experience, students can achieve greater academic success. Our app offers features such as remote study sessions with peers, gamification elements {'('}WIP{')'}, and distraction reduction tools {'('}WIP{')'}.
          {'\n\n'}
          <Text style={styles.sectionTitle}>Our Aim:</Text>
          {'\n'}Our aim is not to force students to study, but to provide them with a helpful platform that serves as a tool to aid their studying journey. By offering a range of features, we hope to empower students to take control of their education and achieve their academic goals.
          {'\n'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
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
    marginTop: 5,
    color: 'white'
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

export default About;
