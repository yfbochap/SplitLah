import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';

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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
    marginTop: 50,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginLeft: 8,
  },
  descText: {
    color: 'grey',
    fontSize: 16,
    padding: 8,
    marginHorizontal: 24,
  },
  inputText: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 20,
    marginHorizontal: 24,
    borderBottomColor: 'purple',
    borderWidth: 2,
    marginBottom: 8,
  },
  currencyInputContainer: {
    marginHorizontal: 24,
    borderBottomColor: 'purple',
    borderWidth: 2,
    marginBottom: 8,
  },
  currencyInput: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 20,
  },
  popup: {
    maxHeight: 200,
    marginHorizontal: 24,
    borderWidth: 2,
    borderColor: 'purple',
    borderRadius: 5,
    marginBottom: 8,
  },
  currencyButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  currencyText: {
    fontSize: 16,
  },
});
