import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../hooks/supabase';
import styles from '../../assets/styles';
import { useRouter, useFocusEffect } from 'expo-router'; // Import useFocusEffect
import * as SecureStore from 'expo-secure-store';
import { Group } from '@/classes/group';
import { getGID, storeGID } from '@/services/accountService';

export default function EditGroup() {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      const currenciesList: string[] = Object.keys(data.rates);
      setCurrencies(currenciesList);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const filterCurrencies = () => {
    return currencies.filter((currency) =>
      currency.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency); // Set the selected currency
    setSearchQuery(''); // Clear the search query
    setIsInputFocused(false); // Hide the currency list
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    setSelectedCurrency(null); // Clear selected currency when typing
  };

  const handleSubmit = async (): Promise<void> => {
    const userId: string | null = await SecureStore.getItemAsync('user_uuid');

    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    if (!groupName) {
        Alert.alert('Error', 'Please enter a group name');
        return;
      }

    if (!selectedCurrency) {
      Alert.alert('Error', 'Currency is not selected');
      return;
    }

    const result = await editGroup(groupName, description, selectedCurrency);
    if (result) {
      router.navigate("group");  // Navigate to group page after successful creation
    }
  };

  const editGroup = async (groupName: string, description: string, currency: string) => {
    try {
      const gid = await getGID();
      const { data: groupData, error: groupError } = await supabase
        .from('group')
        .update([
          { group_name: groupName, description: description, currency: currency }
        ])
        .eq('group_id', gid);

      if (groupError) {
        throw groupError;
        return null;
      }
      return true;
      
    } catch (error) {
      console.error('Error updating group:', error);
      return null;
    }
  };

  const GetGroupDetails = async () => {
    const gid = await getGID();
    if (gid){
        const group = new Group(gid);
        const groupDetails = await group.getGroupDetails();
        if (groupDetails){
            setGroupName(groupDetails[0].group_name);
            setDescription(groupDetails[0].description);
            setSelectedCurrency(groupDetails[0].currency);
        }
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Reset form fields
      setSearchQuery('');
      setIsInputFocused(false);
      GetGroupDetails();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={()=>setIsInputFocused(false)}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={() => router.navigate('group')} />
        <Text style={styles.headerText}>Edit Group</Text>
      </View>
      <View>
        <Text style={styles.descText}>Group Name</Text>
        <TextInput
          style={styles.inputText}
          value={groupName}
          onChangeText={setGroupName}
        />

        <Text style={styles.descText}>Description</Text>
        <TextInput
          style={styles.inputText}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.descText}>Currency</Text>

        <TouchableOpacity
          style={styles.currencyInputContainer}
          onPress={handleInputFocus}
        >
          <TextInput
            style={styles.currencyInput}
            placeholder="Select currency..."
            onFocus={handleInputFocus}
            value={searchQuery || selectedCurrency || ''} // Show searchQuery if not empty, otherwise show selectedCurrency
            onChangeText={handleInputChange}
          />
        </TouchableOpacity>
        {isInputFocused && (
          <ScrollView style={styles.popup}>
            {filterCurrencies().map((currency) => (
              <TouchableOpacity
                key={currency}
                style={styles.currencyButton}
                onPress={() => handleCurrencySelect(currency)}
              >
                <Text style={styles.currencyText}>{currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View>
          <TouchableOpacity
            style={{ ...styles.loginButton, backgroundColor: 'purple' }}
            onPress={handleSubmit}
          >
            <Text style={{ fontSize: 26, color: "white", textAlign: 'center' }}> SUBMIT </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
