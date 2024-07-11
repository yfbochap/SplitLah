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

}