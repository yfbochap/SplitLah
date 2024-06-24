import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

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
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View><HeaderBackButton tintColor='white' onPress={handleBackButtonPress} /></View>
        
        <View style={{flex: 1, alignItems: 'center', maxWidth: 300}}><Text style={styles.headerText}>#Group-Name-Here</Text></View>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { fontSize: 16, color: 'white' },
          tabBarStyle: { backgroundColor: 'purple' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
          tabBarLabel: ({ focused }) => {
            let label, iconName;
            if (route.name === 'FirstTab') {
              label = 'Bills';
            } else if (route.name === 'SecondTab') {
              label = 'Balances';
            }
            return <Text style={{ color: focused ? 'white' : 'gray' }}>{label}</Text>;
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            if (route.name === 'FirstTab') {
              iconName = focused ? 'file-text' : 'file-text-o';
              return <FontAwesome name="anchor" size={20} color="white" />;
            } else if (route.name === 'SecondTab') {
              iconName = focused ? 'balance-scale' : 'balance-scale';
              return <FontAwesome name="balance-scale" size={20} color="white" />;
            }
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
    flexDirection: 'row',
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
    backgroundColor: 'black',
  },
  tabText: {
    fontSize: 20,
    color: 'white',
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
