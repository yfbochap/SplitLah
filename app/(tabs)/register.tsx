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
import {Link, useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import styles from '../../assets/styles';
import {passwordTotalCheck, emailTotalCheck, usernameTotalCheck, signUpEmail} from '../../services/accountService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function register(){
    const router = useRouter();

    // Set up the useState starting with empty fields, the first field is the var name, the 2nd field is the updaterFunction when changed
    const [password, inputtedPassword] = useState("");
    const [confirmPassword,inputtedConfirmPassword] = useState("");
    // For the password error msg
    const [checkPasswordError, setPasswordErrorMsg] = useState(false);

    // For Username
    const [username, setUsername] = useState('');
    // For username error msg
    const [checkUsernameError, setCheckUsernameError] = useState(false);

    // For Email
    const [email, setEmail] = useState('');
    // For Email error msg
    const [checkEmailError, setCheckEmailError] = useState(false);

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

    // handle email input
    const handleEmailChange = (email)=> {
        setEmail(email);
    }

    const handleRegister = () => {
        // console.log("IN HANDLE");
        var counter = 0;
        if(!passwordTotalCheck(password,confirmPassword)) {
            setPasswordErrorMsg(true);
        }
        else{
            setPasswordErrorMsg(false);
            counter++;
        }
    //  Check if email does not pass the checks
    //      set the email error to true
    //  Else counter increase by 1
        if(!emailTotalCheck(email)){
            setCheckEmailError(true);
        }
        else {
            setCheckEmailError(false);
            counter++;
        }
    //  Check if username does not pass the checks
    //      set username error to true
    //   Else counter increase by 1
        if(!usernameTotalCheck(username)){
            setCheckUsernameError(true);
        }
        else {
            setCheckUsernameError(false);
            counter++;
        }

    //  Check if the counter == 3
    //      add the user into auth db
    //      redirect to home page w/ uid? (C if can j take from somewhere)
        if (counter !=3){
            console.log("ERROR");
        }
        else{
            console.log("PASS");
            // var result = signUpEmail(email, password,username);
            async function signUpResult(){
                const signUpCheck = await signUpEmail(email, password, username);
                console.log(signUpCheck);
                if (signUpCheck) {
                  router.navigate('login');
                  /* can consider making a filler page (like congratulations) 
                  with a button for the user to click which would then redirect them to "login" instead */
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

