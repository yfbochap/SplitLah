import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {router, useFocusEffect} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { User } from '../../classes/user';
import { getUUID } from "@/services/accountService";


export default function login() {

    // Declaring block-scoped variables
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    // Function to retrieve the user details and store the username and email
    const getProfile = async () => {
        const uuid = await getUUID(); //Retrieves logged-in user credentials
        if(uuid){
            const user = new User(uuid);
            const userDetails = await user.getUserDetails(); //Retrieves user details using user id
            if(userDetails){
                try{
                    setUsername(userDetails[0].user_name); //Stores the username
                    setEmail(userDetails[0].user_email); // Stores the email
                }
                catch{
                    console.log('Error displaying user details');
                }
            }
            // console.log('Error retrieving user details');

        }
        
    }

    //Runs the function everytime the screen is focused
    useFocusEffect(
        useCallback(() => {
            getProfile();
        }, [])
    );

    //Removes user credentials from secure storage, used when user signs out
    const clearStorage = async () => {
        try {
          await SecureStore.deleteItemAsync('user_uuid');
          console.log('Storage cleared successfully');
          router.navigate('/');
        } catch (error) {
          console.error('Error clearing storage', error);
        }
      };


    return(
            <SafeAreaView style={styles.container}>
                <ScrollView>
                <View style={styles.primaryheader}>
                    <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={styles.primaryheadertext}>Profile</Text>
                    </LinearGradient>
                </View>
                <View style={{marginTop: 30, alignItems: 'center'}}>
                    <FontAwesome name="user" size={150} color="white"/>
                </View>
                <View style={styles.accountbody}>
                    <Text style={styles.descText}>Username</Text>
                    <Text style={{...styles.inputText}}>{username}</Text>
                    <Text style={styles.descText}>Email</Text>
                    <Text style={{...styles.inputText}}>{email}</Text>
                    <TouchableHighlight
                        style={{...styles.loginButton}}
                        underlayColor = '#ccc'
                        onPress={clearStorage}>
                        <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                            <Text style={{fontSize: 26, color: "white", textAlign: 'center'}}> SIGN OUT </Text>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>

            </ScrollView>
            </SafeAreaView>

    );
}
