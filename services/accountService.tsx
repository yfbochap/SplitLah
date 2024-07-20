import { Alert } from 'react-native'
import { supabase } from '../hooks/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  * as SecureStore from 'expo-secure-store';

//Function to check if the password fields are empty
function passwordCheckNotEmpty(password, confirmPassword){
    if (password.length!=0 && confirmPassword.length != 0){
        return true;
    }
    return false;
}

//Function to check if password & confirm password same
function passwordCheckMatch(password, confirmPassword){
    if (password == confirmPassword){
        return true;
    }
    return false;
}

// Function to check username empty
function usernameNotEmpty(username){
    if (username.length!=0){
        return true;
    }
    // console.log("Username is empty");
    return false;
}

// Function to check username more than 6
function usernameMore6(username){
    if (username.length>=6){
        return true;
    }
    // console.log("Username less than 6 chars");
    return false;
}

// Function to check if email empty
function emailNotEmpty(email){
    if (email.length!=0){
        return true;
    }
    // console.log("Email is empty");
    return false;
}

// Function to check if email in email format
function emailFormatCorrect(email){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)){
        return true;
    }
    return false;
}


//Combines both password checks
function passwordTotalCheck(inputPass,inputConfirmPassword) {
    if(passwordCheckMatch(inputPass,inputConfirmPassword) && passwordCheckNotEmpty(inputPass,inputConfirmPassword)){
        return true;
    }
    return false;
}

//Combine email checks
function emailTotalCheck(email){
    if(emailNotEmpty(email) && emailFormatCorrect(email)){
        return true;
    }
    return false;
}

//Combine username checks
function usernameTotalCheck(username){
    if (usernameNotEmpty(username) && usernameMore6(username)){
        return true;
    }
    return false;
}

//Sign up with Supabase Auth service
async function signUpEmail(inputEmail,inputPassword,inputUsername) {
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
        }
        // This will be used if email verification is enabled
        else if (!session) {
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

//Sign in with Supabase Auth service and adds id into secure store on device
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

        const storeUUID = async (uuid) => {
            try {
              await SecureStore.setItemAsync('user_uuid', uuid);
            } catch (e) {
              console.error('Failed to save UUID.', e);
            }
        };
        await storeUUID(user.id);
        return user.id;
    }
}

// UNUSED FUNCTION
async function signOutEmail() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            // console.log('Signed out successfully');
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// UNUSED FUNCTION
async function checkSession(){
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    if (!data || !data.session) {
        // console.log('No session found');
        return null;
    }

    const userId = data.session.user.id;
    // console.log('User ID:', userId);
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
        // console.log(gid);
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

async function storeBID(bid: string){
    try {
        await AsyncStorage.setItem('bill_uuid', bid);
        // console.log(bid);
    } catch (e) {
        console.error('Failed to save BID.', e);
    }
};

async function getBID(): Promise<string | null> {
    try {
        const bid = await AsyncStorage.getItem('bill_uuid');
        return bid;
    } catch (e) {
        // console.error('Failed to retrieve UUID.', e);
        return null;
    }
};

export {passwordTotalCheck, emailTotalCheck, usernameTotalCheck, signUpEmail, signInEmail, signOutEmail, checkSession};
export { getUUID, getGID, storeGID, getBID, storeBID};