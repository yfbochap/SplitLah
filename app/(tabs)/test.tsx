import React from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';

interface Balance {
  id: string;
  name: string;
  amount: number;
  payer: string;
  receiver: string;
}

const balances: Balance[] = [
  { id: '1', name: 'Alice', amount: 20, payer: 'Alice', receiver: 'Bob' },
  { id: '2', name: 'Bob', amount: -15, payer: 'Charlie', receiver: 'Alice' },
  { id: '3', name: 'Charlie', amount: 30, payer: 'Alice', receiver: 'Charlie' },
  { id: '4', name: 'Dave', amount: -10, payer: 'Dave', receiver: 'Alice' },
  // Add more balances as needed
];

const BalanceBar: React.FC<{ balance: Balance }> = ({ balance }) => {
  const isPositive = balance.amount >= 0;
  const barStyle = isPositive ? styles.positiveBar : styles.negativeBar;

  return (
    <View style={styles.balanceContainer}>
      {!isPositive && <Text style={styles.userName}>{balance.name}</Text>}
      <View style={styles.barWrapper}>
        <View style={[styles.bar, barStyle, { width: `${Math.abs(balance.amount)}%` }]} />
        <View style={styles.divider} />
      </View>
      {isPositive && <Text style={styles.userName}>{balance.name}</Text>}
    </View>
  );
};

const calculateTotalBalance = (balances: Balance[]): number => {
  return balances.reduce((total, item) => total + item.amount, 0);
};

export default function BalancesScreen() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const renderBalanceBarItem: ListRenderItem<Balance> = ({ item }) => <BalanceBar balance={item} />;
  const renderBalanceItem: ListRenderItem<Balance> = ({ item }) => (
    <View style={styles.balanceItem}>
      <Text style={styles.balanceText}>
        {item.payer} owes {item.receiver} ${item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton tintColor="white" onPress={handleBackButtonPress} />
        <Text style={styles.headerText}>Balances</Text>
      </View>
      <View style={styles.barChartContainer}>
        <FlatList
          data={balances}
          renderItem={renderBalanceBarItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.barList}
        />
      </View>
      <FlatList
        data={balances}
        renderItem={renderBalanceItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total Balance: ${calculateTotalBalance(balances)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'purple',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 16,
  },
  barChartContainer: {
    paddingVertical: 20,
  },
  barList: {
    paddingVertical: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'center',
  },
  userName: {
    width: 80,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bar: {
    height: 20,
  },
  positiveBar: {
    backgroundColor: 'green',
    marginLeft: 2,
  },
  negativeBar: {
    backgroundColor: 'red',
    marginRight: 2,
  },
  divider: {
    width: 2,
    height: 20,
    backgroundColor: '#000',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  balanceText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
