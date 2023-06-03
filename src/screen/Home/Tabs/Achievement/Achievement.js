import React from 'react';
import { View, StyleSheet } from 'react-native';
import AchievementTab from '../../../../components/Home/Achievement/AchievementTab';
import AchievementHeader from '../../../../components/Home/Achievement/AchievementHeader';


const Achievement = () => {
  return (
    <View style={styles.container}>
        <AchievementHeader/>
        <AchievementTab/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Achievement;
