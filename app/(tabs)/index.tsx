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
import { useRouter, useFocusEffect } from 'expo-router';
import { User } from '../../classes/user';
import { getUUID, getGID, storeGID } from "@/services/accountService";

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
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const uuid = await getUUID();
          if (uuid) {
            console.log(`UUID found: ${uuid}`);
            setIsLoggedIn(true);
          } else {
            console.log('UUID not found.');
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
      setIsFabOpen(false);
    }, [])
  );

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        console.log('logged in');
      } else {
        console.log('not in');
        router.replace('login');
      }
    }
  }, [isLoading, isLoggedIn]);

  const retrieveGroups = async () => {
    try {
      const uuid = await getUUID();
      if (uuid) {
        const user = new User(uuid);
        const data = await user.getGroupDetailsBasedOnUserID();
        if (data) {
          console.log('Groups found', data);
          setGroups(data as Group[]); // Cast the data to Group[]
        } else {
          console.log('No Groups found');
        }
      }
    } catch (e) {
      console.error('Failed to load groups', e);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };

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

  //Storing Group ID for selected group

  return (
    <TouchableWithoutFeedback onPress={closeFabMenu}>
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
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <TouchableOpacity
                key={group.group.group_id} // Adding key prop
                style={styles.chatItem}
                onPress={async () => { await storeGID(group.group.group_id); router.push('group'); }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {group.group.group_name ? group.group.group_name.charAt(0) : 'G'}
                  </Text>
                </View>
                <Text style={styles.chatText}>{group.group.group_name || 'Unnamed Group'}</Text>
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
