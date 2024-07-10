import React, { useState, useEffect } from 'react';
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
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import {SUPABASE_URL,SUPABASE_KEY} from '@env'
import {signInEmail} from "@/services/accountService";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
// import * as Updates from 'expo-updates';
// import { useNavigation, NavigationContainer } from '@react-navigation/native'; uncomment if we want a back button on the page

export default function login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmailChange = (inputEmail)=> {
        setEmail(inputEmail);
    }

    const handlePasswordChange = (inputPassword)=> {
        setPassword(inputPassword);
    }

    function handleSignIn(){
        signInEmail(email, password);
    }

    /* uncomment below if we want a back button on the page */
    // const navigation = useNavigation(); 

    // const handleBackButtonPress = () => {
    //   navigation.goBack();
    // };

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
                    <Text style={{...styles.inputText, marginTop: 24}}>Username: </Text>
                    <Text style={{...styles.inputText, marginTop: 24}}>Email: </Text>
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
