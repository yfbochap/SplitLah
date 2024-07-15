import { supabase } from '../hooks/supabase';

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
export const getGroupBalance = async (groupId: string): Promise<{ userId: string; owedTo: string; amount: number }[]> => {
    const { data, error } = await supabase
      .from('balances')
      .select('user_id, owed_to, amount')
      .eq('group_id', groupId);
  
    if (error) {
      console.error(error);
      return [];
    }
  
    const balances: { userId: string; owedTo: string; amount: number }[] = [];
  
    data.forEach((bill) => {
      const lenderId = bill.owed_to;
      const borrowerId = bill.user_id;
      const amount = bill.amount;
  
      balances.push({ userId: borrowerId, owedTo: lenderId, amount });
      balances.push({ userId: lenderId, owedTo: borrowerId, amount: -amount });
    });
  
    return balances;
  };


export const getOverallGroupBalance = (balances: { userId: string; owedTo: string; amount: number }[]) => {
    const overallBalances: { [userId: string]: number } = {};

    balances.forEach((balance) => {
        const userId = balance.userId;
        const amount = balance.amount;

        if (overallBalances[userId]) {
        overallBalances[userId] += -amount;
        } else {
        overallBalances[userId] = -amount;
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
