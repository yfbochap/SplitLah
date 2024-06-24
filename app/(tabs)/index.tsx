import { Stack, Link } from 'expo-router';
import React from 'react';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, TouchableHighlight, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  
  const [fontsLoaded, fontError] = useFonts({
    'Lobster-Regular': require('../../assets/fonts/Lobster-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  

  return (

    <View style={styles.layout}>
      <View style={styles.profileBar}>
        <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.profileText}>SplitLah!</Text>
        </LinearGradient>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 12}}>
        <Link href='newgroup' asChild >
          <TouchableHighlight 
            style={{...styles.midCircle}}
            underlayColor = '#ccc'>
            <LinearGradient style={styles.midCircle} colors={['purple', 'blue']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={{fontSize: 26, color: "white", fontWeight: 'bold'}}> New Group </Text>
            </LinearGradient>
          </TouchableHighlight>
        </Link>
        <Link href='bill' asChild >
          <TouchableHighlight 
            style={{...styles.midCircle}}
            underlayColor = '#ccc'>
            <LinearGradient style={styles.midCircle} colors={['#ecb40a', '#f44336']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={{fontSize: 26, color: "white", fontWeight: 'bold'}}> Join Group </Text>
            </LinearGradient>
          </TouchableHighlight>
        </Link>
      </View>
      <View style={{marginHorizontal: 16, marginTop: 40}}>
        <Text style={{color: 'white', fontSize: 18}}>Recently Joined Groups</Text>
      </View>
      <View style={styles.groupview}>
        <ScrollView>
        <Text style={{...styles.dummyText, marginTop: 24}}>Sample Group 1</Text>
        <Text style={styles.dummyText}>Sample Group 2</Text>
        <Text style={styles.dummyText}>Sample Group 3</Text>
        <Text style={styles.dummyText}>Sample Group 4</Text>
        <Text style={styles.dummyText}>Sample Group 5</Text>
        </ScrollView>
      </View>
      
    </View>
    
  
  );
}


const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'black',
  },
  midCircle: {
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * 0.42,
      height: Dimensions.get('window').width * 0.42,
      borderColor: 'black',
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12
  },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'turquoise',
    color: 'white',
    fontStyle: 'italic'
  },
  groupview: {
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: 'white',
    height: 390,
  },
  profileBar: {
    marginVertical: 50,
    // borderWidth: 4,
    backgroundColor: 'white',
  },
  profileText: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'Lobster-Regular',
    alignContent: 'center',
    textAlign: 'center',
    height: 55,
  }
});

