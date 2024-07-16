import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState('');

    // Removes the text after sending message
    const handleSend = () => {
        if (message.trim().length > 0) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                onSubmitEditing={handleSend}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});

export default MessageInput;