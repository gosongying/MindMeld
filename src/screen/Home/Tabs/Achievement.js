import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Leaderboard from '../../../components/Home/Achievement/Leaderboard';
import SignupPage2 from '../../Authentication/SignupPage2';
import SignupPage from '../../Authentication/SignupPage';
import LandingPage from '../../Authentication/LandingPage';
import LoginPage from '../../Authentication/LoginPage';

const Achievement = () => {
  return (
    <SafeAreaView style={styles.container}>
        <SignupPage2/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
});

export default Achievement;
