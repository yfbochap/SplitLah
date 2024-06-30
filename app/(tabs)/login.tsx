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
    SafeAreaView,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {Link} from 'expo-router';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import {SUPABASE_URL,SUPABASE_KEY} from '@env'
import {signInEmail} from "@/services/accountService";

export default function login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (inputEmail)=> {
        setEmail(inputEmail);
    }

    const handlePasswordChange = (inputPassword)=> {
        setPassword(inputPassword);
    }

    function handleSignIn(){
        signInEmail(email, password);
    }

    return(
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={styles.headertext}>Login</Text>
                    </LinearGradient>
                </View>
                <View style={{alignItems: 'center'}}>
                    <FontAwesome name="user" size={150} color="white"/>
                </View>
                <View style={styles.body}>
                    <TextInput placeholder='Email' placeholderTextColor={'grey'} style={{...styles.inputText}} onChangeText={handleEmailChange}></TextInput>
                    <TextInput placeholder='Password' placeholderTextColor={'grey'} style={{...styles.inputText}} secureTextEntry={true} onChangeText={handlePasswordChange}></TextInput>
                    <TouchableHighlight
                        style={{...styles.loginButton}}
                        underlayColor = '#ccc'
                        onPress={handleSignIn}>
                        <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                            <Text style={{fontSize: 26, color: "white", textAlign: 'center'}}> LOGIN </Text>
                        </LinearGradient>
                    </TouchableHighlight>
                    <Link href= '/register' asChild>
                        <Text style={{...styles.hyperlink, marginTop: 16}}>
                            Register an Account
                        </Text>
                    </Link>

                </View>

            </ScrollView>

    );
}
