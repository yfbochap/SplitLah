import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
  user_id: string;
}

interface Balances {
  bill_id: string;
  group_id: string;
  debtor_id: string;
  amount: string;
  creditor_id: string;
}

const BillScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [participants, setParticipants] = useState<BillParticipantNames[] | null>(null);
  const [owner, setOwner] = useState(String);
  const [ownerAmount, setOwnerAmount] = useState<number | null>(null);
  const [participantAmounts, setParticipantAmounts] = useState<{ [userId: string]: number }>({});

  const handleBackButtonPress = () => {
    router.navigate('group');
  };

  const handleEditButtonPress = () => {
    router.navigate('updatebill');
  };

  const handleDelete = async () => {
    const billID = await getBID();
    if(billID){
      const billToDelete = new Bill(billID);
      await billToDelete.DeleteBill();
    }
    router.navigate('group');
  };

  const fetchBillData = useCallback(async () => {
    try {
      const billID = await getBID();
      if (billID) {
        const bill = new Bill(billID);
        const details = await bill.getBillDetails();
        const participants = await bill.getBillParticipantsNames();
        const owner = await bill.getBillOwnerNameViaBillID();
        const ownerAmount = await bill.GetOwnerSum();
        const balances: Balances[] = await bill.GetBillBalances();

        if (details) {
          setBillDetails(details[0]);
        }
        setParticipants(participants && participants.length > 0 ? participants : []);
        if (owner !== null) {
          setOwner(owner);
        }
        if (ownerAmount !== null) {
          setOwnerAmount(ownerAmount);
        }

        const amounts: { [userId: string]: number } = {};
        balances.forEach((balance) => {
          amounts[balance.debtor_id] = parseFloat(balance.amount);
        });
        setParticipantAmounts(amounts);
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

  useEffect(() => {
    fetchBillData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.billHeader}>
        <View style={{ marginTop: 10 }}>
          <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', maxWidth: 300, marginTop: 50 }}>
          <Text style={styles.billHeaderText}>{billDetails ? billDetails.name : ''}</Text>
        </View>
        <View style={{ marginTop: 15, marginRight: 15}}>
          <TouchableOpacity onPress={handleEditButtonPress}>
            <Text style={styles.billEditButton}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ ...styles.billHeader, justifyContent: 'space-between', height: 70 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Text style={{ ...styles.billEditButton, padding: 12 }}>
            Paid By: {owner}
          </Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Text style={{ ...styles.billEditButton, padding: 12 }}>{billDetails ? billDetails.date : ''}</Text>
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
                  <Text style={{ ...styles.chatText1, textAlign: 'right', marginBottom: 4 }}>
                    {participant.user_name == owner
                      ? `$${ownerAmount?.toFixed(2) ?? '0.00'}`
                      : `$${participantAmounts[participant.user_id]?.toFixed(2) ?? '0.00'}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.descBillText}>No participants found.</Text>
        )}
      </ScrollView>

      <View style={{...styles.GroupIDContainer, }}>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{ ...styles.groupidtext }}>
            Delete Bill
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default BillScreen;
