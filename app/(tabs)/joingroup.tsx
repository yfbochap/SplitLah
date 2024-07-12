import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../assets/styles';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  navigation: any;
}

const JoinGroupPage: React.FC<Props> = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const navigate = useNavigation();
  const handleJoinGroup = async () => {
    setJoining(true);
    try {
      // Call API or perform joining logic here
      console.log('Joining group with code:', code);
      // Simulate a successful join
      setTimeout(() => {
        setJoining(false);
        alert('You have successfully joined the group!');
      }, 2000);
    } catch (error) {
      setError(error.message);
      setJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={() => navigate.goBack()} />
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
          
          placeholder="Click to enter 8-digit code"
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
          <Text style={{ fontSize: 26, color: "white", textAlign: 'center' }}> SUBMIT </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JoinGroupPage;