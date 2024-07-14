import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ListRenderItem, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../assets/styles';
import { getBID } from '@/services/accountService';
import { Bill } from '../../classes/bill';
import { useRouter } from 'expo-router';

interface BillDetails {
  bill_id: string;
  name: string;
  date: string;
  amount: string;
  user_id: string;
}

interface BillParticipantNames {
  user_name: string;
}

const BillScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [participants, setParticipants] = useState<BillParticipantNames[] | null>(null);
  const [owner, setOwner] = useState('');

  const handleBackButtonPress = () => {
    router.navigate('group');
  };

  const handleEditButtonPress = () => {
    router.navigate('updatebill');
  };

  const fetchBillData = useCallback(async () => {
    try {
      const billID = await getBID();
      if (billID) {
        const bill = new Bill(billID);
        const details = await bill.getBillDetails();
        const participants = await bill.getBillParticipantsNames();
        const owner = await bill.getBillOwnerNameViaBillID();
        console.log('Details', details);
        console.log('Participants', participants);
        console.log('Owner', owner);

        if (details) {
          setBillDetails(details[0]);
        }
        if (participants && participants.length > 0) {
          setParticipants(participants);
        }
        if (owner) {
            setOwner(owner);
        }
      } else {
        console.log('Bill ID not found.');
        navigation.goBack();
      }
    } catch (e) {
      console.error('Failed to load bill data.', e);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchBillData();
    }, [fetchBillData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.billHeader}>
        <View style={{ marginTop: 10}}>
          <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', maxWidth: 300, marginTop: 50 }}>
          <Text style={styles.billHeaderText}>{billDetails ? billDetails.name : ''}</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <TouchableOpacity onPress={handleEditButtonPress}>
            <Text style={styles.billEditButton}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{...styles.billHeader, justifyContent: 'space-between', height: 70}}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Text style={{...styles.billEditButton, padding: 12}}>Paid By: {owner}</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Text style={{...styles.billEditButton, padding: 12}}>{billDetails ? billDetails.date : ''}</Text>
        </View>
      </View>

      <View style={{ height: 40, marginBottom: 10, marginTop: 20 }}>
        <Text style={{ ...styles.descBillText }}>Bill Participants:</Text>
      </View>

      <ScrollView style={styles.chatList}>
        {participants && participants.length > 0 ? (
          participants.map((participant, index) => (
            <TouchableOpacity style={styles.chatItem} key={index}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.chatText1}>{participant.user_name}</Text>
                </View>
                <View>
                  <Text style={{ ...styles.chatText1, textAlign: 'right', marginBottom: 4 }}>$*insert amt here*</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.descBillText}></Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillScreen;
