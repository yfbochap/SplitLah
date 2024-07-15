import {Image, StyleSheet, Platform, FlatList, ScrollView} from 'react-native';
import React, { useState, useEffect,  useCallback } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {supabase} from "@/hooks/supabase";
import {getGID, getUUID} from "@/services/accountService";
import { getPreviousMessages, parseRawMessage, sendMessage } from "@/services/groupchatService";
import { useFocusEffect } from '@react-navigation/native';


export default function GroupChatScreen(){
    const [messages, setMessages] = useState([]);
    const [incomingRawMessage, setIncomingRawMessage] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    async function fetchPreviousCleanedMessages() {
        const pastMessages = await getPreviousMessages();
        if (pastMessages != null) {
            // Use Promise.all to process messages in parallel and then map to apply function to all the elements
            const cleanedMessages = await Promise.all(pastMessages.map(parseRawMessage));
            setMessages(cleanedMessages);
            // console.log("PREVIOUS MESSAGES:", cleanedMessages);
        }
    }

    async function openSubscription(){
        const gid = await getGID();
        if (gid){
            supabase
                .channel(gid)
                .on('postgres_changes',{event:'INSERT',schema:'public',table: 'group_chat'}, payload =>{
                    if (payload.new.group_id == gid){
                        setIncomingRawMessage(payload.new);
                    }
                })
                .subscribe()
        }
    }

    // Fetch all messages
    useEffect(() => {
        fetchPreviousCleanedMessages();
    }, []);

    // Open up a subscription to the group_chat table
    useEffect(() => {
        openSubscription();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchPreviousCleanedMessages();
            openSubscription();
        }, [])
    );

    // Checks if the rawIncomingMessage has something then take it out append it to the current messages then remove the message
    // The deps part is to tell this useEffect to run everytime incomingRawMessage changes
    useEffect(() => {
        const processMessages = async () => {
            if (incomingRawMessage) {
                // console.log("INCOMING MESSAGE:", incomingRawMessage);
                // console.log("MESSAGE TYPE:", typeof(incomingRawMessage));
                // Use Promise.all to process messages in parallel
                const cleanedMessage = await parseRawMessage(incomingRawMessage);
                // console.log("CLEANED MESSAGE:", cleanedMessage);
                setMessages((prevMessages) => [...prevMessages, cleanedMessage]);
                // console.log("MESSAGEs NOW:",messages);
                setIncomingRawMessage(null);
            }
        };
        processMessages();
    }, [incomingRawMessage]);

    async function handleSendMessage(){
        const grpID = await getGID();
        const userID = await getUUID();
        const sendResult = await sendMessage(userID,grpID,newMessage);
        setNewMessage('');
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <FlatList
                    data = {messages}
                    renderItem={({item}) => (
                        <View>
                            <Text style={{color:"grey"}}>{item.message}</Text>
                            <Text style={{color:"grey"}}>{item.user_name}</Text>
                        </View>
                    )}
                />
            </ScrollView>

            <TextInput
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
                placeholder="Type a message..."
                style={{color:"grey"}}
            />
            <Button title="Send" onPress={handleSendMessage}/>
        </SafeAreaView>
    );
}