import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        marginVertical: 10,
        backgroundColor: "#EEE",
        borderTopColor: "#EE842C",
        borderTopWidth: 8,
        borderRadius: 3,
        width: "95%",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    logo: {
        position: "absolute",
        top: 15,
        left: 15,
        width: 50,
        height: 50,
    },

    user: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        color: "#394359",
        fontSize: 18,
    },

    accountNumber: {
        fontFamily: "Verdana",
        textAlign: "right",
        color: "#394359",
        fontSize: 14,
        paddingVertical: 2,
    },

    balanceLabel: {
        fontFamily: "Verdana",
        textAlign: "right",
        color: "#394359",
        paddingTop: 7,
        fontSize: 13,
    },

    balance: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        fontSize: 21,
        color: "#0f862f",
        paddingBottom: 7,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "flex-end",
    }

});