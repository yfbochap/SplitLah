import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableHighlight,
    Pressable,
    Linking,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {Link} from 'expo-router';
import {useRouter, useFocusEffect} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import {SUPABASE_URL,SUPABASE_KEY} from '@env'
import {signInEmail} from "@/services/accountService";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { User } from '../../classes/user';
import { getUUID, getGID, storeGID } from "@/services/accountService";
// import * as Updates from 'expo-updates';
// import { useNavigation, NavigationContainer } from '@react-navigation/native'; uncomment if we want a back button on the page

export default function login() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleEmailChange = (inputEmail)=> {
        setEmail(inputEmail);
    }

    const handleUsernameChange = (inputUsername)=> {
        setUsername(inputUsername);
    }

    // function handleSignIn(){
    //     signInEmail(email, password);
    // }

    /* uncomment below if we want a back button on the page */
    // const navigation = useNavigation(); 

    // const handleBackButtonPress = () => {
    //   navigation.goBack();
    // };

    const getProfile = async () => {
        const uuid = await getUUID();
        if(uuid){
            const user = new User(uuid);
            const userDetails = await user.getUserDetails();
            if(userDetails){
                try{
                    setUsername(userDetails[0].user_name);
                    setEmail(userDetails[0].user_email);
                }
                catch{
                    console.log('Error displaying user details');
                }
            }
            console.log('Error retrieving user details');

        }
        
    }

    useFocusEffect(
        useCallback(() => {
            getProfile();
        }, [])
    );

    const clearStorage = async () => {
        try {
          await SecureStore.deleteItemAsync('user_uuid');
          console.log('Storage cleared successfully');
        //   await Updates.reloadAsync();
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
                        {/* uncomment below if we want a back button on the page */}
                        {/* <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} /> */}
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
