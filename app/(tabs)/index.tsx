import { Stack, Link } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import styles from '../../assets/styles';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useFocusEffect, router } from 'expo-router';
import { User } from '../../classes/user';
import { getUUID, getGID, storeGID } from "@/services/accountService";

// Prevent the splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

interface GroupDetails {
  group_id: string;
  group_name: string;
  description: string;
  no_of_people: number;
  currency: string;
}

interface Group {
  group: GroupDetails;
  group_id: string;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Lobster-Regular': require('../../assets/fonts/Lobster-Regular.ttf'),
  });

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]); // Use the Group interface
  // const router = useRouter();

  // useFocusEffect to handle component focus events
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const uuid = await getUUID();
          if (uuid) {
            // console.log(`UUID found: ${uuid}`);
            setIsLoggedIn(true);
          } else {
            // console.log('UUID not found.');
            router.replace('login');
          }
        } catch (e) {
          console.error('Failed to load UUID.', e);
        } finally {
          setIsLoading(false);
        }
      };

      checkLoginStatus();
      retrieveGroups(); // Call the function here
      setIsFabOpen(false);// Close the FAB menu on focus
    }, [])
  );
 // useEffect to handle side effects when isLoading or isLoggedIn state changes
  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        console.log('logged in');
      } else {
        // console.log('not in');
        router.replace('login');
      }
    }
  }, [isLoading, isLoggedIn]);
  // Function to retrieve groups associated with the user
  const retrieveGroups = async () => {
    try {
      const uuid = await getUUID();
      if (uuid) {
        const user = new User(uuid);
        const data = await user.getGroupDetailsBasedOnUserID();
        if (data) {
          // console.log('Groups found', data);
          setGroups(data as Group[]); // Cast the data to Group[]
        } else {
          console.log('No Groups found');
        }
      }
    } catch (e) {
      console.error('Failed to load groups', e);
    }
  };
  // Hide the splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
   // Function to open the FAB menu
  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };
  // Function close the FAB menu
  const closeFabMenu = () => {
    if (isFabOpen) {
      setIsFabOpen(false);
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const rainbowColors = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#f1c232', // Gold
    '#00baa2', // Turquoise
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#054e13', // Dark Green
    '#9400D3', // Violet
  ];

  //Storing Group ID for selected group
  return (
    <TouchableWithoutFeedback onPress={closeFabMenu}>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        {/* Header */}
        <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileBar}>
          <Text style={styles.profileText}>SplitLah!</Text>
        </LinearGradient>
        <View style={styles.searchFabContainer}>
          <TouchableOpacity style={styles.fab} onPress={toggleFab}>
          {/* Join/create group icon */}
            <Image source={require('../../assets/images/plus.png')} style={styles.fabIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
          />
        </View>
        {/* Displays chat list together with the description and the currency being used in the group */}
        <ScrollView style={styles.chatList}>
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <TouchableOpacity
                key={group.group.group_id} // Adding key prop
                style={styles.chatItem}
                onPress={async () => { await storeGID(group.group.group_id); router.push('group'); }}
              >
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                <View style={[styles.avatar, { backgroundColor: rainbowColors[index % rainbowColors.length] }]}>
                  <Text style={styles.avatarText}>
                    {group.group.group_name ? group.group.group_name.charAt(0) : 'G'}
                  </Text>
                </View>
                <View>
                  <View>
                    <Text style={styles.chatText}>{group.group.group_name || 'Unnamed Group'}</Text>
                  </View>
                  <View>
                    <Text style={styles.chatText2}>{group.group.description || 'Unnamed Group'}</Text>
                  </View>
                </View>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <Text style={{...styles.chatText2, textAlign: 'center'}}>{group.group.currency || 'Unnamed Group'}</Text>
                </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.chatText}>No groups found.</Text>
          )}
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
            <Link href='joingroup' asChild>
              <TouchableOpacity style={styles.fabMenuItem}>
                <LinearGradient colors={['rgba(236,180,10,0.7)', 'rgba(244,67,54,0.7)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabMenuItemBackground}>
                  <Text style={styles.fabMenuText}>Join Group</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
