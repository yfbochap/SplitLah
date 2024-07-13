import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../assets/styles';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../hooks/supabase';
import {getGID,getUUID} from '../../services/accountService';
import {User} from "@/classes/user";
import {Group} from "@/classes/group";

interface Props {
  
  navigation: any;
}

const JoinGroupPage: React.FC<Props> = ({navigation }) => {
const [code, setCode] = useState('');
const [joining, setJoining] = useState(false);
const [error, setError] = useState(null);
const router = useRouter();
const navigate = useNavigation();

const checkInvCodeValid = async () => {
    setJoining(true);
      try {
          const {data,error} = await supabase
              .from('group')
              .select()
              .eq('invite_code',code);
          if (error){
              Alert.alert(error.message);
          }
          else {
              if (data.length == 1){
                  console.log(`${code} is valid`);
                  return true;
              }
              else{
                  console.log(`${code} is invalid`);
                  return false;
              }
          }
      }
      catch (irregError){
          Alert.alert('An unexpected error occurred: ' + irregError.message);
          return null; // Handling any other unexpected errors
      }
  };

const getGroupIDBasedOnInviteCode = async () =>{
    try {
        const {data,error} = await supabase
            .from('group')
            .select('group_id')
            .eq('invite_code',code);
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

async function checkUserNotInGroup(inputUserID,inputGroupID){
    
}

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
            console.log("Successfully inserted user group");
            return true;
        }
    }
    catch (error){
        Alert.alert(error.message);
    }
    return false;
}

const handleJoinGroup = async () => {
//     get the result from function
//     check if true
//          add user into user_group with group_id
//          update the group no_of_people by 1
//     Else
//          alert say invalid group code
    const checkResult = await checkInvCodeValid();
    if (checkResult){
        const grpIDRaw = await getGroupIDBasedOnInviteCode();
        const grpID = grpIDRaw[0].group_id;
        const userID = await getUUID();
        const checkInsertUserGroupSuccess = await insertUserGroup(userID,grpID);
        const grpClass = new Group(grpID);
        const checkUpdateGroupSuccess = await grpClass.updateOccupancyBy1();

        if(checkInsertUserGroupSuccess && checkUpdateGroupSuccess){
            console.log("Successfully done both");
        }

    }
    else {
        Alert.alert("Group not found");
    }

}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={() => navigate.goBack()} />
        <Text style={styles.headerText}>Join Group</Text>
      </View>
      
      <View style={styles.descText}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter 8-digit code"
          value={code}
          onChangeText={(text) => setCode(text)}
          
          maxLength={8}
        />
      </View>
      <TouchableOpacity
            style={{ ...styles.loginButton, backgroundColor: 'purple' }}
            
          >
            <Text style={{ fontSize: 26, color: "white", textAlign: 'center' }} onPress={handleJoinGroup}> SUBMIT </Text>
          </TouchableOpacity>
    

    </SafeAreaView>
  );
};




export default JoinGroupPage;