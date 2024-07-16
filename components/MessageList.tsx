import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MessageList = ({ messageList }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={messageList}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{item.user_name}: {item.message}</Text>
                    </View>
                )}
                // keyExtractor={(item) => item.time_stamp.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageContainer: {
        // marginVertical: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    messageText: {
        fontSize: 16,
        color: "grey"
    },
});

export default MessageList;