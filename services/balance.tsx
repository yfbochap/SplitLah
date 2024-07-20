import { supabase } from '../hooks/supabase';
import { User } from '../classes/user';

interface BalanceData {
  [key: string]: number;
}

interface FormattedData {
  value: number;
  label: string;
  frontColor: string;
  labelTextStyle: { color: string };
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

// gets how much each person owes or is owed based on the balances in the group
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
  
    // Round amounts to 2 decimal places
    for (const userId in overallBalances) {
      overallBalances[userId] = parseFloat(overallBalances[userId].toFixed(2));
    }
  
    return overallBalances;
  };

// gets the message of how much a user owes or is owed
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
    } else if (userBalance === 0) {
      message = `You are not owed any money`;
    }
    else {
      message = `You are not owed any money`;
    }
    return message; 
  };

//transforms data to fit the format of the bar chart
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

// helper function to find exact matches where one person can pay another person to clear their debt
export const findExactMatches = (positiveBalances: [string, number][], negativeBalances: [string, number][]) => {
  const exactMatches = [];

  for (let i = 0; i < positiveBalances.length; i++) {
    for (let j = 0; j < negativeBalances.length; j++) {
      // in cases where the amount owed is the same as the amount owed
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

// gets the transactions that need to be made to clear the balances
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

    let amount = Math.min(Math.abs(amountToPay), amountToReceive);
    amount = parseFloat(amount.toFixed(2)); // Round to 2 decimal places

    transactions.push({
      userName: userNameToPay,
      owedTo: userNameToReceive,
      amount,
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

