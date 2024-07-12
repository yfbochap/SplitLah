import { supabase } from '../hooks/supabase';
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {Alert} from "react-native";

export class Group {
    groupID: string;

    constructor(inputGroupID: string) {
        this.groupID = inputGroupID;
    }

    getGroupID(){
        return this.groupID;
    }

    //  Get group name based on group id
    async getGroupName() {
        console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('group')
                .select('group_name')
                .eq('group_id',this.groupID);
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

    //  Select all based on group id
    async getGroupDetails() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('group')
                .select()
                .eq('group_id',this.groupID);
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

    //  Delete group based on group id
    async deleteGroup() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('group')
                .delete()
                .eq('group_id',this.groupID);
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log("Group has been deleted");
                return true;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }

    //  Select all billID based on group
    async getBillIDsBasedOnGroup() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('bill')
                .select('bill_id')
                .eq('group_id',this.groupID);
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

    // Select all Bills based on GID
    async getBillsBasedOnGroup() {
        try {
            const {data,error} = await supabase
                .from('bill')
                .select('bill_id, name, date, amount')
                .eq('group_id',this.groupID);
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
}
