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
    Modal,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {Link} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../assets/styles';

export default function register(){
    // Set up the useState starting with empty fields, the first field is the var name, the 2nd field is the updaterFunction when changed
    const [password, inputtedPassword] = useState("");
    const [confirmPassword,inputtedConfirmPassword] = useState("");
    // For the password error msg
    const [checkPasswordError, setPasswordErrorMsg] = useState(false);

    // For Username
    const [username, setUsername] = useState('');
    // For username error msg
    const [checkUsernameError, setCheckUsernameError] = useState(false);

    // Sort of updates when user changes the status of the fields
    const handlePasswordChange = (pass) => {
        inputtedPassword(pass);
    };
    const handleConfirmPasswordChange = (confirmPass) => {
        inputtedConfirmPassword(confirmPass);
    };

    // handle username input
    const handleUsernameChange = (username) => {
      setUsername(username);
    };


    //Function to check if the fields are empty
    function checkNotEmpty(password, confirmPassword){
        if (password.length!=0 && confirmPassword.length != 0){
            return true;
        }
        console.log("Password is empty");
        return false;
    }
    //Function to check if password & confirm password same
    function checkMatch(password, confirmPassword){
        if (password == confirmPassword){
            return true;
        }
        console.log("Password not match");
        return false;
    }

    // Function to check username empty

    // Function to check if username already taken


    //Combines both checks
    function totalCheck() {
        if(checkNotEmpty(password,confirmPassword) && checkMatch(password,confirmPassword)){
            return true;
        }
        return false;
    }


    const handleRegister = () => {
        if(!totalCheck()) {
            console.log("Indeed not match");
            setPasswordErrorMsg(true);
        }
        else{
        }
    };

    return(
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.headertext}>Register</Text>
                </LinearGradient>
            </View>
            <View style={{alignItems: 'center'}}>
                <FontAwesome name="user" size={150} color="white"/>
            </View>
            <View style={styles.body}>
                <TextInput placeholder='username' placeholderTextColor={'grey'} style={{...styles.inputText}} onChangeText={handleUsernameChange}></TextInput>
                <TextInput placeholder='Password' placeholderTextColor={'grey'} style={{...styles.inputText}} secureTextEntry={true} onChangeText={handlePasswordChange}></TextInput>
                <TextInput placeholder='Confirm Password' placeholderTextColor={'grey'} style={{...styles.inputText}} secureTextEntry={true} onChangeText={handleConfirmPasswordChange}></TextInput>
                <TouchableHighlight
                style={{...styles.loginButton}}
                underlayColor = '#ccc'
                onPress={handleRegister}>
                    <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={{fontSize: 26, color: "white", textAlign: 'center'}}> REGISTER </Text>
                    </LinearGradient>
                </TouchableHighlight>
            </View>

            <View style={{display: checkPasswordError ? 'flex':'none'}}>
                <Text
                style={{color:'red'}}>
                    Ensure that your password field is:
                    Not Empty & both fields match

                </Text>
            </View>

            <View>
                <Text
                    style={{color:'red'}}>
                    Ensure Valid Email
                </Text>
            </View>
        </ScrollView>
    );



}

asdasdasd
