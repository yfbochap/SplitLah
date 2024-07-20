import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../hooks/supabase';

// Checks whether the invite code is in the table
async function checkInvCodeValid(inputInvCode){
    try {
        const {data,error} = await supabase
            .from('group')
            .select()
            .eq('invite_code',inputInvCode);
        if (error){
            Alert.alert(error.message);
        }
        else {
            if (data.length == 1){
                return true;
            }
            else{
                Alert.alert("Group not found");
                return false;
            }
        }
    }
    catch (irregError){
        Alert.alert('An unexpected error occurred: ' + irregError.message);
        return null; // Handling any other unexpected errors
    }
}

// Gets the Group ID with the invite code
async function getGroupIDBasedOnInviteCode(inputInvCode){
    try {
        const {data,error} = await supabase
            .from('group')
            .select('group_id')
            .eq('invite_code',inputInvCode);
        if (error){
            Alert.alert(error.message);
        }
        else {
            return data;
        }
    }
    catch (irregError){
        Alert.alert('An unexpected error occurred: ' + irregError.message);
        return null; // Handling any other unexpected errors
    }
}

// Adds a row in user_group table
async function insertUserGroup(inputUserID,inputGroupID){
    try {
        const { error } = await supabase
            .from('user_group')
            .insert([
                { user_id: inputUserID, group_id: inputGroupID }
            ])
        if (error){
            Alert.alert(error.message);
        }
        else {
            return true;
        }
    }
    catch (error){
        Alert.alert(error.message);
    }
    return false;
}

// Checks whether a user is already in the group
async function checkUserNotInGroup(inputUserID,inputGroupID){
    try {
        const {count,error} = await supabase
            .from('user_group')
            .select('*',{count:'exact',head: true})
            .eq('group_id',inputGroupID)
            .eq('user_id',inputUserID);
        if (!error){
            // console.log(`Count of rows based on user and group: ${count}`);
            if (count == 0){
                return true;
            }
            else {
                Alert.alert("You are already in the group");
                return false;
            }
        }
        else {
            // console.log(`Error: ${error.message}`);
        }

    }
    catch (error){
        Alert.alert(error.message);
    }
}

export {checkInvCodeValid,getGroupIDBasedOnInviteCode,insertUserGroup,checkUserNotInGroup}