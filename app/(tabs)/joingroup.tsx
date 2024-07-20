import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import styles from '../../assets/styles';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUUID } from '../../services/accountService';
import {Group} from "@/classes/group";
import { checkInvCodeValid,getGroupIDBasedOnInviteCode,insertUserGroup,checkUserNotInGroup } from '@/services/joinGroupService';

interface Props {
  navigation: any;
}

const JoinGroupPage: React.FC<Props> = ({navigation }) => {
    const [code, setCode] = useState('');


    // Runs 3 checks after a user submits invite code. If pass all checks then adds to user_group row and updates group table occupancy column
    const handleJoinGroup = async () =>{
        const checkResult = await checkInvCodeValid(code);
        if (checkResult){
            const grpIDRaw = await getGroupIDBasedOnInviteCode(code);
            const grpID = grpIDRaw[0].group_id;
            const userID = await getUUID();
            const checkNotinGroup = await checkUserNotInGroup(userID,grpID);
            if (checkNotinGroup){
                const checkInsertUserGroupSuccess = await insertUserGroup(userID,grpID);
                const grpClass = new Group(grpID);
                const checkUpdateGroupSuccess = await grpClass.updateOccupancyBy1();
                if(checkInsertUserGroupSuccess && checkUpdateGroupSuccess){
                    Alert.alert("Successfully joined group!");
                    router.back();
                }
            }
        }
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={() => router.back()} />
        <Text style={styles.headerText}>Join Group</Text>
      </View>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          style={{
            height: 40,
            backgroundColor: 'black',
            borderWidth: 1,
            paddingHorizontal: 10,
            fontSize: 18,
            textAlign: 'center',
            color: 'white'
          }}

          placeholder="Click to enter 6-digit code"
          placeholderTextColor="gray"
          value={code}
          onChangeText={(text) => setCode(text)}
          
          maxLength={8}
        />
        <TouchableOpacity
          style={{
            backgroundColor: 'purple',
            padding: 10,
            borderRadius: 5,
            marginTop: 20
          }}
        >
          <Text style={{ fontSize: 26, color: "white", textAlign: 'center' }} onPress={handleJoinGroup}> SUBMIT </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};




export default JoinGroupPage;