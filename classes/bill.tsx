import { supabase } from '../hooks/supabase';
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {Alert} from "react-native";


export class Bill {
    billID: string;

    constructor(inputBillID: string ) {
        this.billID = inputBillID;
    }

    getBillID(){
        return this.billID;
    }

    //  Select all info based on billID
    async getBillDetails() {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('bill')
                .select()
                .eq('bill_id',this.billID);
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

    async getBillOwnerID() {
        try {
            const { data, error } = await supabase
                .from('bill')
                .select('user_id')
                .eq('bill_id', this.billID);
            if (error) {
                Alert.alert(error.message);
                return null; // Return null on error
            } else {
                console.log(data);
                return data.length > 0 ? data[0].user_id : null; // Return the first user ID or null if no data
            }
        } catch (irregError) {
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }
    
    async getBillOwnerName(inputUserID : string) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('user_name')
                .eq('user_id', inputUserID);
            if (error) {
                Alert.alert(error.message);
                return null; // Return null on error
            } else {
                console.log(data);
                return data.length > 0 ? data[0].user_name : null; // Return the user name or null if no data
            }
        } catch (irregError) {
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return null; // Handling any other unexpected errors
        }
    }
    
    // Combine the above two functions
    async getBillOwnerNameViaBillID() {
        try {
            const userId = await this.getBillOwnerID();
    
            if (userId == null) {
                console.log('No user ID found for this bill.');
                return null; // Return null if no user ID is found
            }
    
            const userData = await this.getBillOwnerName(userId);
    
            console.log('User Data:', userData);
            return userData;
        } catch (error) {
            Alert.alert('An unexpected error occurred: ' + error.message);
            return null; // Return null on unexpected error
        }
    }
    

        //  Select all participants based on billID
        async getBillParticipantsUsingBillId() {
            // console.log(`Group ID: ${this.groupID}`);
            try {
                const {data,error} = await supabase
                    .from('bill_participant')
                    .select('user_id')
                    .eq('bill_id',this.billID);
                if (error){
                    Alert.alert(error.message);
                    return [];
                }
                else {
                    console.log(data);
                    return data.map(row => row.user_id);
                }
            }
            catch (irregError){
                Alert.alert('An unexpected error occurred: ' + irregError.message);
                return []; // Handling any other unexpected errors
            }
        }

        //  Select all participants names based on userID
        async getBillParticipantsUsingUserIds(userIds: string[]) {
            // console.log(`Group ID: ${this.groupID}`);
            try {
                const {data,error} = await supabase
                    .from('user')
                    .select('user_name, user_id')
                    .in('user_id', userIds);
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
                return []; // Handling any other unexpected errors
            }
        }

    // Combining the above 2 functions
    async getBillParticipantsNames() {
        try {
            const userIds = await this.getBillParticipantsUsingBillId();

            if (userIds.length === 0) {
                console.log('No user IDs found for this group.');
                return [];
            }

            const userData = await this.getBillParticipantsUsingUserIds(userIds);

            console.log('User Data:', userData);
            return userData;
        } catch (error) {
            Alert.alert('An unexpected error occurred: ' + error.message);
            return [];
        }
    }

