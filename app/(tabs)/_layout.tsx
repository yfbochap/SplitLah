import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : 'purple', // Set your desired background color here
          borderTopColor: colorScheme === 'dark' ? '#000' : '#fff',  
        }
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
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={'turquoise'} />
          ),
        }}
      />
      <Tabs.Screen
        name="newgroup"
        options={{ href: null, }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});