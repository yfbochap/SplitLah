import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../hooks/supabase';
import {Simulate} from "react-dom/test-utils";
import canPlayThrough = Simulate.canPlayThrough;
import AsyncStorage from '@react-native-async-storage/async-storage';
import  * as SecureStore from 'expo-secure-store';

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
async function signUpEmail(inputEmail,inputPassword,inputUsername) {
    // console.log(supabase);
    try {
        const {
            data: {session},
            error,
        } = await supabase.auth.signUp({email: inputEmail, password: inputPassword,
        options:{
            data: {
                userName: inputUsername
            }
        }});

        if (error) {
            if (error.message == "User already registered"){
                Alert.alert("Email has already been registered!");
            }
            else {
                Alert.alert(error.message);
            }
        } else if (!session) {
            Alert.alert('Please check your inbox for email verification!');
        }

        return true;
    }
    catch (error){
        console.error(error);
        console.error(error.message);
        console.error(error.stack);
    }
}

// Signing in
async  function  signInEmail(inputEmail,inputPassword){
    const { error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
    })
    if (error) {
        if (error.message == "Invalid login credentials"){
            Alert.alert("email/password is wrong");
        }
        else {
            Alert.alert(error.message);
        }
        return false;
    }
    else {
        const {data: {user}} = await supabase.auth.getUser();
        console.log(user);
        console.log(`User UID: ${user.id}`);

        // Test code for storing login uuid in secure storage
        const storeUUID = async (uuid) => {
            try {
              console.log(`test: ${uuid}`);
              await SecureStore.setItemAsync('user_uuid', uuid);
            } catch (e) {
              console.error('Failed to save UUID.', e);
            }
        };

        await storeUUID(user.id);
        return user.id;
        
    }
}

async function signOutEmail() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            console.log('Signed out successfully');
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// check if session exists
// To use the function do:
// getSessionUserId().then((userId) => {
//     if (userId) {
//         // Do something with the user ID
//     } else {
//         // Handle the case where no session is found
//     }
// });
async function checkSession(){
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    if (!data || !data.session) {
        console.log('No session found');
        return null;
    }

    const userId = data.session.user.id;
    console.log('User ID:', userId);
    return userId;
}

async function getUUID(): Promise<string | null> {
    try {
        const uuid = await SecureStore.getItemAsync('user_uuid');
        return uuid;
    } catch (e) {
        console.error('Failed to retrieve UUID.', e);
        return null;
    }
};

async function storeGID(gid: string){
    try {
        await AsyncStorage.setItem('group_uuid', gid);
        console.log(gid);
    } catch (e) {
        console.error('Failed to save GID.', e);
    }
};

async function getGID(): Promise<string | null> {
    try {
        const gid = await AsyncStorage.getItem('group_uuid');
        return gid;
    } catch (e) {
        console.error('Failed to retrieve UUID.', e);
        return null;
    }
};

export {passwordTotalCheck, emailTotalCheck, usernameTotalCheck, signUpEmail, signInEmail, signOutEmail, checkSession};
export { getUUID, getGID, storeGID};