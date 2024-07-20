import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import {passwordTotalCheck, emailTotalCheck, usernameTotalCheck, signUpEmail} from '../../services/accountService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function register(){

    // Set up the useState starting with empty fields, the first field is the var name, the 2nd field is the updaterFunction when changed
    const [password, inputtedPassword] = useState("");
    const [confirmPassword,inputtedConfirmPassword] = useState("");
    const [checkPasswordError, setPasswordErrorMsg] = useState(false); // For the password error msg
    const [username, setUsername] = useState(''); // For Username
    const [checkUsernameError, setCheckUsernameError] = useState(false); // For username error msg
    const [email, setEmail] = useState(''); // For Email
    const [checkEmailError, setCheckEmailError] = useState(false); // For Email error msg

    // updates consts when user changes the status of the fields
    const handlePasswordChange = (pass) => {
        inputtedPassword(pass);
    };
    const handleConfirmPasswordChange = (confirmPass) => {
        inputtedConfirmPassword(confirmPass);
    };
    const handleUsernameChange = (username) => {
      setUsername(username);
    };
    const handleEmailChange = (email)=> {
        setEmail(email);
    }


    // Handles register, places inputs into multiple checks and will register when all checks passed
    const handleRegister = () => {
        var counter = 0;
        if(!passwordTotalCheck(password,confirmPassword)) {
            setPasswordErrorMsg(true);
        }
        else{
            setPasswordErrorMsg(false);
            counter++;
        }

        if(!emailTotalCheck(email)){
            setCheckEmailError(true);
        }
        else {
            setCheckEmailError(false);
            counter++;
        }

        if(!usernameTotalCheck(username)){
            setCheckUsernameError(true);
        }
        else {
            setCheckUsernameError(false);
            counter++;
        }

        if (counter == 3){
            async function signUpResult(){
                const signUpCheck = await signUpEmail(email, password, username);
                if (signUpCheck) {
                  router.navigate('login');
                }
            }
            signUpResult();
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={styles.primaryheader}>
                <LinearGradient colors={['turquoise', 'purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.primaryheadertext}>Register</Text>
                </LinearGradient>
            </View>
            <View style={{marginTop: 30, alignItems: 'center'}}>
                <FontAwesome name="user" size={150} color="white"/>
            </View>
            <View style={styles.accountbody}>
                <TextInput placeholder='username' placeholderTextColor={'grey'} style={{...styles.inputText, marginTop: 24}} onChangeText={handleUsernameChange}></TextInput>
                <TextInput placeholder='email' placeholderTextColor={'grey'} style={{...styles.inputText, marginTop: 24}} onChangeText={handleEmailChange}></TextInput>
                <TextInput placeholder='Password' placeholderTextColor={'grey'} style={{...styles.inputText, marginTop: 24}} secureTextEntry={true} onChangeText={handlePasswordChange}></TextInput>
                <TextInput placeholder='Confirm Password' placeholderTextColor={'grey'} style={{...styles.inputText, marginTop: 24}} secureTextEntry={true} onChangeText={handleConfirmPasswordChange}></TextInput>
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
                    Ensure password is not empty and both fields match{"\n"}
                </Text>
            </View>

            <View style={{display: checkEmailError ? 'flex':'none'}}>
                <Text
                    style={{color:'red'}}>
                    Ensure email is not empty and valid{"\n"}
                </Text>
            </View>

            <View style={{display: checkUsernameError ? 'flex':'none'}}>
                <Text
                    style={{color:'red'}}>
                    Ensure username is not empty and more than 6 characters{"\n"}
                </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
    );



}

