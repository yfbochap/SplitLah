import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomCheckbox = ({ label, isChecked, onChange, amount, onAmountChange }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity onPress={onChange} style={styles.checkbox}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
          {isChecked && <MaterialIcons name="check" size={20} color="#fff" />}
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
      {isChecked && (
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={onAmountChange}
          keyboardType="numeric"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000080',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White fill when unchecked
  },
  checkedCheckbox: {
    backgroundColor: '#800080', // Purple fill when checked
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff', // Set the text color to white
    flex: 1, // Make label take up remaining space
  },
  amountInput: {
    width: 60, // Adjust width as needed
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default CustomCheckbox;
