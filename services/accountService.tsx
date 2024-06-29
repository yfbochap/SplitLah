import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../hooks/supabase';
import {Simulate} from "react-dom/test-utils";
import canPlayThrough = Simulate.canPlayThrough;
import * as Crypto from 'expo-crypto';

//Function to check if the fields are empty
function passwordCheckNotEmpty(password, confirmPassword){
    if (password.length!=0 && confirmPassword.length != 0){
        return true;
    }
    console.log("Password is empty");
    return false;
}
//Function to check if password & confirm password same
function passwordCheckMatch(password, confirmPassword){
    if (password == confirmPassword){
        return true;
    }
    console.log("Password not match");
    return false;
}

// Function to check username empty
//     check if the length of user name !=0
//          ret true
//      ret false
function usernameNotEmpty(username){
    if (username.length!=0){
        return true;
    }
    console.log("Username is empty");
    return false;
}

// Function to check username more than 6
//      Check if length >= 6
//          ret true
//      ret false
function usernameMore6(username){
    if (username.length>=6){
        return true;
    }
    console.log("Username less than 6 chars");
    return false;
}

// Function to check if email empty
//      check if length != 0
//          true
//      false
function emailNotEmpty(email){
    if (email.length!=0){
        return true;
    }
    console.log("Email is empty");
    return false;
}

// Function to check if email in email format
//      declare regex
//      check if the input matches regex
//          true
//      false
function emailFormatCorrect(email){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)){
        return true;
    }
    console.log("Not a valid email");
    return false;
}

// Function to check if email taken
//      Check if user w/ existing email exists in the auth
//          false
//      true
function emailNotTaken(email){
    return true;
}

//Combines both checks
function passwordTotalCheck(inputPass,inputConfirmPassword) {
    if(passwordCheckMatch(inputPass,inputConfirmPassword) && passwordCheckNotEmpty(inputPass,inputConfirmPassword)){
        return true;
    }
    return false;
}

//Combine email check
function emailTotalCheck(email){
    if(emailNotEmpty(email) && emailNotTaken(email) && emailFormatCorrect(email)){
        return true;
    }
    return false;
}

//Combine username check
function usernameTotalCheck(username){
    if (usernameNotEmpty(username) && usernameMore6(username)){
        return true;
    }
    return false;
}

//Basic Sign up
async function signUpEmail(inputEmail,inputPassword) {
    // console.log(supabase);
    try {
        const hashedPassword = await hashedPassword(inputPassword);
        const {
            data: {session},
            error,
        } = await supabase.auth.signUp({email: inputEmail, password: inputPassword});

        if (error) {
            Alert.alert(error.message);
        } else if (!session) {
            Alert.alert('Please check your inbox for email verification!');
        }
    }
    catch (error){
        console.error(error);
        console.error(error.message);
        console.error(error.stack);
    }
}

export {passwordTotalCheck, emailTotalCheck, usernameTotalCheck, signUpEmail};