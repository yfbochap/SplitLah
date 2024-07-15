import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Group } from '../../classes/group';
import { Bill } from '../../classes/bill';
import { getGID } from "@/services/accountService";
import CustomCheckbox from '../../assets/checkbox'; // Adjust the import path as needed
import styles from '../../assets/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useRouter } from 'expo-router';

export default function AddBill() {
  const router = useRouter();

  const handleBackButtonPress = () => {
    router.navigate('group');
  };

  const [amount, setAmount] = useState('');
  const [BillTitle, setBillTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [selectedPaidBy, setSelectedPaidBy] = useState(null); // State for selected paid by user
  const [amounts, setAmounts] = useState({}); // State for individual amounts

  const fetchGroupMembers = async () => {
    try {
      const gid = await getGID();
      if (gid) {
        const group = new Group(gid);
        const members = await group.getUsersBasedOnGroup();
        setGroupMembers(members);
        const initialSelectedMembers = members.reduce((acc, member) => {
          acc[member.user_id] = false; // Deselect all members by default
          return acc;
        }, {});
        setSelectedMembers(initialSelectedMembers);
      }
    } catch (e) {
      console.error('Failed to fetch group members.', e);
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, []);

  // Reset form fields when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset form fields
      setAmount('');
      setBillTitle('');
      setDate(new Date());
      setShow(false);
      setSelectedMembers({});
      setShowDropdown(false);
      setSelectedPaidBy(null);

      // Optionally re-fetch group members if needed
      fetchGroupMembers();
    }, [])
  );

  // Function to handle changes in amount input
  const handleAmountChange = (text) => {
    let formattedAmount = text.replace(/[^0-9.]/g, '');
    formattedAmount = formattedAmount.replace(/(\..*)\./g, '$1');
    setAmount(formattedAmount);

    // Update individual amounts based on the number of selected members
    const selectedCount = Object.values(selectedMembers).filter(Boolean).length;
    if (selectedCount > 0) {
      const splitAmount = (parseFloat(formattedAmount) / selectedCount).toFixed(2);
      const updatedAmounts = Object.keys(selectedMembers).reduce((acc, userId) => {
        if (selectedMembers[userId]) {
          acc[userId] = splitAmount;
        } else {
          acc[userId] = '';
        }
        return acc;
      }, {});
      setAmounts(updatedAmounts);
    }
  };

  const handleTitleChange = (text) => {
    setBillTitle(text);
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
    setSelectedPaidBy(member);
    setShowDropdown(false); // Close dropdown after selection
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to create bill
  const createBill = async () => {
    const gid = await getGID();
    if (gid) {
      const group = new Group(gid);
      const selectedUserIds = Object.keys(selectedMembers).filter((userId) => selectedMembers[userId]);
      const currentDate = date.toISOString(); // Convert date to ISO format for storage
      const paidByUserId = selectedPaidBy.user_id; // Set the user ID of the user who paid the bill

      try {
        const result = await group.createBillUsingGroupID(amount, BillTitle, currentDate, paidByUserId);
        if (result) {
          console.log('Bill Created Successfully');
          const bill = new Bill(result);
          const addBillParticipants = await bill.StoreBillParticipants(selectedUserIds);
          //FILL IN FUNC HERE
          if(addBillParticipants){
            console.log('Bill Participants Stored Successfully');
          }
          // Optionally navigate to a confirmation screen or perform another action
        } else {
          console.error('Failed to create bill.');
        }
      } catch (error) {
        console.error('Error creating bill:', error.message);
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Check if all required fields are filled
    if (!BillTitle || !amount || !selectedPaidBy || Object.values(selectedMembers).filter(Boolean).length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one member.');
      return;
    }

    // Check if the sum of amounts matches the main amount
    const totalAmount = Object.values(amounts).reduce((sum, value) => sum + parseFloat(value || 0), 0);
    if (totalAmount !== parseFloat(amount)) {
      Alert.alert('Error', 'The sum of the individual amounts does not match the total amount.');
      return;
    }

    createBill();
    // Example: Navigate to another screen after submission
    // navigation.navigate('ConfirmationScreen');
    router.navigate('group');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        <Text style={styles.headerText}>Add Bill</Text>
      </View>
      <View>
        <Text style={styles.descText}>Title</Text>
        <TextInput style={styles.inputText} value={BillTitle} onChangeText={handleTitleChange}/>

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
            value={selectedPaidBy ? selectedPaidBy.user_name : ''}
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
        <ScrollView style={styles.membersList}>
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
        <TouchableOpacity style={{ ...styles.loginButton, backgroundColor: 'purple' }} onPress={handleSubmit}>
          <Text style={{ fontSize: 26, color: 'white', textAlign: 'center' }}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
