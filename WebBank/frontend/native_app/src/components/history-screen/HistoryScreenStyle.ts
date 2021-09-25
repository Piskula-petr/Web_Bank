import { StyleSheet, StatusBar, Dimensions  } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "#3E332D",
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height - 100,
    },
    
    historycontainer: {
        width: "100%",
        marginVertical: 10,
        backgroundColor: "#EEE",
        borderTopColor: "#f4e92f",
        borderTopWidth: 8,
        borderRadius: 3,
        alignSelf: "center",
    },

    paymentsContainer: {
        flexDirection: "row",
        paddingVertical: 5,
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#394359",
    },

    date: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        alignSelf: "center",
        paddingRight: 3
    },

    paymentContainer: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    name: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 13,
    },

    type: {
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 13,
        paddingVertical: 2
    },

    amount: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 13,
        paddingVertical: 2,
    },

    buttonContainer: {
        alignSelf: "center",
        padding: 5
    },

    buttonText: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 13,
        paddingVertical: 3
    },

    detailContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    detailText: {
        fontFamily: "Verdana",
        color: "#394359",
    }

});