    //  Create a new bill, returns true or false
    async createBill(inputAmount,inputName,inputDate, inputUserID, inputGroupID) {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            const {data,error} = await supabase
                .from('bill')
                .insert({
                    amount : inputAmount,
                    name : inputName,
                    date : inputDate,
                    user_id : inputUserID,
                    group_id : inputGroupID
                });
            if (error){
                Alert.alert(error.message);
            }
            else {
                console.log("Bill Created");
                return true;
            }
        }
        catch (irregError){
            Alert.alert('An unexpected error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }

    async StoreBillParticipants(userIds: string[]) {
        // console.log(`Group ID: ${this.groupID}`);
        try {
            // Prepare the data to be inserted
            const dataToInsert = userIds.map(userId => ({
                user_id: userId,
                bill_id: this.billID
            }));
    
            const { data, error } = await supabase
                .from('bill_participant')
                .insert(dataToInsert); // Insert multiple rows
    
            if (error) {
                Alert.alert(error.message);
                return false;
            } else {
                console.log("Bill Participants Added");
                return true;
            }
        } catch (irregError) {
            Alert.alert('An unexpected storing error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }
    
    async updateBillUsingBillID(amount, name, date, paidByUserId) {
        try {
          const { data, error } = await supabase
            .from('bill')
            .update({ amount, name, date, user_id: paidByUserId })
            .eq('bill_id', this.billID);
    
          if (error) {
            console.error('updateBillUsingBillID error:', error.message);
            return false;
          }
    
          console.log('updateBillUsingBillID data:', data);
          return true; // Return true if update was successful
        } catch (error) {
          console.error('updateBillUsingBillID catch error:', error.message);
          return false;
        }
      }
    
    async DeleteBillParticipants() {
        try {
            const { data, error } = await supabase
                .from('bill_participant')
                .delete()
                .eq('bill_id', this.billID); // Ensure we are deleting entries matching bill_id
    
            if (error) {
                Alert.alert(error.message);
                return false;
            } else {
                console.log("Bill Participants Deleted");
                return true;
            }
        } catch (irregError) {
            Alert.alert('An unexpected deletion error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }
    
    async StoreBillBalances(gid: string, userIds: string[], amounts: { [userId: string]: string }, creditorId: string) {
        try {
            const dataToInsert = userIds.map(userId => ({
                bill_id: this.billID,
                group_id: gid,
                debtor_id: userId,
                amount: amounts[userId],
                creditor_id: creditorId,
            }));
    
            const { data, error } = await supabase
                .from('balance')
                .insert(dataToInsert); // Insert multiple rows
    
            if (error) {
                Alert.alert(error.message);
                return false;
            } else {
                console.log("Balances Added");
                return true;
            }
        } catch (irregError) {
            Alert.alert('An unexpected storing error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }

    async GetBillBalances() {
        try {
            const {data,error} = await supabase
                .from('balance')
                .select()
                .eq('bill_id', this.billID);
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
            return []; // Handling any other unexpected errors
        }
    }

    async DeleteBillBalances() {
        try {
            const { data, error } = await supabase
                .from('balance')
                .delete()
                .eq('bill_id', this.billID); // Ensure we are deleting entries matching bill_id
    
            if (error) {
                Alert.alert(error.message);
                return false;
            } else {
                console.log("Bill Balances Deleted");
                return true;
            }
        } catch (irregError) {
            Alert.alert('An unexpected deletion error occurred: ' + irregError.message);
            return false; // Handling any other unexpected errors
        }
    }
    
    async GetBalanceSum() {
        try {
            const { data, error } = await supabase
                .from('balance')
                .select('amount.sum()')
                .eq('bill_id', this.billID)
                .single();
    
            if (error) {
                throw new Error(error.message);
            }
    
            let balanceSum: number = 0;
    
            if (typeof data?.sum === 'string') {
                balanceSum = parseFloat(data.sum);
            } else if (typeof data?.sum === 'number') {
                balanceSum = data.sum;
            } else {
                throw new Error('Unexpected data type returned for balance sum.');
            }
    
            if (isNaN(balanceSum)) {
                throw new Error('Failed to parse balance sum.');
            }
    
            return balanceSum;
        } catch (error) {
            Alert.alert('An unexpected error occurred 2: ' + error.message);
            throw error; // Rethrow the error to propagate it further if necessary
        }
    }
    
    
    async GetOwnerSum() {
        try {
            const { data, error } = await supabase
                .from('bill')
                .select('amount')
                .eq('bill_id', this.billID)
                .single();
    
            if (error) {
                throw new Error(error.message);
            }
    
            const billamt = data?.amount ?? 0; // Use optional chaining and nullish coalescing operator
            const balanceSum = await this.GetBalanceSum();
            const remainingAmount = billamt - balanceSum;
            return remainingAmount;
        } catch (error) {
            Alert.alert('An unexpected error occurred 3: ' + error.message);
            throw error; // Rethrow the error to propagate it further if necessary
        }
    }

    async isOwnerBillParticipant(): Promise<boolean> {
        try {
            const billOwnerID = await this.getBillOwnerID();
            console.log('THIS WORKKKKKKKSSSS', billOwnerID);
            const { data, error } = await supabase
            .from('bill_participant')
            .select('user_id')
            .eq('user_id', billOwnerID)
            .eq('bill_id', this.billID)
            .single();
            if(error){
                throw error;
            }
            console.log(!!data);
            return !!data;
        } catch (error) {
          console.error('Error checking owner participant:', error);
          return false; // Return false in case of error or no participation
        }
      }

    

}