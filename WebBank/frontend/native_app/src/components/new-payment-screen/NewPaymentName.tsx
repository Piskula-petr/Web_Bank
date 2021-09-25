import React, { useState, useEffect } from 'react'
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux';
import { State } from "modules/redux/rootReducer";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { styles } from "components/new-payment-screen/newPaymentStyle";
import next from "assets/next.png";
import { NewPayment } from "modules/interfaces/newPayment";
import { ScreenList } from 'modules/screenList';
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

interface NewPaymentNameProps {
    userID: number
}

const NewPaymentName: React.FC<NewPaymentNameProps> = (props) => {
    

    const navigation = useNavigation<StackNavigationProp<ScreenList>>();
    const isFocused = useIsFocused();


    // Název platby
    const [ name, setName ] = useState<string>("");


    // Chybová zpráva
    const [ errorMessage, setErrorMessage ] = useState<string>("");


    // Nová platba
    const [ newPayment, setNewPayment ] = useState<NewPayment>({
        userID: props.userID,
        name: "",
        mark: "-",
        accountNumber: "",
        amount: "",
        currency: "CZK",
        variableSymbol: "",
        constantSymbol: "",
        specificSymbol: "",
        paymentDate: undefined,
        paymentType: "Platba bankovním převodem"
    });


    /**
     * Vynulování chybové zprávy, při navigaci zpět
     */
    useEffect(() => {

        if (isFocused) setErrorMessage("");

    }, [ isFocused ])


    /**
     * Změna názvu
     * 
     * @param value - zadaná hodnota
     */
    const handleName = (value: string): void => {

        const regex = new RegExp("^[a-zA-Z0-9À-ž ]*$");
        const validValue: string = (regex.test(value) ? value : name);

        setName(validValue);
    }


    /**
     * Kontrola názvu platby
     */
    const handleNext = (): void => {

        if (name.trim() === "") setErrorMessage("Název platby nesmí být prázdný");
        
        else {

            setNewPayment({
                ...newPayment,
                name
            });
        }
    }


    /**
     * Navigace na zadání čísla účtu
     */
    useEffect(() => {

        if (newPayment.name !== "") navigation.navigate("NewPaymentAccountNumber", { newPayment });

    }, [ newPayment ])


    /**
     * Vykreslení
     */
    return (
        <NewPaymentContainer headerText="Název platby" label="Povinný údaj" >

                {/* Název platby */}
                <View style={styles.inputContainer}>

                    <Text style={styles.error}>{errorMessage}</Text>

                    <TextInput 
                        style={styles.input}
                        placeholder="Název platby"
                        value={name} 
                        onChangeText={(value) => handleName(value)} /> 

                </View>

                {/* Navigační tlačítka */}
                <View style={{alignItems: "flex-end"}}>

                    {/* Další */}
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleNext} activeOpacity={0.7}>
                        <Text style={styles.navigationText}>Další</Text>
                        <Image style={styles.navigationLogo} source={next} />
                    </TouchableOpacity>

                </View>
            
        </NewPaymentContainer>
    )
}

const mapStateToProps = (state: State) => {
 
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(NewPaymentName)
