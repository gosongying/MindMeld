import React from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';

import Features from '../../../components/Home/Study/Features';
import StudyMode from '../../../components/Home/Study/StudyMode';
import StudyWhat from '../../../components/Home/Study/StudyWhat';
import HelloName from '../../../components/Home/Study/HelloName';

const StudyDashboard = () => {
  const DATA = [
    {
      id: '1',
      title: 'studyWhat',
      component: StudyWhat,
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

  const renderOption = ({ item }) => (
    <View style={styles.optionContainer}>
      <item.component />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HelloName />
      <FlatList
        data={DATA}
        renderItem={renderOption}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContentContainer}
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default StudyDashboard;
