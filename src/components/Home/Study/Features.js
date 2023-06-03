import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Features = ( {navigation} ) => {
  const handleFeaturePress = (feature) => {
    navigation.navigate(feature)
  };

  const renderFeature = (name, icon) => (
    <TouchableOpacity
      style={styles.featureContainer}
      onPress={() => handleFeaturePress(name)}
    >
      <Ionicons name={icon} style={styles.icon} />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../../assets/study.jpg')}
      style={styles.container} 
    >
      <Text style={styles.title}>Study Features</Text>
      <View style={styles.featuresContainer}>
        <View style={styles.row}>
          {renderFeature('Calculator', 'calculator-outline')}
          {renderFeature('Tasks', 'list-outline')}
        </View>
        <View style={styles.row}>
          {renderFeature('Clock', 'timer-outline')}
          {renderFeature('Notecards', 'copy-outline')}
        </View>
        <View style={styles.row}>
          {renderFeature('Notes', 'document-outline')}
          {renderFeature('Dictionary', 'book-outline')}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width: 335,
    marginLeft: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  featuresContainer: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  icon: {
    fontSize: 30,
    color: 'gray',
    marginRight: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Features;
