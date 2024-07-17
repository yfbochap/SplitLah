import React, { useEffect,useState, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, ListRenderItem, TouchableOpacity, Image, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import styles from '../../assets/styles';
import { Group } from '../../classes/group';
import { getGID, storeBID } from '@/services/accountService';
import * as Clipboard from 'expo-clipboard';
import { AntDesign } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { getGroupBalance, getOverallGroupBalance,transformData } from '../../classes/balance';



const Tab = createMaterialTopTabNavigator();
export default function copied() {
  const [copiedText, setCopiedText] = React.useState('');
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('hello world');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };
}
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
  invite_code: string;
}

interface BillDetails {
  bill_id: string;
  name: string;
  date: string;
  amount: string;
}

interface FormattedData {
  value : number;
  label : string;
}
// const balances: Balance[] = [
//   { id: '1', name: 'Alice', amount: 20, payer: 'Alice', receiver: 'Bob' },
//   { id: '2', name: 'Bob', amount: -15, payer: 'Charlie', receiver: 'Alice' },
//   { id: '3', name: 'Charlie', amount: 30, payer: 'Alice', receiver: 'Charlie' },
//   { id: '4', name: 'Dave', amount: -10, payer: 'Dave', receiver: 'Alice' },
// ];

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

const handleBill = async (inputBillID: string) => {
  // console.log('test1', inputBillID);
  try {
    await storeBID(inputBillID); // This is an async operation and needs to be awaited
    // console.log('BID saved successfully');
  } catch (e) {
    // console.error('Failed to save bill ID.', e);
  }
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
              <TouchableOpacity style={styles.chatItem} onPress={() => handleBill(bill.bill_id)}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.chatText1}>{bill.name}</Text>
                  </View>
                  <View>
                    <Text style={{ ...styles.chatText1, textAlign: 'right', marginBottom: 4 }}>${bill.amount}</Text>
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
  const router = useRouter();
  const handleBackButtonPress = () => {
    navigation.goBack();
  };
  const [FormattedData,setFormattedData] = useState<FormattedData[] | null>(null);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails[] | null>(null);
  const [copiedText, setCopiedText] = React.useState('');
  useFocusEffect(
    useCallback(() => {
      const checkGroupData = async () => {
        try {
          // Clear previous group and bill details
          setGroupDetails(null);
          setBillDetails(null);

          const gid = await getGID();
          if (gid) {
            // console.log(`GID found: ${gid}`);
            const group = new Group(gid);
            const details = await group.getGroupDetails();
            const bills = await group.getBillsBasedOnGroup();
            const grpbalance = await getGroupBalance(gid);
            const overallBalances = getOverallGroupBalance(grpbalance);
            const inputData = transformData(overallBalances);
            console.log('groupbalance', grpbalance);
            console.log('overall', getOverallGroupBalance(grpbalance));
            console.log(inputData);
            setFormattedData(inputData);

            // console.log(`Group Details: ${JSON.stringify(details)}`);
            // console.log(`Bill Details: ${JSON.stringify(bills)}`);

            
            if (details && details.length > 0) {
              setGroupDetails(details[0]);
            }
            if (bills && bills.length > 0) {
              setBillDetails(bills);
            }


          } else {
            // console.log('GID not found.');
            router.replace('/');
          }
        } catch (e) {
          // console.error('Failed to load GID.', e);
        }
      };

      checkGroupData();
    }, [])
  );
  
  
  const renderBalanceBarItem: ListRenderItem<Balance> = ({ item }) => <BalanceBar balance={item} />;
  const renderBalanceItem: ListRenderItem<Balance> = ({ item }) => (
    <View style={styles.balanceItem}>
      <Text style={styles.balanceText}>
        {item.name} owes {item.receiver} ${Math.abs(item.amount)}
      </Text>
    </View>
  );

  return (
    
    <View
      style={{
        paddingVertical: 0,
        backgroundColor: 'black',
        flex: 1,
      }}>
      <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10}}>
            Group Balance
          </Text>
      <View style={{marginLeft: 0}}>
        <BarChart
        showScrollIndicator
        maxValue={ 200}
          stepValue={20}
          data={FormattedData}
          horizontal
          initialSpacing={0}
          barMarginBottom={0}
          showGradient
          gradientColor={'#fc84ff'}
          hideYAxisText
          yAxisThickness={20}
          xAxisThickness={0}
          xAxisColor={'#c919ff'}
          frontColor={'transparent'}
          sideColor={'#ff00d0'}
          topColor={'#ff66f4'}
          barStyle={{
            borderWidth: 4,
            borderColor: '#fc84ff',
            shadowColor: '#fc84ff',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 10,
          }}
          autoShiftLabels
          hideRules
          height={120}
          barWidth={20}
          isAnimated
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom: 20,
                  marginLeft: -6,
                  backgroundColor: '#ffcefe',
                  paddingHorizontal: 2,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                <Text>{item.value}</Text>
              </View>
            );
          }}
          
        />
       <View>
       <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10}}>Transactions</Text>
       </View>
      </View>
    </View>
  );

  //   <View style={{ ...styles.container }}>
  //     <View style={{ ...styles.barChartContainer }}>
      
  //       <FlatList
  //         data={balances}
  //         renderItem={renderBalanceBarItem}
  //         keyExtractor={(item) => item.id}
  //         contentContainerStyle={styles.barList}
  //       />
  //     </View>
  //     <FlatList
  //       data={balances}
  //       renderItem={renderBalanceItem}
  //       keyExtractor={(item) => item.id}
  //       style={styles.list}
  //     />
  //     <View style={styles.footer}>
  //       <Text style={styles.footerText}>Total Balance: ${calculateTotalBalance(balances)}</Text>
  //     </View>
  //   </View>
  
}

