import React, { useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import axios from "axios";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import { styles } from "components/navigation-panel/navigationPanelStyle";
import home from "assets/home.png"
import history from "assets/history.png"
import payment from "assets/payment.png"
import { ScreenList } from "modules/screenList";
import { IP_ADRESS } from "modules/IPAdress";

interface NavigationPanelProps {
    isOverviewActive?: boolean,
    isHistoryActive?: boolean,
    isNewpaymentActive?: boolean,
}

interface JWT {
    token: string,
    expireTime: Date
}

const NavigationPanel: React.FC<NavigationPanelProps> = (props) => {

    
    const isFocused: boolean = useIsFocused();
    const navigation = useNavigation<StackNavigationProp<ScreenList>>();


    // JWT 
    const [ jwt, setJwt ] = useState<JWT>();


    // ID intervalu
    const [ intervalID, setIntervalID ] = useState<number>();


    /**
     * Nastavení JWT
     */
    useEffect(() => {

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token, expireTime } = JSON.parse(value);

                setJwt({
                    token,
                    expireTime: new Date(expireTime)
                });
            }
        });

    }, [ isFocused ])


    /**
     * Obnovení JWT
     */
    useEffect(() => {

        const interval: number = window.setInterval(() => {

            const TIME_BEFORE_EXPIRE: number = 30 * 1000;   // 30 sekund

            if (jwt) {

                if (new Date().getTime() > (jwt.expireTime.getTime() - TIME_BEFORE_EXPIRE)) {

                    // Request - obnovení JWT
                    axios.get(`http://${IP_ADRESS}:8080/api/refresh`, {
    
                        headers: { Authorization: "Bearer " + jwt.token }
    
                    }).then(({data: { token, expireTime }}) => {
    
                        const newJwt = {
                            token,
                            expireTime: new Date(expireTime)
                        }
    
                        // Uložení tokenu
                        SecureStore.setItemAsync("jwt", JSON.stringify(newJwt));
    
                        // Nastavení nového JWT
                        setJwt(newJwt);
    
                    }).catch((error) => console.log(error));
                }
            }

        }, 10 * 1000); // Interval 10 sekund
        
        // Nastavení ID ibtervalu
        setIntervalID(interval);

        return () => clearInterval(interval);

    }, [ jwt ])


    /**
     * Přesměrování na jinou obrazovku
     * 
     * @param activeScreen - aktivní obrazovka
     * @param targetSreen - cílová obrazovka
     */
    const handleRedirect = (activeScreen: boolean | undefined, targetSreen: keyof ScreenList): void => {

        clearInterval(intervalID);

        // Zabránění přesměrování na stejnou obrazovku
        if (!activeScreen) navigation.navigate(targetSreen);
    }


    const { isOverviewActive, isHistoryActive, isNewpaymentActive } = props;


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            {/* Přehled */}
            <TouchableWithoutFeedback onPress={() => handleRedirect(isOverviewActive, "OverviewScreen")}>
                <View>

                    <Image 
                        style={[styles.logo, {backgroundColor: (isOverviewActive ? "#02AAE9" : "#394359")}]} 
                        source={home} />

                    <Text style={[styles.buttonText, {color: (isOverviewActive ? "#02AAE9" : "#394359")}]}>
                        Přehled
                    </Text>
                    
                </View>
            </TouchableWithoutFeedback>

            {/* Historie */}
            <TouchableWithoutFeedback onPress={() => handleRedirect(isHistoryActive, "HistoryScreen")}>
                <View>

                    <Image 
                        style={[styles.logo, {backgroundColor: (isHistoryActive ? "#02AAE9" : "#394359")}]} 
                        source={history} />

                    <Text style={[styles.buttonText, {color: (isHistoryActive ? "#02AAE9" : "#394359")}]}>
                        Historie
                    </Text>

                </View>
            </TouchableWithoutFeedback>

            {/* Nová platba */}
            <TouchableWithoutFeedback onPress={() => handleRedirect(isNewpaymentActive, "NewPaymentName")}>
                <View>

                    <Image 
                        style={[styles.logo, {backgroundColor: (isNewpaymentActive ? "#02AAE9" : "#394359")}]} 
                        source={payment} />

                    <Text style={[styles.buttonText, {color: (isNewpaymentActive ? "#02AAE9" : "#394359")}]}>
                        Nová platba
                    </Text> 

                </View>
            </TouchableWithoutFeedback>

        </View>
    )
}

export default NavigationPanel
