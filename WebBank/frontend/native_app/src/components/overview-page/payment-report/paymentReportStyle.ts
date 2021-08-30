import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   
    container: {
        marginVertical: 10,
        backgroundColor: "#EEE",
        borderTopColor: "#EB1C22",
        borderTopWidth: 8,
        borderRadius: 3,
        width: "90%",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    logo: {
        position: "absolute",
        top: 0,
        left: 0,
        resizeMode: "contain",
        height: 50,
        width: 50,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    hide: {
        display: "none"
    },

    arrowImage: {
        resizeMode: "contain",
        width: 22
    },

    month: {
        fontFamily: "Verdana-Bold",
        paddingHorizontal: 15,
        textAlign: "center",
        fontSize: 17,
        color: "#394359",
    },

    income: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        color: "#0f862f",
        paddingTop: 5,
        fontSize: 15,
    },

    costs: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        color: "#B22222",
        paddingBottom: 7,
        fontSize: 15,
    },

    balance: {
        fontFamily: "Verdana-Bold",
        textAlign: "right",
        borderTopWidth: 1.5,
        borderColor: "#394359",
        paddingVertical: 7,
        fontSize: 15,
    },

    canvas: {
        width: "100%",
        height: 90,
        borderWidth: 2,
        borderColor: "#394359",
        borderRadius: 5,
        marginVertical: 3,
        paddingVertical: 3,
    },

    months: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    monthGraph: {
        fontFamily: "Verdana-Bold",
        color: "#394359",
        textAlign: "center",
        width: 100,
        fontSize: 15,
    }

});