export default function GroupScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const handleChatButtonPress = () => {
    router.navigate('groupchat');
  };

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails[] | null>(null);
  const [copiedText, setCopiedText] = React.useState('');
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupDetails.invite_code);
  };


  useFocusEffect(
    useCallback(() => {
      const checkGroupData = async () => {
        try {
          // Clear previous group and bill details
          setGroupDetails(null);
          setBillDetails(null);

          const gid = await getGID();
          if (gid) {
            // console.log(`GID found: ${gid}`);
            const group = new Group(gid);
            const details = await group.getGroupDetails();
            const bills = await group.getBillsBasedOnGroup();
            const grpbalance = await getGroupBalance(gid);
            
            // console.log(`Group Details: ${JSON.stringify(details)}`);
            // console.log(`Bill Details: ${JSON.stringify(bills)}`);

            if (details && details.length > 0) {
              setGroupDetails(details[0]);
            }
            if (bills && bills.length > 0) {
              setBillDetails(bills);
            }


          } else {
            // console.log('GID not found.');
            router.replace('/');
          }
        } catch (e) {
          // console.error('Failed to load GID.', e);
        }
      };

      checkGroupData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupheader}>
        <View>
          <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', maxWidth: 300 }}>
          <Text style={{ ...styles.headerText }}>
            {groupDetails ? groupDetails.group_name : ''}
          </Text>
        </View>
        <View style={{ marginRight: 15}}>
          <TouchableOpacity>
            <Text style={styles.billEditButton} onPress={handleChatButtonPress}>Chat</Text>
          </TouchableOpacity>
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
      <View style={styles.GroupIDContainer}>
        <Text style={{ ...styles.groupidtext }}>
          Invite code: {groupDetails ? groupDetails.invite_code : '#Group-Code-Here'}
          <View style={styles.copyIconContainer}>

            <TouchableOpacity style={styles.copyIconContainer} onPress={copyToClipboard}>
              <AntDesign name="copy1" size={24} color="white" />
            </TouchableOpacity>

          </View>
        </Text>
      </View>
    </SafeAreaView>
  );
}
