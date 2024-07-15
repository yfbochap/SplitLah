import { supabase } from '../hooks/supabase';
import {Alert} from "react-native";

export class User {
    userID: string;

    constructor(inputUserID: string ) {
        this.userID = inputUserID;
    }

    getUserID(){
        return this.userID;
    }

    //  Select all billID based on user
    async getBillIDsBasedOnUser() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('bill')
                .select('bill_id')
                .eq('user_id',this.userID);
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log(data);
                return data;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }

    //  Select all group IDs based on userID
    async getGroupIDsBasedOnUserID() {
        // console.log(Group ID: ${this.groupID});
        try {
            const {data,error} = await supabase
                .from('user_group')
                .select("group_id")
                .eq('user_id',this.userID);
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log(data);
                return data;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }
    
    //Test code for retrieving details of all groups the user is a member in
    async getGroupDetailsBasedOnUserID() {
        try {
            const {data,error} = await supabase
                .from('user_group')
                .select("group_id, group (group_id, group_name, description, no_of_people, currency)")
                .eq('user_id', this.userID);
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log(data);
                return data;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }

    //    Get all details of user based on ID
    async getUserDetails() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('user')
                .select()
                .eq('user_id',this.userID);
            if (error){
                Alert.alert(error.message);
            }
            else {
                // console.log(data);
                return data;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }
    
}