import {Platform, StyleSheet} from 'react-native';
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants/src/Constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        // paddingVertical: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    },

    // Shared Styles for register.tsx and login.tsx
    primaryheader: {
        // paddingVertical: Platform.OS === 'android' ? Constants.statusBarHeight : 0, //Makes it so the container will check whether its android and if so start after the task bar
        // marginVertical: 50,
        // width: 'auto',
    },
    primaryheadertext: {
        color: 'white',
        fontSize: 36,
        alignContent: 'center',
        textAlign: 'center',
        height: 55,

    },
    accountbody: {
        marginTop: 50,
        marginBottom: 24,
        marginHorizontal: 24,
        borderColor: 'white',
        borderWidth: 2,
        flex: 1,
    },
    inputText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 20,
        marginHorizontal: 24,
        borderBottomColor: 'purple',
        borderWidth: 2,
        marginBottom: 8,
    },
    loginButton: {
        color: 'purple',
        marginHorizontal: 24,
        marginVertical: 30,
    },
    hyperlink: {
        color: '#2296ec',
        fontSize: 26,
        marginHorizontal: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'purple',
      padding: 10,
      marginBottom: 12,
    },

    // Unique Styles for index.tsx
    profileBar: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      profileText: {
        color: 'white',
        fontSize: 42,
        fontFamily: 'Lobster-Regular',
        textAlign: 'center',
      },
      searchFabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      searchInput: {
        flex: 1,
        height: 35,
        backgroundColor: '#e5e5e5',
        borderRadius: 20,
        paddingHorizontal: 16,
        color: 'black',
      },
      chatList: {
        flex: 1,
      },
      chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0088cc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      avatarText: {
        color: 'white',
        fontSize: 20,
      },
      chatText: {
        fontSize: 18,
        color: 'white',
      },
      chatText1: {
        fontSize: 20,
        color: 'white',
      },
      chatText2: {
        fontSize: 16,
        color: '#818891',
      },
      fab: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0088cc',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        marginRight: 16,
      },
      fabIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
      },
      fabMenu: {
        position: 'absolute',
        top: 120,
        left: 30,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
      },
      fabMenuItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
      },
      fabMenuItemBackground: {
        borderRadius: 8,
        padding: 10,
      },
      fabMenuText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
      },

      //Unique Styles for group.tsx
      groupheader: {
        backgroundColor: 'purple',
        alignItems: 'center',
        flexDirection: 'row',
        height: 80,
      },
      headerText: {
        textAlign: 'center',
        fontSize: 32,
        color: 'white',
      },
      tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      },
      tabText: {
        fontSize: 20,
        color: 'white',
      },
      descText: {
        color: 'grey',
        fontSize: 16,
        padding: 8,
        marginHorizontal: 24,
      },
    
      barChartContainer: {
         paddingVertical: 20,
      },
      barList: {
        paddingVertical: 16,
      },
      balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        justifyContent: 'flex-start',
      },
      userName: {
        width: 70,
        textAlign: 'right',
        fontSize: 16,
        color: 'white',
        marginRight: 8,
      },
      barWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      bar: {
        height: 20,
      },
      positiveBar: {
        backgroundColor: 'green',
        marginLeft: 2,
      },
      negativeBar: {
        backgroundColor: 'red',
        marginRight: 2,
      },
      divider: {
        width: 2,
        height: 20,
        backgroundColor: 'white',
        marginRight: 8,
      },
      amountText: {
        marginLeft: 8,
        fontSize: 16,
        color: 'white',
      },
      list: {
        flex: 1,
        paddingHorizontal: 16,
      },
      balanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 1,
      },
      balanceText: {
        fontSize: 16,
        color: '#333',
      },
      footer: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#ccc',
      },
      footerText: {
        fontSize: 18,
        textAlign: 'center',
      },

      //Shared Styles for addbill.tsx and newgroup.tsx
      currencyInputContainer: {
        marginHorizontal: 24,
        borderBottomColor: 'purple',
        borderWidth: 2,
        marginBottom: 8,
      },
      currencyInput: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 20,
      },
      popup: {
        maxHeight: 200,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: 'purple',
        borderRadius: 5,
        marginBottom: 8,
      },
      currencyButton: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
      },
      currencyText: {
        fontSize: 16,
      },
      dateText: {
        color: 'white',
        fontSize: 20,
      },
      dateInput: {
        paddingHorizontal: 8,
        // paddingVertical: 12,
        marginHorizontal: 24,
        borderBottomColor: 'purple',
        borderBottomWidth: 2,
        marginBottom: 8,
      },
      groupidtext: {
        backgroundColor: 'purple',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginRight: 10,
      },
      GroupIDContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'purple',
        padding: 10,
      },
      membersList: {
        maxHeight: 200, // Adjust the height as needed
        borderWidth: 1,
        borderTopColor: '#ccc',
        marginHorizontal: 24,
      },

      //Unique Styles for bill.tsx
      billHeader: {
        backgroundColor: 'purple',
        // alignItems: 'center',
        flexDirection: 'row',
        height: 95,
      },
      billHeaderText: {
        textAlign: 'center',
        fontSize: 36,
        color: 'white',
      },
      billEditButton: {
        color: 'white',
        fontSize: 16,
      },
      descBillText: {
        color: 'grey',
        fontSize: 20,
        padding: 8,
        marginHorizontal: 5,
        textAlign: 'center',
      },
      copyIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'purple',
      },
      
      copyIcon: {
        
        width: 20,
        height: 20,
      },
      
      copiedText: {
        marginTop: 10,
        textAlign: 'center',
        color: 'grey',
      },

      gc_container: {
        flex: 1,
        backgroundColor: 'black'
      },

      gc_messageListContainer: {
        flex: 0.93,
        padding: 10,
      },

      gc_scrollViewContent: {
        paddingHorizontal: 10,
      },

      gc_messageContainer: {
        marginVertical: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#333333',
      },

      gc_receivedName: {
        fontSize: 14,
        color: '#D3D3D3',
        marginBottom: 4,
      },

      gc_receivedMessage: {
        fontSize: 20,
        color: '#E6E6FA',
      },

      gc_inputContainer: {
        flex: 0.07,
        padding: 10,
        backgroundColor: '#4c4949',
        flexDirection: 'row',
      },

      gc_textInput: {
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#4c4949',
        flex: .85,
        flexDirection: 'column',
        color: '#E6E6FA',

      },

      gc_sendButton:{
        height: 40,
        backgroundColor: '#800080',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        flex: .15,
        flexDirection: 'column',
      },

      gc_sendButtonText:{
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical:'center'
      }

});
export default styles;