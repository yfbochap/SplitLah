import {Platform, StyleSheet} from 'react-native';
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants/src/Constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        paddingVertical: Platform.OS === 'android' ? Constants.statusBarHeight : 0, //Makes it so the container will check whether its android and if so start after the task bar
        //marginVertical: 50,
        width: 'auto',
    },
    headertext: {
        color: 'white',
        fontSize: 36,
        alignContent: 'center',
        textAlign: 'center',
        height: 55,
    },
    body: {
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
        marginTop: 24,
    },
    loginButton: {
        color: 'purple',
        marginHorizontal: 24,
        marginTop: 30,
    },
    hyperlink: {
        color: '#2296ec',
        fontSize: 26,
        marginHorizontal: 24,
        textAlign: 'center',
    },
    saferArea: {
      paddingVertical: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    },

});
export default styles;