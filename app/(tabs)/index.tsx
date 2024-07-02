import { Stack, Link } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import styles from '../../assets/styles';
import  {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Lobster-Regular': require('../../assets/fonts/Lobster-Regular.ttf'),
  });

  const [isFabOpen, setIsFabOpen] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };

  return (
    
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileBar}>
        <Text style={styles.profileText}>SplitLah!</Text>
      </LinearGradient>
      <View style={styles.searchFabContainer}>
        <TouchableOpacity style={styles.fab} onPress={toggleFab}>
          <Image source={require('../../assets/images/plus.png')} style={styles.fabIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>
      <ScrollView style={styles.chatList}>
        {['Sample Group 1', 'Sample Group 2', 'Sample Group 3', 'Sample Group 4', 'Sample Group 5'].map((group, index) => (
          <TouchableOpacity key={index} style={styles.chatItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{group.charAt(0)}</Text>
            </View>
            <Text style={styles.chatText}>{group}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isFabOpen && (
        <View style={styles.fabMenu}>
          <Link href='newgroup' asChild>
            <TouchableOpacity style={styles.fabMenuItem}>
              <LinearGradient colors={['rgba(128,0,128,0.7)', 'rgba(0,0,255,0.7)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabMenuItemBackground}>
                <Text style={styles.fabMenuText}>New Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
          <Link href='bill' asChild>
            <TouchableOpacity style={styles.fabMenuItem}>
              <LinearGradient colors={['rgba(236,180,10,0.7)', 'rgba(244,67,54,0.7)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabMenuItemBackground}>
                <Text style={styles.fabMenuText}>Join Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
}

