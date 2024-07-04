import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker, { DateTimePickerEvent, Event } from '@react-native-community/datetimepicker';
import styles from '../../assets/styles';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}
