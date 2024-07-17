import { supabase } from '../hooks/supabase';
import { User } from './user';

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
      const lenderName = await lender.getUserName();
      const borrowerId = bill.user_id;
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
        message = `You owe $${Math.abs(userBalance)} amount of money`;
      } else if (userBalance > 0) {
        message = `You are owed $${userBalance} amount of money`;
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
      labelTextStyle: { color: 'white' }
    };
  });
};
  