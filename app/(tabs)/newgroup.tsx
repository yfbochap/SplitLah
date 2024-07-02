import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../assets/styles';

export default function NewGroup() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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
    setSelectedCurrency(currency);
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        <Text style={styles.headerText}>Create New Group</Text>
      </View>
      <View>
        <Text style={styles.descText}>Group Name</Text>
        <TextInput style={styles.inputText}></TextInput>

        <Text style={styles.descText}>Description</Text>
        <TextInput style={styles.inputText}></TextInput>

        <Text style={styles.descText}>Currency</Text>
        <TouchableOpacity
          style={styles.currencyInputContainer}
          onPress={handleInputFocus}
        >
          <TextInput
            style={styles.currencyInput}
            placeholder="Select currency..."
            editable={!selectedCurrency}
            onFocus={handleInputFocus}
            onBlur={() => setIsInputFocused(false)}
            value={selectedCurrency || ''}
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
      </View>
    </SafeAreaView>
  );
}
