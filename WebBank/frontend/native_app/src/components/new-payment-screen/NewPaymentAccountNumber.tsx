import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, ScrollView } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import { styles } from "components/new-payment-screen/newPaymentStyle";
import { ScreenList } from "modules/screenList";
import { BankCode } from "modules/interfaces/bankCode";
import { IP_ADRESS } from "modules/IPAdress";
import bank from "assets/bank.png";
import caretDown from "assets/caret_down.png";
import backLogo from "assets/back.png";
import nextLogo from "assets/next.png";
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

import { NewPayment } from 'modules/interfaces/newPayment';

interface Input {
    accountNumber: string,
    bankCode: string
}

const NewPaymentAccountNumber: React.FC = () => {


    const navigation = useNavigation<StackNavigationProp<ScreenList>>();
    const route = useRoute<RouteProp<ScreenList, "NewPaymentAccountNumber">>();
    const isFocused = useIsFocused();


    // Chybová zpráva
    const [ errorMessage, setErrorMessage ] = useState<string>("");


    // Přepínač výběru bankovních kódů
    const [ toggle, setToggle ] = useState<boolean>(false);


    // Seznam bankovních kódů
    const [ bankCodes, setBankCodes ] = useState<Array<BankCode>>([])


    // Vstup [ číslo účtu / bankovní kód ]
    const [ input, setInput ] = useState<Input>({
        accountNumber: "",
        bankCode: ""
    });


    // Nová platba
    const [ newPayment, setNewPayment ] = useState<NewPayment>(route.params.newPayment);


    /**
     * Vynulování chybové zprávy, při navigaci zpět
     */
    useEffect(() => {

        if (isFocused) setErrorMessage("");

    }, [ isFocused ])


    /**
     * Získání dat
     */
    useEffect(() => {

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací seznamu bankovních kódů
                axios.get(`http://${IP_ADRESS}:8080/api/bankCodes`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => setBankCodes(data))
                    .catch((error) => console.log(error));
            }
        })

    }, [])


    /**
     * Změna čísla účtu
     * 
     * @param value - zadaná hodnota
     */
    const handleAccountNumber = (value: string): void => {

        const regex = new RegExp("^[0-9]{0,10}$");
        const validValue = (regex.test(value) ? value : input.accountNumber);

        setInput({
            ...input,
            accountNumber: validValue
        })
    }


    /**
     * Kontrola bankovního účtu
     */
    const handleNext = (): void => {

        const { accountNumber, bankCode } = input;

        if (accountNumber.trim() === "") setErrorMessage("Číslo účtu nesmí být prázdné")
            
        else if (bankCode === "") setErrorMessage("Kód banky musí být zadán")
                
        else {

            setNewPayment({
                ...newPayment,
                accountNumber: accountNumber + "/" + bankCode
            });
        }
    }


    /**
     * Navigace na zadání čísla účtu
     */
    useEffect(() => {

        if (newPayment.accountNumber !== "") navigation.navigate("NewPaymentAmount", { newPayment });

    }, [ newPayment ])


    /**
     * Navigace zpět na zadání názvu
     */
    const handlePrevious = (): void => {

        navigation.navigate("NewPaymentName");
    }


    /**
     * Vykreslení
     */
    return (
        <NewPaymentContainer headerText="Číslo účtu" label="Povinný údaj">

            {/* Číslo účtu */}
            <View style={styles.inputContainer}>

                <Text style={[styles.error, {display: (errorMessage) ? "flex" : "none"}]}>{errorMessage}</Text>

                <View style={{flexDirection: "row"}}>

                    <TextInput
                        style={styles.inputShort}
                        placeholder="Číslo účtu"
                        onChangeText={(value) => handleAccountNumber(value)}
                        value={input.accountNumber}
                        onFocus={() => setToggle(false)} />

                    {/* Výběr bankovního kódu */}
                    <TouchableOpacity 
                        style={styles.selection} 
                        activeOpacity={0.7} 
                        onPress={() => {
                            Keyboard.dismiss(); 
                            setToggle(!toggle);
                        }} >

                        <Image style={[styles.caretDownLogo, {display: (input.bankCode) ? "none" : "flex"}]} source={caretDown} />
                        <Image style={[styles.bankLogo, {display: (input.bankCode) ? "none" : "flex"}]} source={bank} />
                        <Text style={styles.bankCode}>{input.bankCode}</Text>
                    </TouchableOpacity>
                </View>

                {/* Výpis bankovních kódů */}
                <View style={[styles.bankCodeChoice, {display: (toggle) ? "flex" : "none"}, {borderWidth: (toggle) ? 1 : 0}]}>

                    <ScrollView>
                        {bankCodes.map(item =>
                            
                            <Text 
                            key={item.id} 
                            style={styles.choiceText} 
                            onPress={() => {
                                setToggle(false);
                                setInput({ ...input, bankCode: item.code })
                            }}>

                                {item.code} - {item.name}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </View>

            {/* Navigační tlačítka */}
            <View style={styles.navigation}>

                {/* Zpět */}
                <TouchableOpacity style={styles.buttonContainer} onPress={handlePrevious}>
                    <Image style={styles.navigationLogo} source={backLogo} />
                    <Text style={styles.navigationText}>Zpět</Text>      
                </TouchableOpacity>

                {/* Další */}
                <TouchableOpacity style={styles.buttonContainer} onPress={handleNext}>
                    <Text style={styles.navigationText}>Další</Text>
                    <Image style={styles.navigationLogo} source={nextLogo} />
                </TouchableOpacity>
            </View>

        </NewPaymentContainer>
    )
}

export default NewPaymentAccountNumber
