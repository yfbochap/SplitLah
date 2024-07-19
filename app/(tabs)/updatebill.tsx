import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Group } from '../../classes/group';
import { Bill } from '../../classes/bill';
import { getGID, getBID } from "@/services/accountService";
import CustomCheckbox from '../../assets/checkbox'; // Adjust the import path as needed
import styles from '../../assets/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

interface BillDetails {
  bill_id: string;
  name: string;
  date: Date;
  amount: string;
  user_id: string;
}

interface BalanceDetails {
  bill_id: string;
  group_id: string;
  debtor_id: string;
  amount: string;
  creditor_id: string;
}

export default function EditBill() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.navigate('group');
  };

  const [amount, setAmount] = useState('');
  const [billTitle, setBillTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState<{ [userId: string]: boolean }>({});
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [selectedPaidBy, setSelectedPaidBy] = useState(''); // State for selected paid by user
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [balanceDetails, setBalanceDetails] = useState<BalanceDetails[]>([]); // Changed to array for multiple balances
  const [paidByName, setPaidByName] = useState(''); // State for storing the bill owner's name
  const [amounts, setAmounts] = useState<{ [userId: string]: string }>({}); // State for individual amounts

  const [forceUpdate, setForceUpdate] = useState(false);

const updateComponent = () => {
  setForceUpdate(prevState => !prevState);
};

useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      try {
        const gid = await getGID();
        if (gid) {
          const group = new Group(gid);
          const members = await group.getUsersBasedOnGroup();
          setGroupMembers(members);

          const bid = await getBID();
          if (bid) {
            const bill = new Bill(bid);
            const data = await bill.getBillDetails();
            if (data && data.length > 0) {
              const billDetail = data[0];
              setBillDetails(billDetail);
              setAmount(parseFloat(billDetail.amount).toFixed(2));
              setBillTitle(billDetail.name);
              setDate(new Date(billDetail.date));
              setSelectedPaidBy(billDetail.user_id);

              const ownerName = await bill.getBillOwnerNameViaBillID();
              if (ownerName) {
                setPaidByName(ownerName);
              }

              const balances = await bill.GetBillBalances();
              if (balances) {
                setBalanceDetails(balances);

                const initialAmounts = balances.reduce((acc, balance) => {
                  acc[balance.debtor_id] = parseFloat(balance.amount).toFixed(2);
                  return acc;
                }, {});

                const ownerAmount = await bill.GetOwnerSum();
                if (ownerAmount !== undefined) {
                  initialAmounts[billDetail.user_id] = ownerAmount.toFixed(2);
                  setAmounts(initialAmounts);
                }

                // Ensure `balanceDetails` and `billDetails` are updated before setting `initialSelectedMembers`
                const initialSelectedMembers = members.reduce((acc, member) => {
                  const foundBalance = balances.find(balance => balance.debtor_id === member.user_id);
                  acc[member.user_id] = foundBalance !== undefined;
                  return acc;
                }, {});

                console.log('1', initialSelectedMembers);
                console.log('2', billDetail);

                const isOwnerParticipant = await bill.isOwnerBillParticipant();
                if (isOwnerParticipant && billDetail) {
                  initialSelectedMembers[billDetail.user_id] = true;
                }

                console.log('3', initialSelectedMembers);
                setSelectedMembers(initialSelectedMembers);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch data.', error);
      }
    };

    fetchData();
  }, [])
);
  

  // Function to handle changes in amount input
  const handleAmountChange = (text) => {
    let formattedAmount = text.replace(/[^0-9.]/g, '');
    formattedAmount = formattedAmount.replace(/(\..*)\./g, '$1');
    setAmount(formattedAmount);
  };

  // Function to handle title change
  const handleTitleChange = (text) => {
    setBillTitle(text);
    console.log('6 happens');
  };

  // Function to handle date picker changes
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Function to show date picker
  const showDatepicker = () => {
    setShow(true);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prevSelectedMembers) => {
      const updatedSelectedMembers = {
        ...prevSelectedMembers,
        [userId]: !prevSelectedMembers[userId],
      };

      // Update amounts
      const selectedCount = Object.values(updatedSelectedMembers).filter(Boolean).length;
      if (selectedCount > 0) {
        const splitAmount = (parseFloat(amount) / selectedCount).toFixed(2);
        const updatedAmounts = Object.keys(updatedSelectedMembers).reduce((acc, uid) => {
          if (updatedSelectedMembers[uid]) {
            acc[uid] = splitAmount;
          } else {
            acc[uid] = '';
          }
          return acc;
        }, {});
        setAmounts(updatedAmounts);
      }

      return updatedSelectedMembers;
    });
  };

  // Function to handle amount change for individual checkboxes
  const handleIndividualAmountChange = (userId, text) => {
    let formattedAmount = text.replace(/[^0-9.]/g, '');
    formattedAmount = formattedAmount.replace(/(\..*)\./g, '$1');
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [userId]: formattedAmount,
    }));
  };

  // Function to handle selection of paid by user
  const handlePaidBySelect = (member) => {
    setSelectedPaidBy(member.user_id);
    setPaidByName(member.user_name);
    setShowDropdown(false); // Close dropdown after selection
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to update bill
  const updateBill = async () => {
    const bid = await getBID();
    const gid = await getGID();
    if (bid) {
      const bill = new Bill(bid);
      const paidByUserId = selectedPaidBy; // Set the user ID of the user who paid the bill
      const selectedUserIds = Object.keys(selectedMembers).filter((userId) => selectedMembers[userId]);
      const currentDate = date.toISOString(); // Convert date to ISO format for storage
      const balanceIds = Object.keys(selectedMembers).filter((userId) => selectedMembers[userId] && userId !== paidByUserId);

      try {
        const result = await bill.updateBillUsingBillID(amount, billTitle, currentDate, paidByUserId);
        if (!result) {
          console.error('Failed to update bill.');
          return;
        }

        console.log('Bill Updated Successfully');

        // Delete old bill participants and store updated ones
        const deleteOldBillParticipants = await bill.DeleteBillParticipants();
        if (!deleteOldBillParticipants) {
          console.error('Failed to delete old bill participants.');
          return;
        }

        const addBillParticipants = await bill.StoreBillParticipants(selectedUserIds);
        if (!addBillParticipants) {
          console.error('Failed to add bill participants.');
          return;
        }

        console.log('Bill Participants Updated Successfully');

        // Update balances based on new amounts
        const filteredAmounts = Object.fromEntries(Object.entries(amounts).filter(([userId, amount]) => amount !== '' && userId !== paidByUserId)) as { [userId: string]: string };

        const deleteBillBalances = await bill.DeleteBillBalances();
        if (!deleteBillBalances) {
          console.log('Failed to delete bill balances.');
        }

        const addBillBalances = await bill.StoreBillBalances(gid, balanceIds, filteredAmounts, paidByUserId);
        if (!addBillBalances) {
          console.error('Failed to add bill balances.');
          return;
        }

        console.log('Bill Balances Updated Successfully');

        // Optionally navigate to a confirmation screen or perform another action
        navigation.navigate('group'); // Navigate after updating bill
      } catch (error) {
        console.error('Error updating bill:', error.message);
      }
    } else {
      console.error('Failed to get bill ID.');
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Check if all required fields are filled
    if (!billTitle || !amount || !selectedPaidBy || Object.values(selectedMembers).filter(Boolean).length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one member.');
      return;
    }

    // Check if the sum of amounts matches the main amount
    const totalAmount = Object.values(amounts).reduce((sum, value) => sum + parseFloat(value || '0'), 0);
    if (totalAmount !== parseFloat(amount)) {
      Alert.alert('Error', 'The sum of the individual amounts does not match the total amount.');
      return;
    }

    updateBill();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        <Text style={styles.headerText}>Edit Bill</Text>
      </View>
      <View>
        <Text style={styles.descText}>Title</Text>
        <TextInput style={styles.inputText} value={billTitle} onChangeText={handleTitleChange} />

        <Text style={styles.descText}>Amount</Text>
        <TextInput style={styles.inputText} inputMode='numeric' value={amount} onChangeText={handleAmountChange} />

        <Text style={styles.descText}>Date</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <Text style={styles.descText}>Paid By</Text>
        {/* Paid By TextInput with Dropdown */}
        <TouchableOpacity
          style={styles.currencyInputContainer}
          onPress={toggleDropdown}
        >
          <TextInput
            style={styles.currencyInput}
            placeholder="Select paid by..."
            value={paidByName}
            editable={false}
          />
        </TouchableOpacity>
        {showDropdown && (
          <ScrollView style={styles.popup}>
            {groupMembers.map((member) => (
              <TouchableOpacity
                key={member.user_id}
                style={styles.currencyButton}
                onPress={() => handlePaidBySelect(member)}
              >
                <Text style={styles.currencyText}>{member.user_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.descText}>Bill Involves</Text>
        <ScrollView style={customStyles.membersList}>
          {groupMembers.map((member) => (
            <CustomCheckbox
              key={member.user_id}
              label={member.user_name}
              isChecked={selectedMembers[member.user_id]}
              onChange={() => handleCheckboxChange(member.user_id)}
              amount={amounts[member.user_id]}
              onAmountChange={(text) => handleIndividualAmountChange(member.user_id, text)}
            />
          ))}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={{ ...styles.loginButton, backgroundColor: 'purple' }}
          onPress={handleSubmit}
        >
          <Text style={{ fontSize: 26, color: 'white', textAlign: 'center' }}> SUBMIT </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const customStyles = StyleSheet.create({
  membersList: {
    maxHeight: 200, // Adjust the height as needed
    borderWidth: 1,
    borderTopColor: '#ccc',
    marginHorizontal: 24,
  },
});
