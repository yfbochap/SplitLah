import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, ListRenderItem, TouchableOpacity, Image, } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import styles from '../../assets/styles';
import { Group } from '../../classes/group';
import { getGID } from '@/services/accountService';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

const Tab = createMaterialTopTabNavigator();

interface Balance {
  id: string;
  name: string;
  amount: number;
  payer: string;
  receiver: string;
}

interface GroupDetails {
  group_id: string;
  group_name: string;
  description: string;
  no_of_people: number;
  currency: string;
}

interface BillDetails {
  bill_id: string;
  name: string;
  date: string;
  amount: string;
}

const balances: Balance[] = [
  { id: '1', name: 'Alice', amount: 20, payer: 'Alice', receiver: 'Bob' },
  { id: '2', name: 'Bob', amount: -15, payer: 'Charlie', receiver: 'Alice' },
  { id: '3', name: 'Charlie', amount: 30, payer: 'Alice', receiver: 'Charlie' },
  { id: '4', name: 'Dave', amount: -10, payer: 'Dave', receiver: 'Alice' },
];

const BalanceBar: React.FC<{ balance: Balance }> = ({ balance }) => {
  const isPositive = balance.amount >= 0;
  const barStyle = isPositive ? styles.positiveBar : styles.negativeBar;

  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.userName}>{balance.name}</Text>
      <View style={styles.divider} />
      <View style={styles.barWrapper}>
        <View style={[styles.bar, barStyle, { width: `${Math.abs(balance.amount)}%` }]} />
        <Text style={styles.amountText}>${Math.abs(balance.amount)}</Text>
      </View>
    </View>
  );
};

const calculateTotalBalance = (balances: Balance[]): number => {
  return balances.reduce((total, item) => total + item.amount, 0);
};

function FirstTab({ billDetails }) {
  return (
    <View style={styles.container}>
      <View></View>
      <View style={styles.searchFabContainer}>
        <Link href='addbill' asChild>
          <TouchableOpacity style={styles.fab}>
            <Image source={require('../../assets/images/plus.png')} style={styles.fabIcon} />
          </TouchableOpacity>
        </Link>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>
      <ScrollView style={styles.chatList}>
        {billDetails && billDetails.length > 0 ? (
          billDetails.map((bill, index) => (
            <Link href='bill' asChild key={index}>
              <TouchableOpacity style={styles.chatItem}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={styles.chatText1}>{bill.name}</Text>
                  </View>
                  <View>
                    <Text style={{...styles.chatText1, textAlign: 'right', marginBottom: 4}}>${bill.amount}</Text>
                    <Text style={styles.chatText2}>{bill.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <Text>No bills available</Text>
        )}
      </ScrollView>
    </View>
  );
}

function SecondTab() {
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
    <View style={{ ...styles.container }}>
      <View style={{ ...styles.barChartContainer }}>
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

export default function GroupScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkGroupData = async () => {
        try {
          const gid = await getGID();
          if (gid) {
            console.log(`GID found: ${gid}`);
            const group = new Group(gid);
            const details = await group.getGroupDetails();
            const bills = await group.getBillsBasedOnGroup();
            console.log(`Group Details: ${JSON.stringify(details)}`);
            console.log(`Bill Details: ${JSON.stringify(bills)}`);
            if (details && details.length > 0) {
              setGroupDetails(details[0]);
            }
            if (bills && bills.length > 0) {
              setBillDetails(bills);
            }
          } else {
            console.log('GID not found.');
            router.replace('/');
          }
        } catch (e) {
          console.error('Failed to load GID.', e);
        }
      };

      checkGroupData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupheader}>
        <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        <View style={{ flex: 1, alignItems: 'center', maxWidth: 300 }}>
          <Text style={{ ...styles.headerText }}>
            {groupDetails ? groupDetails.group_name : '#Group-Name-Here'}
          </Text>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { fontSize: 16, color: 'white' },
          tabBarStyle: { backgroundColor: 'purple' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
          tabBarLabel: ({ focused }) => {
            let label;
            if (route.name === 'FirstTab') {
              label = 'Bills';
            } else if (route.name === 'SecondTab') {
              label = 'Balances';
            }
            return <Text style={{ color: focused ? 'white' : 'gray' }}>{label}</Text>;
          },
          tabBarIcon: ({ color, focused }) => {
            if (route.name === 'FirstTab') {
              return <FontAwesome name="file-text" size={20} color="white" />;
            } else if (route.name === 'SecondTab') {
              return <FontAwesome name="balance-scale" size={20} color="white" />;
            }
          },
        })}
      >
        <Tab.Screen name="FirstTab">
          {() => <FirstTab billDetails={billDetails} />}
        </Tab.Screen>
        <Tab.Screen name="SecondTab" component={SecondTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
