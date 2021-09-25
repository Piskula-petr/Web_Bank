import { StyleSheet, StatusBar } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "#3E332D",
    },

    previewContainer: {
        flex: 1,
        alignItems: "center",
    },
    
});