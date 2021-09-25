import { StyleSheet, StatusBar, Dimensions } from "react-native";

export const styles = StyleSheet.create({
   
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "#3E332D",
    },

    newPaymentContainer: {
        flex: 1,
        width: "100%",
        marginTop: 10,
        padding: 10,
        backgroundColor: "#EEE",
        borderTopColor: "#02AAE9",
        borderTopWidth: 8,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        alignSelf: "center",
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.6,
        borderBottomColor: "#394359",
    },

    headerTitle: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 22,
        paddingVertical: 10,
    },

    headerText: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 16,
    },

    label: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 14,
        alignSelf: "flex-end",
        marginVertical: 7,
    },

    inputContainer: {
        flex: 1,
        justifyContent: "center",
    },

    error: {
        fontFamily: "Verdana",
        color: "#cc0000",
        alignSelf: "center",
        fontSize: 15,
        marginBottom: 2
    },

    input: {
        fontFamily: "Verdana",
        fontSize: 17,
        borderRadius: 4,
        padding: 5,
        backgroundColor: "white",
        borderWidth: 1,
        width: "100%",
        height: 40,
        alignSelf: "center",
    },

    navigation: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10
    },

    navigationText: {
        fontFamily: "Verdana",
        color: "#394359",
        marginHorizontal: 7,
        fontSize: 15
    },

    navigationLogo: {
        resizeMode: "contain",
        width: 27,
        height: 27,
    },

    inputShort: {
        fontFamily: "Verdana",
        fontSize: 17,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 5,
        backgroundColor: "white",
        borderWidth: 1,
        width: "77%",
        height: 40,
    },

    bankLogo: {
        resizeMode: "contain",
        width: 30,
        height: 30, 
        marginRight: 10,
    },

    caretDownLogo: {
        resizeMode: "contain",
        width: 20,
        height: 20, 
        marginHorizontal: 10,
    },

    selection: {
        backgroundColor: "white",
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        height: 40,
        width: "23%",
    },

    bankCode: {
        fontFamily: "Verdana",
        fontSize: 17,
        marginLeft: "auto",
        marginRight: "auto"
    },
    
    bankCodeChoice: {
        flexDirection: "row",
        backgroundColor: "white",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        padding: 5,
        marginTop: 5,
        height: Dimensions.get("window").height / 2,
    },

    currency: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 19,
        marginLeft: 5,
        marginRight: -5
    },

    currencyChoice: {
        flexDirection: "row",
        backgroundColor: "white",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        padding: 5,
        alignSelf: "flex-end",
        marginTop: 5,
        height: Dimensions.get("window").height / 2,
        width: "23.3%",
    },

    choiceText: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 19,
    },

    exchangeRateContainer: {
        flexDirection: "row",
        marginTop: 15
    },

    exchangeRateLabel: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 15
    },

    exchangeRateAmount: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 15
    },

    previewContainer: {
        flex: 1,
        marginTop: 10
    },

    previewLabel: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 15,
        marginTop: 7,
        marginBottom: 2,
    },

    previewText: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 18,
        marginBottom: 7,
        marginTop: 2,
    },

    optionalConatiner: {
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#394359",
    },

    optionalRow: {
        flexDirection: "row",
    },

    optionalButton: {
        flexDirection: "row",
    },

    editLogo: {
        resizeMode: "contain",
        width: 25,
        height: 25,
        marginRight: 10,
        marginTop: 4,
        alignSelf: "flex-start"
    },

    confirmationContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        
    },

    confirmationInputContainer: {
        width: "70%",
    },

    confirmationCode: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 22,
        textAlign: "center",
        width: "30%",
        marginTop: 7,
    },

});
