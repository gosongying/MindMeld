import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';

import Features from '../../../../components/Home/Study/Features';
import StudyMode from '../../../../components/Home/Study/StudyMode';
import StudyWhat from '../../../../components/Home/Study/StudyWhat';
import HelloName from '../../../../components/Home/Study/HelloName';
import { useNavigation } from '@react-navigation/native';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, database } from "../../../../../firebase"
import { goOffline, update, ref, increment, runTransaction, remove } from 'firebase/database';

const StudyDashboard = () => {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.isAnonymous) {
        setIsGuest(true);
      } else {
        setIsGuest(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigation = useNavigation(); // Access the navigation object

  const DATA = [
    // Item to be shown
    {
      id: '1',
      title: 'studyWhat',
      component: StudyWhat,
      hide: isGuest
    },
    {
      id: '2',
      title: 'studyMode',
      component: StudyMode,
    },
    {
      id: '3',
      title: 'Features',
      component: Features,
    },
  ];

  const renderOption = ({ item }) => {
    if (item.hide) {
      return null;
    }
    return (
      <View style={styles.optionContainer}>
        {/* Pass the navigation prop */}
        {React.createElement(item.component, { navigation })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HelloName />
      <FlatList
        data={DATA}
        renderItem={renderOption}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  optionContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default StudyDashboard;
