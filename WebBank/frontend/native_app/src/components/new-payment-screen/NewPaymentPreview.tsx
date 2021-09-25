import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "components/new-payment-screen/newPaymentStyle";
import { ScreenList } from "modules/screenList";
import { NewPayment } from "modules/interfaces/newPayment";
import nextLogo from "assets/next.png"; 
import backLogo from "assets/back.png"; 
import { numberFormatter } from "modules/numberFormatter";
import OptionalPanel from "components/new-payment-screen/OptionalPanel";
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

type InputName = "" | "variableSymbol" | "constantSymbol" | "specificSymbol";

const NewPaymentPreview: React.FC = () => {


    const navigation = useNavigation<StackNavigationProp<ScreenList>>();
    const route = useRoute<RouteProp<ScreenList, "NewPaymentPreview">>();


    // Nová platba
    const [ newPayment, setNewPayment ] = useState<NewPayment>(route.params.newPayment);

    /**
     * Změna nepovinných údajů
     * 
     * @param inputName - název vstupn [ variableSymbol, constantSymbol, specificSymbol ]
     * @param value - zadaná hodnota
     * @param length - maximální délka hodnoty
     */
    const handleChange = (inputName: InputName, value: string, length: number) => {

        const regex = new RegExp("^[0-9]{0," + length +"}$");
        const validValue = (regex.test(value) ? value : newPayment[inputName]);

        setNewPayment({
            ...newPayment,
            [inputName]: validValue
        })
    }


    /**
     * Navigace na ověření platby
     */
    const handleNext = (): void => {

        navigation.navigate("NewPaymentConfirmation", { newPayment });
    }


    /**
     * Navigace zpět na zadání částky
     */
     const handlePrevious = (): void => {

        navigation.navigate("NewPaymentAmount", { newPayment });
    }


    /**
     * Vykreslení
     */
    return (
        <NewPaymentContainer headerText="Přehled" >

            {/* Náhled nové platby */}
            <ScrollView style={{marginRight: -10, paddingRight: 10}}>
                <View style={styles.previewContainer}>

                    {/* Název platby */}
                    <Text style={styles.previewLabel}>Název platby:</Text>
                    <Text style={styles.previewText} numberOfLines={1} ellipsizeMode="tail">
                        {newPayment.name}
                    </Text>

                    {/* Číslo účtu */}
                    <Text style={styles.previewLabel}>Číslo účtu:</Text>
                    <Text style={styles.previewText}>{newPayment.accountNumber}</Text>

                    {/* Částka */}
                    <Text style={styles.previewLabel}>Částka:</Text>
                    <Text style={styles.previewText}>{numberFormatter(newPayment.amount)} CZK</Text>

                    <Text style={styles.label}>Nepovinné údaje</Text>

                    {/* OptionalPanelovinných údajů */}
                    <OptionalPanel 
                        newPayment={newPayment} 
                        handleChange={handleChange}/>

                </View>
            </ScrollView>

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

export default NewPaymentPreview
