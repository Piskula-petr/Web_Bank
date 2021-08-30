import { StyleSheet, StatusBar } from "react-native";

export const styles = StyleSheet.create({

    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3E332D"
    },

    loginContainer: {
        width: "80%",
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: 3,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    logo: {
        resizeMode: 'contain',
        aspectRatio: 1.5,
    },

    input: {
        fontSize: 17,
        borderRadius: 4,
        marginVertical: 20,
        marginHorizontal: 5,
        padding: 3,
        backgroundColor: "#EEE"
    },

    errorMessage: {
        color: "red",
        marginBottom: -15,
        textAlign: "center",
    },

    button: {
        backgroundColor: "transparent",
        borderRadius: 3,
        marginVertical: 20,
        marginHorizontal: 5
    },

    buttonText: {
        color:"white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        borderWidth: 3,
        borderStyle: "solid",
        borderRadius: 3,
        borderColor: "#B22222",
        padding: 8,
    }
    
})