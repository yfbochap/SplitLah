import React from 'react';
import { ScrollView, View, Text, TextInput, FlatList, ListRenderItem, TouchableOpacity, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link, useRouter} from 'expo-router';
import styles from '../../assets/styles';
import { Group } from '../../classes/group';

const Tab = createMaterialTopTabNavigator();

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

function FirstTab() {
  return (
    <View style={styles.container}>
      <View>

      </View>
      <View style={styles.searchFabContainer}>
        <Link href = 'addbill' asChild>
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
        {['Sample Group 1', 'Sample Group 2', 'Sample Group 3', 'Sample Group 4', 'Sample Group 5'].map((group, index) => (
          <Link href = 'bill' asChild>
            <TouchableOpacity key={index} style={styles.chatItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{group.charAt(0)}</Text>
              </View>
              <Text style={styles.chatText}>{group}</Text>
            </TouchableOpacity>
          </Link>
        ))}
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
    <View style={{...styles.container}}>
      <View style={{...styles.barChartContainer}}>
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

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupheader}>
        <View><HeaderBackButton tintColor='white' onPress={handleBackButtonPress} /></View>
        
        <View style={{flex: 1, alignItems: 'center', maxWidth: 300}}><Text style={styles.headerText}>#Group-Name-Here</Text></View>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { fontSize: 16, color: 'white' },
          tabBarStyle: { backgroundColor: 'purple' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
          tabBarLabel: ({ focused }) => {
            let label, iconName;
            if (route.name === 'FirstTab') {
              label = 'Bills';
            } else if (route.name === 'SecondTab') {
              label = 'Balances';
            }
            return <Text style={{ color: focused ? 'white' : 'gray' }}>{label}</Text>;
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            if (route.name === 'FirstTab') {
              iconName = focused ? 'file-text' : 'file-text-o';
              return <FontAwesome name="anchor" size={20} color="white" />;
            } else if (route.name === 'SecondTab') {
              iconName = focused ? 'balance-scale' : 'balance-scale';
              return <FontAwesome name="balance-scale" size={20} color="white" />;
            }
          },
        })}
      >
        <Tab.Screen name="FirstTab" component={FirstTab} />
        <Tab.Screen name="SecondTab" component={SecondTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

