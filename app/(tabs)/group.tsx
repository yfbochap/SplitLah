import React, { useEffect,useState, useCallback, } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    Image,
    Button,
    StyleSheet,
    Dimensions,
    RefreshControl
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useFocusEffect, router } from 'expo-router';
import styles from '../../assets/styles';
import { Group } from '../../classes/group';
import { getGID, storeBID, getUUID } from '@/services/accountService';
import * as Clipboard from 'expo-clipboard';
import { AntDesign } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { getGroupBalance, getOverallGroupBalance, getUserBalanceMessage, GroupBalanceList, transformData, getTransactions} from '../../classes/balance';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

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

interface Owedmoney {
  amount: number;
  owedTo: string;
  userName: string;
}



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


function FirstTab({ billDetails, checkGroupData, refreshing, onRefresh }) {

  return (
    <View style={styles.container}>
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
      <ScrollView contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={styles.chatList}>
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

function SecondTab({ groupbalance, FormattedData, refreshing, onRefresh, checkGroupData }) {
  const navigation = useNavigation();

  const GroupBalanceList: React.FC = () => {
    const renderItem = ({ item }: { item: Owedmoney }) => {
      const positiveValue = Math.abs(item.amount);
      const textColor = item.amount > 0 ? 'green' : 'red';
  
      return (
        <View style={styles2.itemContainer}>
          <Text style={styles2.itemText}>
            {item.userName} owes {item.owedTo}
          </Text>
          <Text style={[styles2.itemValue, { color: "black" }]}>
            ${positiveValue}
          </Text>
        </View>
      );
    };
  
    return (
      <FlatList
        data={groupbalance}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };
   
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
        barWidth={20}
        barBorderRadius={4}
        maxValue={200}
          stepValue={20}
          data={FormattedData}
          horizontal
          initialSpacing={0}
          barMarginBottom={0}
          // showGradient
          // gradientColor={'#fc84ff'}
          hideYAxisText
          yAxisThickness={0}
          xAxisThickness={0}
          
          // xAxisColor={'#c919ff'}
          // frontColor={'green'}
          // sideColor={'#ff00d0'}
          // topColor={'#ff66f4'}
          barStyle={{
            // borderWidth: 1,
            // borderColor: '',
            // shadowColor: '',
            // shadowOffset: {width: 0, height: 4},
            // shadowOpacity: 1,
            // shadowRadius: 8,
            // elevation: 10,
            
          }}
          xAxisLabelsVerticalShift={10}
          labelWidth={30}
          
          autoShiftLabels
          hideRules
          height={140}
          barWidth={20}
          isAnimated
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom: 20,
                  marginLeft: 0,
                  backgroundColor: '#ffcefe',
                  paddingHorizontal: 2,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                  <Text style={{transform: [{rotate: '270deg'}],}}>
                  {item.value}
                  </Text>
              </View>
            );
          }}
        />
       </View>
       <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
          Transactions
        </Text>
        <GroupBalanceList />
      </View>
  );
}

export default function GroupScreen() {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    router.back();
  };

  const handleChatButtonPress = () => {
    router.navigate('groupchat');
  };

  useFocusEffect(
    useCallback(() => {
      checkGroupData();
    }, [])
  );

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails[] | null>(null);
  const [copiedText, setCopiedText] = React.useState('');
  const [logMessage, setLogMessage] = useState<string>('');
  const [groupbalance, setOwedMoney] = useState<Owedmoney[] | null>(null);
  const [FormattedData, setFormattedData] = useState<FormattedData[] | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
 
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupDetails.invite_code);
  };

  const checkGroupData = async () => {
    try {
      // Clear previous group and bill details
      setGroupDetails(null);
      setBillDetails(null);

      const gid = await getGID();
      if (gid) {
        // console.log(`GID found: ${gid}`);
        const group = new Group(gid);
        const uid = await getUUID();
        const details = await group.getGroupDetails();
        const bills = await group.getBillsBasedOnGroup();
        const grpbalance = await getGroupBalance(gid);
        console.log('groupbalance', grpbalance);
        const overallBalances = getOverallGroupBalance(grpbalance);
        // console.log('overall', getOverallGroupBalance(grpbalance));
        // console.log(uid);
        const usermessage = getUserBalanceMessage(overallBalances, uid);
        
        // console.log('transactions', transactions);
        // getUserBalanceMessage(overallBalances, uid).then((message) => {
        //   console.log(message); // This should log the actual message
          setLogMessage(usermessage);
        // });
        
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkGroupData();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupheader}>
        <View>
          <HeaderBackButton tintColor='white' onPress={handleBackButtonPress} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal:'5%' }}>
          <TouchableOpacity onPress={() => router.navigate('updategroup')}>
          <Text style={{ ...styles.headerText}}>
            {groupDetails ? groupDetails.group_name : ''}
          </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0,marginRight: '5%'}}>
            <Entypo name="chat" size={Math.min(24, Dimensions.get('window').width * 0.05)} color="white" onPress={handleChatButtonPress} />
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
          {() => <FirstTab billDetails={billDetails} checkGroupData={checkGroupData} refreshing={refreshing} onRefresh={onRefresh} />}
        </Tab.Screen>
        <Tab.Screen name="SecondTab">
          {() => <SecondTab groupbalance={groupbalance} FormattedData={FormattedData} checkGroupData={checkGroupData} refreshing={refreshing} onRefresh={onRefresh} />}
        </Tab.Screen>


      </Tab.Navigator>
      
      <View style={{ padding: 10, backgroundColor: '#FFC0CB', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center' }}>{logMessage}</Text>
    </View>
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
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
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