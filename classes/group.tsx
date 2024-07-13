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
    // Update group occupancy by 1
    async updateOccupancyBy1(){
        const currentGroup = await this.getGroupDetails();
        // console.log(currentGroup);
        const currentCount = currentGroup.no_of_people;
        // console.log(`current count: ${currentCount}`);
        try{
            const { data, error } = await supabase
                .from('group')
                .update({ no_of_people: currentCount+1 })
                .eq('group_id', this.groupID);
            if (!error){
                console.log("successfully updated");
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }

    async createBillUsingGroupID(inputAmount: string,inputName: string,inputDate: any, inputUserID: string) {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('bill')
                .insert({
                    amount : inputAmount,
                    name : inputName,
                    date : inputDate,
                    user_id : inputUserID,
                    group_id : this.groupID
                })
                .select('bill_id');
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log("Bill Created", data[0].bill_id);
                return data[0].bill_id;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }

    // Get user IDs based on group ID
    async getUserIdsByGroupId() {
        try {
            const { data, error } = await supabase
                .from('user_group')
                .select('user_id')
                .eq('group_id', this.groupID);

            if (error) {
                throw error;
            }

            return data.map(row => row.user_id);
        } catch (error) {
            console.error('Error fetching user IDs:', error.message);
            return [];
        }
    }

    // Get user names based on array of user IDs
    async getUserNamesByUserIds(userIds: string[]) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('user_id, user_name')
                .in('user_id', userIds);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error fetching user names:', error.message);
            return [];
        }
    }

    // Get user names based on group ID
    async getUsersBasedOnGroup() {
        try {
            const userIds = await this.getUserIdsByGroupId();

            if (userIds.length === 0) {
                console.log('No user IDs found for this group.');
                return [];
            }

            const userData = await this.getUserNamesByUserIds(userIds);

            console.log('User Data:', userData);
            return userData;
        } catch (error) {
            Alert.alert('An unexpected error occurred: ' + error.message);
            return [];
        }
    }
    

}
