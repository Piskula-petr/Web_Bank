import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   
    container: {
        backgroundColor: "#EEE",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 7,
        borderTopWidth: 3,
        borderColor: "#3E332D",
    },

    logo: {
        alignSelf: "center",
        width: 30,
        height: 30,
    },

    buttonText: {
        fontFamily: "Verdana-Bold",
        color: "#383838",
        textAlign: "center",
        paddingTop: 2,
    }

});