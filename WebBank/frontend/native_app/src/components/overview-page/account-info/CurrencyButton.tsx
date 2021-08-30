import React from 'react'
import { TouchableHighlight, Text, StyleSheet } from 'react-native'

interface CurrencyButtonProps {
    text: string,
    activeCurrency: boolean,
    handleClick: (currency: string) => void
}

const CurrencyButton: React.FC<CurrencyButtonProps> = (props) => {

    const { text, activeCurrency, handleClick } = props;

    return (
        <TouchableHighlight
            style={[styles.button, {backgroundColor: (activeCurrency ? "#B22222" : "transparent")}]} 
            underlayColor="#B22222"
            activeOpacity={1} 
            onPress={() => handleClick(text)}>

            <Text style={[styles.buttonText, {color: (activeCurrency ? "#EEE" : "#394359")}]}>{text}</Text>
        </TouchableHighlight>
    )
}

export default CurrencyButton

const styles = StyleSheet.create({
   
    button: {
        borderWidth: 2,
        borderColor: "#B22222",
        borderRadius: 3,
        padding: 5,
        marginLeft: 15,
        width: 46,
    },

    buttonText: {
        fontFamily: "Verdana",
        textAlign: "center",
        color: "#394359",
    }
});