import React, { useState, useCallback, } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    RefreshControl
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
import { getGroupBalance, getOverallGroupBalance, getUserBalanceMessage, transformData, getTransactions} from '../../services/balance';
import Entypo from '@expo/vector-icons/Entypo';

//Declares the top navigation bar for 'Bills' and 'Balances'
const Tab = createMaterialTopTabNavigator();

//Declares the necessary interfaces (helps define the object and the type of data within in)
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


const handleBill = async (inputBillID: string) => {
  // console.log('test1', inputBillID);
  try {
    await storeBID(inputBillID); // This is an async operation and needs to be awaited
    // console.log('BID saved successfully');
  } catch (e) {
    // console.error('Failed to save bill ID.', e);
  }
};

// Defines the 'Bills' tab, with the relevant props being passed from default function 'GroupScreen'
function FirstTab({ billDetails, refreshing, onRefresh }) {

  return (
    //Renders the search bar and the plus button for creating a new bill
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
      <ScrollView contentContainerStyle={styles.scrollView} //Renders the scrollable list of bills for the user
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> //User can refresh the display by pulling the scrollview down
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
            <Text style={{marginTop: 20, color: 'white', fontSize: 24, textAlign: 'center'}}>No bills available</Text> //Displays this message if there are no bills found
        )}
      </ScrollView>
    </View>
  );
}

// Defines the 'Balances' tab, with the relevant props being passed from default function 'GroupScreen'
function SecondTab({ groupbalance, FormattedData, highestValue }) {
  // Inner component to display the list of group balances
  const GroupBalanceList: React.FC = () => {
    const renderItem = ({ item }: { item: Owedmoney }) => {
      // Determine the positive value and text color based on the amount owed
      const positiveValue = Math.abs(item.amount);
      const textColor = item.amount > 0 ? 'green' : 'red';
  
      return (
        // Display each item with the userName, owedToName and amount
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
      // Render the list of group balances
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
      {/* Display bar chart of the overall group balance */}
      <View style={{marginLeft: 0}}>
        <BarChart
        showScrollIndicator
        barWidth={20}
        barBorderRadius={4}
        // noOfSections={60}
        maxValue={200}
        stepValue={20}
        // stepHeight={}
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
        xAxisLabelsVerticalShift={10}
        labelWidth={30}
        
        autoShiftLabels
        hideRules
        height={140}
        barWidth={20}
        isAnimated
        renderTooltip={(item, index) => {
        return (
              <Text style={{transform: [{rotate: '270deg', }], flex: 1, 
              marginBottom: 20,
              marginLeft: 0,
              backgroundColor: '#ffcefe',
              paddingHorizontal: 2,
              paddingVertical: 4,
              borderRadius: 4}}>
              {item.value}
              </Text>
        );
      }}
        />
       </View>
       {/* Display amount of money owed to/ owed by the group memebers */}
       <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
          Transactions
        </Text>
        <GroupBalanceList />
      </View>
  );
}

export default function GroupScreen() {
  const handleBackButtonPress = () => {
    router.navigate('/');
  };

  const handleChatButtonPress = () => {
    router.navigate('groupchat');
  };

  useFocusEffect(
    useCallback(() => {
      checkGroupData();
    }, [])
  );

  //Declaring block-scoped variables
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails[] | null>(null);
  const [logMessage, setLogMessage] = useState<string>('');
  const [groupbalance, setOwedMoney] = useState<Owedmoney[] | null>(null);
  const [FormattedData, setFormattedData] = useState<FormattedData[] | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [highestValue, sethighestValue ] = useState(0); //Variable for Experimental Feature
 
  //Function for assisting the user in copying the group code
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupDetails.invite_code);
  };

  //Retrieves and processes all relevant group data (based on the stored 'group_id')
  const checkGroupData = async () => {
    try {
      // Clear previous group and bill details
      setGroupDetails(null);
      setBillDetails(null);
      setLogMessage('');
      setOwedMoney(null);
      setFormattedData(null);
      setRefreshing(false);

      const gid = await getGID();
      if (gid) {
        // console.log(`GID found: ${gid}`);
        const group = new Group(gid);
        const uid = await getUUID();
        const details = await group.getGroupDetails();
        const bills = await group.getBillsBasedOnGroup();
        const grpbalance = await getGroupBalance(gid);
        // console.log('groupbalance', grpbalance);
        const overallBalances = await getOverallGroupBalance(grpbalance);
        const transactions = await getTransactions(overallBalances);
        const inputData = await transformData(overallBalances);
        // console.log('overall', getOverallGroupBalance(grpbalance));
        // console.log(uid);
        const usermessage = getUserBalanceMessage(overallBalances, uid);

        const highestAbsValue = await Math.max(...Object.values(overallBalances).map(Math.abs));
        sethighestValue(highestAbsValue);
      
        
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
        if (grpbalance && grpbalance.length > 0) {
          setOwedMoney(transactions);
          setFormattedData(inputData);
        }


      } else {
        // console.log('GID not found.');
        router.replace('/');
      }
    } catch (e) {
      // console.error('Failed to load GID.', e);
    }
  };

  //Function for handling the user's manual refreshing of the screen
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkGroupData();
    setRefreshing(false);
  }, []);

  return (
    // Display the header and the two tabs for bills and balances
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


      <Tab.Navigator //Renders the top navigation bar
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
        {/* refresh function by pulling the items in bill down to check for new bills */}
        <Tab.Screen name="FirstTab">
          {() => <FirstTab billDetails={billDetails} checkGroupData={checkGroupData} refreshing={refreshing} onRefresh={onRefresh} />}
        </Tab.Screen>
        <Tab.Screen name="SecondTab">
          {() => <SecondTab groupbalance={groupbalance} FormattedData={FormattedData} checkGroupData={checkGroupData} refreshing={refreshing} onRefresh={onRefresh} />}
        </Tab.Screen>


      </Tab.Navigator>
      
      <View style={{ padding: 10, backgroundColor: '#FFC0CB', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center' , fontSize: 20}}>{logMessage}</Text>
    </View>
      <View style={styles.GroupIDContainer}>
        
        <Text style={{ ...styles.groupidtext }}>
          Invite code: {groupDetails ? groupDetails.invite_code : '#Group-Code-Here'}
          <View style={styles.copyIconContainer}>
            {/* Displays the copy to clipboard button to copy the group's invite code */}
            <TouchableOpacity style={styles.copyIconContainer} onPress={copyToClipboard}>
              <AntDesign name="copy1" size={24} color="white" />
            </TouchableOpacity>

          </View>
        </Text>
        
      </View>
    </SafeAreaView>
  );
}

//Experimental styles used for rendering the barchart and associated data
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