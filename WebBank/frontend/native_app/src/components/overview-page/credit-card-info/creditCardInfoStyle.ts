import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   
    container: {
        marginVertical: 10,
        backgroundColor: "#EEE",
        borderTopColor: "#808080",
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
        resizeMode: "contain",
        height: 50,
        width: 65,
    },

    type: {
        textAlign: "right",
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 15,
    },

    user: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        color: "#394359",
        fontSize: 18,
        paddingTop: 3
    },

    validFrom: {
        textAlign: "right",
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 13,
        paddingTop: 8,
    },

    validTo: {
        textAlign: "right",
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 13,
        paddingBottom: 8,
    },

    bold: {
        fontFamily: "Verdana-Bold"
    },

    cardNumberLabel: {
        textAlign: "right",
        fontFamily: "Verdana",
        color: "#394359",
        fontSize: 13,
    },

    cardNumber: {
        textAlign: "right",
        fontFamily: "Verdana-Bold",
        color: "#394359",
        fontSize: 18,
    }

});
