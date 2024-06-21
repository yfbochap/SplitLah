import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function FirstTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabText}>First Tab Content</Text>
    </View>
  );
}

function SecondTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabText}>Second Tab Content</Text>
    </View>
  );
}

export default function GroupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>#Group-Name-Here</Text>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { fontSize: 16, color: 'white' },
          tabBarStyle: { backgroundColor: 'purple' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
          tabBarLabel: ({ focused }) => {
            let label;
            if (route.name === 'FirstTab') {
              label = 'First';
            } else if (route.name === 'SecondTab') {
              label = 'Second';
            }
            return <Text style={{ color: focused ? 'white' : 'gray' }}>{label}</Text>;
          },
        })}
      >
        <Tab.Screen name="FirstTab" component={FirstTab} />
        <Tab.Screen name="SecondTab" component={SecondTab} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'purple',
    alignItems: 'center',
    padding: 8,
    marginTop: 50,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 20,
    color: 'white',
  },
});
