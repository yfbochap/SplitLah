import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Group } from '../../classes/group';
import { Bill } from '../../classes/bill';
import { getGID } from "@/services/accountService";
import CustomCheckbox from '../../assets/checkbox'; // Adjust the import path as needed
import styles from '../../assets/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import {router} from 'expo-router';

export default function AddBill() {

  const handleBackButtonPress = () => {
    router.navigate('group');
  };

  function handleAndroidBackButtonPress(){
    router.navigate("group");
    return true;
  }

  //Declares block-scoped variables
  const [amount, setAmount] = useState('');
  const [BillTitle, setBillTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({}); // State for selected members (via the checkboxes)
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [selectedPaidBy, setSelectedPaidBy] = useState(null); // State for selected paid by user
  const [amounts, setAmounts] = useState({}); // State for individual amounts

  //Function to retrieve list of group members
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


  // useEffect(() => {
  //   fetchGroupMembers();
  // }, []);

  // Retrieves data on group members and resets form fields when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchGroupMembers();
      // Reset form fields
      setAmount('');
      setBillTitle('');
      setDate(new Date());
      setShow(false);
      setSelectedMembers({});
      setShowDropdown(false);
      setSelectedPaidBy(null);

      //Function to handle the android hardware back button being pressed
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleAndroidBackButtonPress);
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  // Function to handle changes in amount input
  const handleAmountChange = (text) => {
    let formattedAmount = text.replace(/[^0-9.]/g, '');
    formattedAmount = formattedAmount.replace(/(\..*)\./g, '$1');
    setAmount(formattedAmount);

    // Update individual amounts based on the number of selected members (this one helps change the individual amount for users when the total amount is changed)
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

  // Function to handle title changes
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

      // Update individual amounts based on the number of selected members (this one helps the change the individual amounts per member whenever a checkbox is selected/deselected)
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
      const paidByUserId = selectedPaidBy.user_id; // Set the user ID of the user who paid the bill
      const selectedUserIds = Object.keys(selectedMembers).filter((userId) => selectedMembers[userId]);
      const balanceIds = Object.keys(selectedMembers).filter((userId) => selectedMembers[userId] && userId !== paidByUserId);
      const currentDate = date.toISOString(); // Convert date to ISO format for storage
      const filteredAmounts = Object.fromEntries(Object.entries(amounts).filter(([userId, amount]) => amount !== '' && userId !== paidByUserId)) as { [userId: string]: string };


      try {
        const result = await group.createBillUsingGroupID(amount, BillTitle, currentDate, paidByUserId);
        if (result) {
          // console.log('Bill Created Successfully');
          const bill = new Bill(result);

          const addBillParticipants = await bill.StoreBillParticipants(selectedUserIds);
          // if(addBillParticipants){
          //   console.log('Bill Participants Stored Successfully');
          // }

          const addBillBalances = await bill.StoreBillBalances(gid, balanceIds, filteredAmounts, paidByUserId);
          // if(addBillBalances){
          //   console.log('Bill Balances Stored Successfully');
          // }

      //   } else {
      //     console.error('Failed to create bill.');
      //   }
        }}catch (error) {
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
    const totalAmount = Object.values(amounts).reduce((sum, value) => sum + parseFloat(value || 0), 0).toFixed(2);
    if (totalAmount !== parseFloat(amount).toFixed(2)) {
      const difference = totalAmount - parseFloat(amount)
      const differenceString = difference.toFixed(2)
      console.log(amounts, '|', totalAmount, '|', amount, '|', parseFloat(amount));
      Alert.alert('Error', `The sum of the individual amounts does not match the total amount. There is a difference of ${differenceString}.`);
      return;
    }

    createBill();
    router.navigate('group');
  };

  //Function to select all members in the group as bill participants (checks all boxes)
  const checkAllMembers = () => {
    // Create a new object with all members selected
    const updatedSelectedMembers = {};
    const updatedAmounts = {};
  
    groupMembers.forEach(member => {
      updatedSelectedMembers[member.user_id] = true;
      updatedAmounts[member.user_id] = (parseFloat(amount) / groupMembers.length).toFixed(2);
    });
  
    setSelectedMembers(updatedSelectedMembers);
    setAmounts(updatedAmounts);
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
            editable={false} // Raw text is not allowed, a user must be selected from the dropdown box
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

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.descText}>Bill Involves</Text>
          <TouchableOpacity onPress={checkAllMembers}>
            <Text style={{...styles.descText, color: 'white'}}>Select All Members</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.membersList}>
        {groupMembers.map((member) => (
          <CustomCheckbox
            key={member.user_id}
            label={member.user_name}
            isChecked={selectedMembers[member.user_id]}
            onChange={() => handleCheckboxChange(member.user_id)}
            amount={amounts[member.user_id]}
            onAmountChange={(text) => handleIndividualAmountChange(member.user_id, text)}
          /> //Updates the relevant variables whenever a checkbox is checked
        ))}
        </ScrollView>
        <TouchableOpacity style={{ ...styles.loginButton, backgroundColor: 'purple' }} onPress={handleSubmit}>
          <Text style={{ fontSize: 26, color: 'white', textAlign: 'center' }}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
