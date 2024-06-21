import { Stack, Link } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, TouchableHighlight} from 'react-native';

export default function App() {
  return (

    <View style={styles.layout}>
      <View style={styles.profileBar}>
        <Text>Welcome $user</Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Link href='./explore' asChild >
          <TouchableHighlight 
            style={styles.bigCircle}
            underlayColor = '#ccc'>
            <Text style={{fontSize: 46, color: "white", }}> New Bill </Text>
          </TouchableHighlight>
        </Link>
      </View>
        <View><Text style={styles.dummyText}>Contact 1</Text></View>
        <View><Text style={styles.dummyText}>Contact 2</Text></View>
        <View><Text style={styles.dummyText}>Contact 3</Text></View>
        <View><Text style={styles.dummyText}>Contact 4</Text></View>
        <Button title='Tap reeeeee!'/>
      
    </View>
    
  
  );
}


const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contact: {
    flex: 1,
    backgroundColor: 'blue'
  },
  bigCircle: {
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * 0.5,
      height: Dimensions.get('window').width * 0.5,
      backgroundColor:'purple',
      borderColor: 'black',
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'green',
  },
  profileBar: {
    margin: 50,
    padding: 16,
    borderWidth: 4,
    backgroundColor: 'pink',
  }
});
