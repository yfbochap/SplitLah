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
  frontColor: string;
  labelTextStyle: { color: string };
}
interface Owedmoney {
  amount: number;
  owedTo: string;
  userName: string;
}
// gets the balance in each group based on the groupid of the group
export const getGroupBalance = async (groupId: string): Promise<{ userName: string; owedTo: string; amount: number }[]> => {
    const { data, error } = await supabase
      .from('balance')
      .select('debtor_id, creditor_id, amount')
      .eq('group_id', groupId);
  
    if (error) {
      console.error(error);
      return [];
    }
  
    const balances: { userName: string; owedTo: string; amount: number }[] = [];

    for (const bill of data) {
      const lenderId = bill.creditor_id;
      const lender = new User(lenderId);
      const lenderName = await lender.getUserName();
      const borrowerId = bill.debtor_id;
      const borrower = new User(borrowerId);
      const borrowerName = await borrower.getUserName();
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

export const getUserBalanceMessage = async (overallBalances: { [userName: string]: number }, userId: string) => {
    const user = new User(userId);
    const userName = await user.getUserName();
    const userBalance = overallBalances[userName];
  
    let message;
    if (userBalance !== undefined) {
      if (userBalance < 0) {
        message = `You owe $${Math.abs(userBalance)}`;
      } else if (userBalance > 0) {
        message = `You are owed $${userBalance}`;
      }
    } else {
      message = `You are not owed any money`;
    }
    return message; // <--- Add this return statement
  };
 
export const transformData = (data: BalanceData): FormattedData[] => {
  return Object.entries(data).map(([label, value]) => {
    const positiveValue = Math.abs(value);
    return {
      value: positiveValue,
      label,
      frontColor: value > 0 ? 'green' : 'red', // Set frontColor based on original value
      labelTextStyle: { color: 'white' },
    };
  });
};


export const findExactMatches = (positiveBalances: [string, number][], negativeBalances: [string, number][]) => {
  const exactMatches = [];

  for (let i = 0; i < positiveBalances.length; i++) {
    for (let j = 0; j < negativeBalances.length; j++) {
      if (positiveBalances[i][1] === Math.abs(negativeBalances[j][1])) {
        exactMatches.push({
          userName: negativeBalances[j][0],
          owedTo: positiveBalances[i][0],
          amount: positiveBalances[i][1],
        });

        positiveBalances.splice(i, 1);
        negativeBalances.splice(j, 1);

        i--;
        j--;
        break;
      }
    }
  }

  return exactMatches;
};

export const getTransactions = (overallBalances: { [userId: string]: number }) => {
  const positiveBalances = Object.entries(overallBalances).filter(([_, amount]) => amount > 0);
  const negativeBalances = Object.entries(overallBalances).filter(([_, amount]) => amount < 0);

  const transactions = [];

  // Find exact matches and add them to transactions
  const exactMatches = findExactMatches(positiveBalances, negativeBalances);
  transactions.push(...exactMatches);

  // Remove exact matches from positive and negative balances
  positiveBalances.forEach((balance, index) => {
    if (exactMatches.some((match) => match.owedTo === balance[0])) {
      positiveBalances.splice(index, 1);
    }
  });
  negativeBalances.forEach((balance, index) => {
    if (exactMatches.some((match) => match.userName === balance[0])) {
      negativeBalances.splice(index, 1);
    }
  });

  // Continue with the remaining balances
  while (positiveBalances.length > 0 && negativeBalances.length > 0) {
    const [userNameToPay, amountToPay] = negativeBalances[0];
    const [userNameToReceive, amountToReceive] = positiveBalances[0];

    transactions.push({
      userName: userNameToPay,
      owedTo: userNameToReceive,
      amount: Math.min(Math.abs(amountToPay), amountToReceive),
    });

    if (Math.abs(amountToPay) > amountToReceive) {
      negativeBalances[0][1] += amountToReceive;
      positiveBalances.shift();
    } else if (Math.abs(amountToPay) < amountToReceive) {
      positiveBalances[0][1] -= Math.abs(amountToPay);
      negativeBalances.shift();
    } else {
      positiveBalances.shift();
      negativeBalances.shift();
    }
  }
  return transactions;
};

