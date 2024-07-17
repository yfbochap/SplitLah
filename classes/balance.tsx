import { supabase } from '../hooks/supabase';
import { User } from './user';
import { View, Text, FlatList, StyleSheet } from 'react-native';
interface Balance {
    id: string;
    amount: number;
    userId: string;
    owedTo: string;
}
  
interface GroupBalance {
    group_id: string;
    balance: Array<Balance>;
}
interface BalanceData {
  [key: string]: number;
}

interface FormattedData {
  value: number;
  label: string;
}
interface Owedmoney {
  amount: number;
  owedTo: string;
  userName: string;
}
// gets the balance in each group based on the groupid of the group
export const getGroupBalance = async (groupId: string): Promise<{ userName: string; owedTo: string; amount: number }[]> => {
    const { data, error } = await supabase
      .from('balances')
      .select('user_id, owed_to, amount')
      .eq('group_id', groupId);
  
    if (error) {
      console.error(error);
      return [];
    }
  
    const balances: { userName: string; owedTo: string; amount: number }[] = [];

    for (const bill of data) {
      const lenderId = bill.owed_to;
      const lender = new User(lenderId);
      const lenderName1 = await lender.getUserName();
      const lenderName = lenderName1[0].user_name;
      const borrowerId = bill.user_id;
      const borrower = new User(borrowerId);
      const borrowerName1 = await borrower.getUserName();
      const borrowerName = borrowerName1[0].user_name;
      const amount = bill.amount;
  
      balances.push({ userName: borrowerName, owedTo: lenderName, amount });
      balances.push({ userName: lenderName, owedTo: borrowerName, amount: -amount });
    }

    return balances;
  };


export const getOverallGroupBalance = (balances: { userName: string; owedTo: string; amount: number }[]) => {
    const overallBalances: { [userId: string]: number } = {};

    balances.forEach((balance) => {
        const userName = balance.userName;
        const amount = balance.amount;

        if (overallBalances[userName]) {
        overallBalances[userName] += -amount;
        } else {
        overallBalances[userName] = -amount;
        }
    });

    return overallBalances;
  };

  export const getUserBalanceMessage = (overallBalances: { [userId: string]: number }, userId: string) => {
    const userBalance = overallBalances[userId];
  
    if (userBalance!== undefined) {
      if (userBalance < 0) {
        return `You owe $${Math.abs(userBalance)} amount of money`;
      } else if (userBalance > 0) {
        return `You are owed $${userBalance} amount of money`;
      }
    } else {
      return `You are not owed any money`;
    }
  };
 
export const transformData = (data: BalanceData): FormattedData[] => {
  return Object.entries(data).map(([label, value]) => {
    const positiveValue = Math.abs(value);
    return {
      value: positiveValue,
      label,
      frontColor: value > 0 ? 'green' : 'red', // Set frontColor based on original value
      labelTextStyle: { color: 'white' }
    };
  });
};
const GroupBalanceList: React.FC = () => {
  const renderItem = ({ item }: { item: Owedmoney }) => {
    const positiveValue = Math.abs(item.amount);
    const textColor = item.amount > 0 ? 'green' : 'red';

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>
          {item.userName} owes {item.owedTo}
        </Text>
        <Text style={[styles.itemValue, { color: textColor }]}>
          {positiveValue}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={OwedMoney}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  itemText: {
    fontSize: 16
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default GroupBalanceList;
