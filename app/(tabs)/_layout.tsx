import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { Tab } from '@rneui/themed';

function CustomTabBar() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' 
    ? ['#000428', '#004e92']  // Dark gradient colors
    : ['#00c6ff', '#0072ff']; // Light gradient colors

  return (
    <LinearGradient 
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
    </LinearGradient>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'purple' : 'purple', // Set your desired background color here
          borderTopColor: colorScheme === 'dark' ? '#000' : '#fff',  
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={'turquoise'} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="addbill"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="group"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="newgroup"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="joingroup"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="register"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="bill"
        options={{ href: null, headerShown: false, tabBarStyle:{ display: "none" }}}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'profile',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="profile" size={24} color={'turquoise'}  />
          )}}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});