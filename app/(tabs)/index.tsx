import { Stack, Link } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
    <View style={styles.layout} onLayout={onLayoutRootView}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'black',
  },
  profileBar: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'Lobster-Regular',
    textAlign: 'center',
  },
  searchFabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 35,
    backgroundColor: '#e5e5e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: 'black',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0088cc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginRight: 16,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  fabMenu: {
    position: 'absolute',
    top: 120,
    left: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  fabMenuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  fabMenuItemBackground: {
    borderRadius: 8,
    padding: 10,
  },
  fabMenuText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

