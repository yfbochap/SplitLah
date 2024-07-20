import { ScrollView, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback,useRef } from 'react';
import { View, Text, TextInput, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {supabase} from "@/hooks/supabase";
import {getGID, getUUID} from "@/services/accountService";
import { getPreviousMessages, parseRawMessage, sendMessage } from "@/services/groupchatService";
import {useFocusEffect} from "@react-navigation/native";
import styles from '@/assets/styles';
import { Group } from '@/classes/group';
import {HeaderBackButton} from "@react-navigation/elements";
import { router } from 'expo-router';

export default function GroupChatScreen(){
    const [messages, setMessages] = useState([]);
    const [incomingRawMessage, setIncomingRawMessage] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [groupName, setGroupName] = useState('');
    const scrollViewRef = useRef(null);


    function handleAndroidBackButtonPress(){
        router.navigate("group");
        return true;
    }

    const handleBackButtonPress = () => {
        router.navigate("group");
    };

    // Fetches previous messages and cleans them before setting into messages const
    async function fetchPreviousCleanedMessages() {
        const pastMessages = await getPreviousMessages();
        if (pastMessages != null) {
            // Use Promise.all to process messages in parallel and then map to apply function to all the elements
            const cleanedMessages = await Promise.all(pastMessages.map(parseRawMessage));
            setMessages(cleanedMessages);
        }
    }

    // Starts a subscription to actively listen to database changes for that group and sets the incoming message when there is one
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

    // Scrolls to the end of the screen
    const handleAutoScroll = () =>{
        scrollViewRef.current.scrollToEnd({ animated: true });
    };

    // Scrolls to the end of the screen when a user uses keyboard
    const handleTextInputFocus = () => {
        setTimeout(() => {
            handleAutoScroll();
        }, 300);
    };

    // Sends the message and resets the input
    async function handleSendMessage(){
        const grpID = await getGID();
        const userID = await getUUID();
        const sendResult = await sendMessage(userID,grpID,newMessage);
        setNewMessage('');
    }

    // Gets the group name and sets it
    const getGroupData = async () => {
        const gid = await getGID();
        if (gid){
            const group = new Group(gid);
            const groupData = await group.getGroupDetails();
            if (groupData){
                setGroupName(groupData[0].group_name);
            }
        }
    };


    useEffect(() => {
        fetchPreviousCleanedMessages();
        scrollViewRef.current.scrollToEnd({ animated: true });
    }, []);

    // Open up a subscription to the group_chat table
    useEffect(() => {
        openSubscription();
    }, []);


    // Checks if the rawIncomingMessage has something then take it out append it to the current messages then remove the message
    // The deps part is to tell this useEffect to run everytime incomingRawMessage changes
    useEffect(() => {
        const processMessages = async () => {
            if (incomingRawMessage) {
                // Use Promise.all to process messages in parallel
                const cleanedMessage = await parseRawMessage(incomingRawMessage);
                setMessages((prevMessages) => [...prevMessages, cleanedMessage]);
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

    // Functions that will start when the uses enters the page again
    useFocusEffect(
        useCallback(() => {
            fetchPreviousCleanedMessages();
            openSubscription();
            handleAutoScroll();
            getGroupData();
        }, [])
    );

    // Allows the back button on android phone will direct to the correct page
    useFocusEffect(
        useCallback(()=>{
            const backHandler = BackHandler.addEventListener("hardwareBackPress", handleAndroidBackButtonPress);

            return () => {
                backHandler.remove();
            };
        },[])
    )




    return (

        <SafeAreaView style={styles.gc_container}>
            <View style={styles.groupheader}>
                <View>
                    <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal:'5%' }}>
                    <Text style={{ ...styles.headerText}}>
                        {groupName}
                    </Text>
                </View>
            </View>
            <View style={styles.gc_messageListContainer} >
                <ScrollView contentContainerStyle={styles.gc_scrollViewContent} ref={scrollViewRef} onContentSizeChange={handleAutoScroll}>
                    {messages.map((message, index) => (
                        <View key={index} style={styles.gc_messageContainer}>
                            <Text style={styles.gc_receivedName}>{message.user_name} ({message.time_stamp})</Text>
                            <Text style={styles.gc_receivedMessage}>{message.message}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <KeyboardAvoidingView style={styles.gc_inputContainer}>
                <TextInput
                    style={styles.gc_textInput}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor= "#E6E6FA"
                    onFocus={handleTextInputFocus}
                    multiline={true}
                    numberOfLines={1}
                />
                <TouchableOpacity
                    style={styles.gc_sendButton}
                    onPress={handleSendMessage}
                >
                    <Text style={styles.gc_sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}