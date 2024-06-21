import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableHighlight, Pressable, Linking,} from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {Link} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';

export default function login() {
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>            
                    <Text style={styles.headertext}>Login</Text>
                </LinearGradient>
            </View>
            <View style={{alignItems: 'center'}}>
                <FontAwesome name="user" size={150} color="white"/>
            </View>
            <View style={styles.body}>
                <TextInput placeholder='Email' placeholderTextColor={'grey'} style={{...styles.inputText}}></TextInput>
                <TextInput placeholder='Password' placeholderTextColor={'grey'} style={{...styles.inputText}} secureTextEntry={true}></TextInput>
                <Link href='newgroup' asChild >
                    <TouchableHighlight 
                    style={{...styles.loginButton}}
                    underlayColor = '#ccc'>
                        <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={{fontSize: 26, color: "white", textAlign: 'center'}}> LOGIN </Text>
                        </LinearGradient>
                    </TouchableHighlight>
                </Link>
                <Text style={{...styles.hyperlink, marginTop: 140}}
                    onPress={() => Linking.openURL('http://google.com')}> Forgot Your Password?
                </Text>
                <Text style={{...styles.hyperlink, marginTop: 16}}
                    onPress={() => Linking.openURL('http://google.com')}> Register an Account
                </Text>
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
    marginVertical: 50,
    width: 'auto',
  },
  headertext: {
    color: 'white',
    fontSize: 36,
    alignContent: 'center',
    textAlign: 'center',
    height: 55,
  },
  body: {
    marginTop: 50,
    marginBottom: 24,
    marginHorizontal: 24,
    borderColor: 'white',
    borderWidth: 2,
    flex: 1,
  },
  inputText: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 20,
    marginHorizontal: 24,
    borderBottomColor: 'purple',
    borderWidth: 2,
    marginBottom: 8,
    marginTop: 24,
  },
  loginButton: {
    color: 'purple',
    marginHorizontal: 24,
    marginTop: 30,
  },
  hyperlink: {
    color: '#2296ec',
    fontSize: 26,
    marginHorizontal: 24,
    textAlign: 'center',
  },

});
