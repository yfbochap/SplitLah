import {supabase} from "@/hooks/supabase";
import {Alert} from "react-native";
import {User} from "@/classes/user";
import { getGID } from "./accountService";

// Function to append 0 to the time if not 2 digit
function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

// Formats the timestamp taken from db into more understandable
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return `${padZero(hours12)}:${padZero(minutes)} ${ampm}`;
}

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

// Function to clean the message object into another object with relevant data
async function parseRawMessage(rawMesssage){
    const userID = rawMesssage.user_id;
    const userClass = new User(userID);
    const userDetails = await userClass.getUserDetails();
    const userName = userDetails[0].user_name;
    const userEmail = userDetails[0].user_email;
    const message = rawMesssage.message;
    const timeStamp = new Date(rawMesssage.time_stamp);
    const formattedDate = `${timeStamp.getFullYear()}-${padZero(timeStamp.getMonth() + 1)}-${padZero(timeStamp.getDate())} ${formatTime(timeStamp)}`;
    const cleanedMessage = {user_name: userName, user_email: userEmail, message: message, time_stamp: formattedDate};
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