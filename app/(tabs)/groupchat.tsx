import {Image, StyleSheet, Platform, FlatList, ScrollView, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback,useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {supabase} from "@/hooks/supabase";
import {getGID, getUUID} from "@/services/accountService";
import { getPreviousMessages, parseRawMessage, sendMessage } from "@/services/groupchatService";
import {useFocusEffect} from "@react-navigation/native";
import {useKeyboardAvoidingView} from "expo-key"


export default function GroupChatScreen(){
    const [messages, setMessages] = useState([]);
    const [incomingRawMessage, setIncomingRawMessage] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef(null);

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

    const handleAutoScroll = () =>{
        scrollViewRef.current.scrollToEnd({ animated: true });
    };

    const handleTextInputFocus = () => {
        setTimeout(() => {
            handleAutoScroll();
        }, 300);
    };

    async function handleSendMessage(){
        const grpID = await getGID();
        const userID = await getUUID();
        const sendResult = await sendMessage(userID,grpID,newMessage);
        setNewMessage('');
    }

    // Fetch all messages
    useEffect(() => {
        fetchPreviousCleanedMessages();
        scrollViewRef.current.scrollToEnd({ animated: true });
    }, []);

    // Open up a subscription to the group_chat table
    useEffect(() => {
        openSubscription();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchPreviousCleanedMessages();
            openSubscription();
            handleAutoScroll();
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

    // Scrolls to bottom of text after 1 second of list loaded
    useEffect(() => {
        setTimeout(() => {
            handleAutoScroll();
        }, 1500);
    }, []);



    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.messageListContainer} >
                <ScrollView contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef} onContentSizeChange={handleAutoScroll}>
                    {messages.map((message, index) => (
                        <View key={index} style={styles.messageContainer}>
                            <Text style={styles.receivedName}>{message.user_name} ({message.time_stamp})</Text>
                            <Text style={styles.receivedMessage}>{message.message}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    onFocus={handleTextInputFocus}
                    multiline={true}
                    numberOfLines={1}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    messageListContainer: {
        flex: 0.93,
        padding: 10,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
    },
    messageContainer: {
        marginVertical: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    receivedName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    receivedMessage: {
        fontSize: 20,
        color: '#333',
    },
    inputContainer: {
        flex: 0.07,
        padding: 10,
        backgroundColor: 'grey',
        flexDirection: 'row',
    },
    textInput: {
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        flex: 1
    },
    sendButton:{
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    sendButtonText:{
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical:'center'
    }

});