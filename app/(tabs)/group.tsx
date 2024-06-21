import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker, { DateTimePickerEvent, Event } from '@react-native-community/datetimepicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function FirstTab() {
  return (
    <View style={{...styles.container}}>
      <Text>First Tab Content</Text>
      <View>
        <Text style={styles.descText}>Title</Text>
        <TextInput style={styles.inputText}></TextInput>

        <Text style={styles.descText}>Paid By</Text>
        <TextInput style={styles.inputText}></TextInput>
      </View>
    </View>
  );
}

function SecondTab() {
  return (
    <View style={styles.container}>
      <Text>Second Tab Content</Text>
    </View>
  );
}

export default function group() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', borderWidth: 2}}>
          <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
          <Text style={styles.headerText}>#Group-Name-Here</Text>
        </View>
        <View>   
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
          })}>
            <Tab.Screen name="FirstTab" component={FirstTab} options={{ tabBarLabel: 'Bills' }} />
            <Tab.Screen name="SecondTab" component={SecondTab} options={{ tabBarLabel: 'Balances' }} />
          </Tab.Navigator>
        </View>
      </View>
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
    flexDirection: 'column',
    alignItems: 'center', //THE LINE THAT CAUSES WEIRD ISSUES?
    padding: 8,
    marginBottom: 12,
    marginTop: 50,
  },
  headerText: {
    // textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginLeft: 8,
  },
  descText: {
    color: 'grey',
    fontSize: 16,
    padding: 8,
    marginHorizontal: 24,
  },
  inputText: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 20,
    marginHorizontal: 24,
    borderBottomColor: 'purple',
    borderWidth: 2,
    marginBottom: 8,
  },
});
