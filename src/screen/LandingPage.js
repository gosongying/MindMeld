import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TextInput, Pressable } from 'react-native';

const LandingPage = () => {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>MindMeld</Text>
          <Text style={styles.welcome}>Welcome!</Text>
        </View>
        <View style={styles.center}>
          {/* Add your interactive navigator component here */}
          <Text style={styles.navigator}>Interactive Navigator</Text>
        </View>
        <View style={styles.bottom}>
          <Pressable style={styles.pressableOne} onPress={() => console.log('Login pressed')}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable style={styles.pressableTwo} onPress={() => console.log('Register pressed')}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
          <Text style={styles.guest}>Continue as a guest</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    welcome: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navigator: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottom: {
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    pressableOne: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#710EF1',
      marginBottom: 16,
      borderRadius: 20,
      borderColor: 'white',
    },
    pressableTwo: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#8fbc8f',
      marginBottom: 16,
      borderRadius: 20,
      borderColor: 'white',
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    guest: {
      textAlign: 'center',
      color: '#1e90ff',
    },
  });

export default LandingPage