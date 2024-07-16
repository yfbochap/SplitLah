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
