import React, { useState } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import { styles } from "components/new-payment-screen/newPaymentStyle";
import { confirmationCode } from "modules/confirmationCode";
import { ScreenList } from "modules/screenList";
import { NewPayment } from "modules/interfaces/newPayment";
import nextLogo from "assets/next.png"; 
import backLogo from "assets/back.png"; 
import { IP_ADRESS } from "modules/IPAdress";
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

interface Code {
    generatedCode: number,
    inputValue: string,
    error: string
}

const NewPaymentConfirmation: React.FC = () => {

    
    const navigation = useNavigation<StackNavigationProp<ScreenList>>();
    const route = useRoute<RouteProp<ScreenList, "NewPaymentPreview">>();


    // Nová platba
    const [ newPayment ] = useState<NewPayment>({
        ...route.params.newPayment,
        paymentDate: new Date()
    });


    // Ověřovací kód
    const [ code, setCode ] = useState<Code>({
        generatedCode: confirmationCode(),
        inputValue: "",
        error: ""
    });


    /**
     * Změna ověřovacího kódu
     * 
     * @param value - zadaná hodnota
     */
    const handleChange = (value: string): void => {

        const regex = new RegExp("^[0-9]{0,5}$");
        const validValue = (regex.test(value) ? value : code.inputValue);

        setCode({
            ...code,
            inputValue: validValue
        })
    }


    /**
     * Odeslání nové platby
     */
    const handleSubmit = (): void => {

        const { generatedCode, inputValue } = code;

        // Shodný ověřovací kód
        if (generatedCode === parseInt(inputValue)) {

            SecureStore.getItemAsync("jwt").then((value) => {

                if (value) {

                    const { token } = JSON.parse(value);

                    // Request - odeslání nové platby
                    axios.post(`http://${IP_ADRESS}:8080/api/newPayment`, newPayment, {

                        headers: { Authorization: "Bearer " + token }

                    }).then(() => {

                        // Přesměrování na přehled
                        navigation.navigate("OverviewPage");

                    }).catch((error) => console.log(error));
                }
            })


        // Nesprávný ověřovací kód
        } else if (generatedCode !== parseInt(inputValue)) {

            setCode({
                ...code,
                generatedCode: confirmationCode(),
                error: "Ověřovací kód není správný"
            })
        }
    }


    /**
     * Navigace zpět na náhled platby
     */
    const handlePrevious = (): void => {

        navigation.navigate("NewPaymentPreview", { newPayment });
    }


    /**
     * Vykreslení
     */
    return (
        <NewPaymentContainer headerText="Ověření" >

            {/* Ověření */}
            <View style={styles.confirmationContainer}>

                <Text style={styles.confirmationCode}>{code.generatedCode}</Text>

                {/* Ověřovací kód */}
                <View style={styles.confirmationInputContainer}>

                    <Text style={styles.error}>{code.error}</Text>
                    
                    <TextInput 
                        style={styles.input}
                        value={code.inputValue} 
                        onChangeText={(value) => handleChange(value)}
                        placeholder="Ověřovací kód" />

                </View>
            </View>

            {/* Navigační tlačítka */}
            <View style={styles.navigation}>

                {/* Zpět */}
                <TouchableOpacity style={styles.buttonContainer} onPress={handlePrevious}>
                    <Image style={styles.navigationLogo} source={backLogo} />
                    <Text style={styles.navigationText}>Zpět</Text>      
                </TouchableOpacity>

                {/* Odeslat */}
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                    <Text style={styles.navigationText}>Odeslat</Text>
                    <Image style={styles.navigationLogo} source={nextLogo} />
                </TouchableOpacity>
            </View>

        </NewPaymentContainer>
    )
}

export default NewPaymentConfirmation
