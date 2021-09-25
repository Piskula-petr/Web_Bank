import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, Image, ScrollView } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import { styles } from "components/new-payment-screen/newPaymentStyle";
import { ScreenList } from "modules/screenList";
import { Currency } from "modules/interfaces/currency";
import { NewPayment } from "modules/interfaces/newPayment";
import { IP_ADRESS } from "modules/IPAdress";
import caretDown from "assets/caret_down.png";
import { numberFormatter } from "modules/numberFormatter";
import nextLogo from "assets/next.png"; 
import backLogo from "assets/back.png"; 
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

interface Input {
    amount: string,
    currency: {
        code: string,
        exchangeRateToCZK: number
    }
}

const NewPaymentAmount: React.FC = () => {

    
    const navigation = useNavigation<StackNavigationProp<ScreenList>>();
    const route = useRoute<RouteProp<ScreenList, "NewPaymentAmount">>();
    const isFocused = useIsFocused();


    // Chybová zpráva
    const [ errorMessage, setErrorMessage ] = useState<string>("");


    // Přepínač výběru měny
    const [ toggle, setToggle ] = useState<boolean>(false);


    // Seznam dostupných měn
    const [ currencies, setCurrencies ] = useState<Array<Currency>>([])


    // Vstup [ číslo účtu / bankovní kód ]
    const [ input, setInput ] = useState<Input>({
        amount: "",
        currency: {
            code: "CZK",
            exchangeRateToCZK: 1
        }
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

                // Request - vrací seznam měn
                axios.get(`http://${IP_ADRESS}:8080/api/currencies`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => setCurrencies(

                    // Setřízení podle ID
                    data.sort((a: Currency, b: Currency) => { return a.id - b.id })

                )).catch((error) => console.log(error));
            }
        })

    }, [])


    /**
     * Změna částky
     * 
     * @param value - zadaná hodnota
     */
    const handleAmount = (value: string): void => {

        const firstChar: string = value.charAt(0);

        // Přidání nuly
        if (firstChar === "." || firstChar === ",") value = "0" + value;

        const regex = new RegExp("^[0-9]*([\.|,][0-9]{0,2})?$");
        const validValue = (regex.test(value) ? value : input.amount);

        setInput({
            ...input,
            amount: validValue
        })
    }


    /**
     * Změna směnného kurzu
     * 
     * @param value - vybraná měna
     */
    const handleExchangeRate = (value: string): void => {

        // Request - vrací aktuální směnný kurz
        axios.get(`https://api.exchangerate.host/latest?base=${value}`)
            .then(({data: { rates }}) => {

            setInput({
                ...input,
                currency: {
                    code: value,
                    exchangeRateToCZK: rates.CZK
                }
            })

        }).catch((error) => console.log(error));
    }


    /**
     * Kontrola částky
     */
    const handleNext = (): void => {
        
        const { amount, currency } = input;

        const newPaymentAmount: string = (parseFloat(amount.replace(",", ".")) * currency.exchangeRateToCZK).toFixed(2)

        if (amount.trim() === "") setErrorMessage("Částka platby nesmí být prázdná")
        
        else {

            setNewPayment({
                ...newPayment,
                amount: newPaymentAmount,
                currency: currency.code
            })
        }
    }


    /**
     * Navigace na náhled platby
     */
    useEffect(() => {

        if (newPayment.amount !== "") navigation.navigate("NewPaymentPreview", { newPayment });

    }, [ newPayment ])


    /**
     * Navigace zpět na zadání čísla účtu
     */
    const handlePrevious = (): void => {

        navigation.navigate("NewPaymentAccountNumber", { newPayment });
    }


    // Přepočet na CZK
    const exchangeRate: string = (parseFloat(input.amount.replace(",", ".")) * input.currency.exchangeRateToCZK).toFixed(2);


    /**
     * Vykreslení
     */
     return (
        <NewPaymentContainer headerText="Částka" label="Povinný údaj" >

            {/* Částka */}
            <View style={styles.inputContainer}>

                <Text style={[styles.error, {display: (errorMessage) ? "flex" : "none"}]}>{errorMessage}</Text>

                <View style={{flexDirection: "row"}}>

                    <TextInput 
                        style={styles.inputShort}
                        placeholder="Částka"
                        onChangeText={(value) => handleAmount(value)} 
                        value={input.amount}
                        onFocus={() => setToggle(false)} />

                    {/* Výběr měny */}
                    <TouchableOpacity 
                        style={styles.selection} 
                        activeOpacity={0.7} 
                        onPress={() => {
                            Keyboard.dismiss();
                            setToggle(!toggle);
                        }} >

                        <Text style={styles.currency}>{input.currency.code}</Text>
                        <Image style={styles.caretDownLogo} source={caretDown} />
                    </TouchableOpacity>
                </View>

                {/* Výpis měn */}
                <View style={[styles.currencyChoice, {display: (toggle) ? "flex" : "none"}, {borderWidth: (toggle) ? 1 : 0}]}>

                    <ScrollView>
                        {currencies.map(item => 

                            <Text 
                                key={item.id} 
                                style={[styles.choiceText, {textAlign: "center"}]} 
                                onPress={() => { 
                                    setToggle(false); 
                                    handleExchangeRate(item.code) 
                                }}>

                                {item.code}
                            </Text>
                        )}
                    </ScrollView>
                </View>

                {/* Pepočet */}
                <View style={[styles.exchangeRateContainer, {display: (input.currency.exchangeRateToCZK === 1 || input.amount === "" || toggle ? "none" : "flex")}]}>
                    <Text style={styles.exchangeRateLabel}>Aktuální přepočet: </Text>
                    <Text style={styles.exchangeRateAmount}>{numberFormatter(exchangeRate)} CZK</Text>
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

export default NewPaymentAmount
