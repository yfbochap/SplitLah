import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker, { DateTimePickerEvent, Event } from '@react-native-community/datetimepicker';

export default function addbill() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const [amount, setAmount] = useState('');

  const handleAmountChange = (text: string) => {
    // Remove non-numeric and non-decimal characters using regex
    let formattedAmount = text.replace(/[^0-9.]/g, '');

    // Remove multiple decimal points
    formattedAmount = formattedAmount.replace(/(\..*)\./g, '$1');

    setAmount(formattedAmount);
  };

  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        <Text style={styles.headerText}>Add Bill</Text>
      </View>
      <View>
        <Text style={styles.descText}>Title</Text>
        <TextInput style={styles.inputText}></TextInput>

        <Text style={styles.descText}>Amount</Text>
        <TextInput style={styles.inputText} inputMode='numeric' value={amount} onChangeText={handleAmountChange}></TextInput>

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
        <TextInput style={styles.inputText}></TextInput>

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
  dateText: {
    color: 'white',
    fontSize: 20,
  },
  dateInput: {
    paddingHorizontal: 8,
    // paddingVertical: 12,
    marginHorizontal: 24,
    borderBottomColor: 'purple',
    borderBottomWidth: 2,
    marginBottom: 8,
  },
});
