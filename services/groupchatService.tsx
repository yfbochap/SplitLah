import {supabase} from "@/hooks/supabase";
import {Alert} from "react-native";
import {Group} from "@/classes/group";
import {User} from "@/classes/user";
import {getUUID, getGID} from "./accountService";

// Function to get existing messages
async function getPreviousMessages(){
    try {
        const groupID = await getGID();
        const {data, error} = await supabase
            .from('group_chat')
            .select()
            .eq('group_id',groupID)
            .order('time_stamp', {ascending: true});
        if(!error){
            return data;
        }
        else {
            return null;
        }
    }
    catch(error){
        Alert.alert('An unexpected error occurred: ' + error.message);
    }
}

// Function to get username from the rawMessage
async function parseRawMessage(rawMesssage){
    const userID = rawMesssage.user_id;
    // console.log("userid:",userID);
    const userClass = new User(userID);
    const userDetails = await userClass.getUserDetails();
    const userName = userDetails[0].user_name;
    const userEmail = userDetails[0].user_email;
    const message = rawMesssage.message;
    const timeStamp = rawMesssage.time_stamp;
    const cleanedMessage = {user_name: userName, user_email: userEmail, message: message, time_stamp: timeStamp};
    // console.log(cleanedMessage);
    return cleanedMessage;
}

// Function to send the message into group_chat table
async function sendMessage(inputUserID,inputGroupID,message){
    try{
        const { error } = await supabase
            .from('group_chat')
            .insert({ user_id: inputUserID,group_id:inputGroupID,message:message})
        if (!error){
            return true;
        }
    }
    catch(error){
        Alert.alert("An unexpected error occurred: " + error.message);
        return false;
    }
}

export {getPreviousMessages,parseRawMessage, sendMessage};