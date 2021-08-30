import React, { useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import axios from "axios";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
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

const NavigationPanel: React.FC<NavigationPanelProps> = (props) => {

    const navigation = useNavigation<StackNavigationProp<ScreenList>>();


    // JWT token
    const [ jwt, setJwt ] = useState<string>("");


    // Čas vypršení JWT
    const [ jwtExpireTime, setJwtExpireTime ] = useState<Date>();


    /**
     * Nastavení JWT
     */
    useEffect(() => {

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token, expireTime } = JSON.parse(value);

                setJwt(token);

                let jwtExpireTime: Date = new Date(expireTime);

                // Odečtení 1 minuty, od vypršení JWT
                jwtExpireTime.setTime(jwtExpireTime.getTime() - (1 * 60 * 1000));

                setJwtExpireTime(jwtExpireTime);
            }
        });

    }, [])


    /**
     * Obnovení JWT
     */
    useEffect(() => {

        const interval = setInterval(() => {
            
            if (jwtExpireTime) {

                if (new Date().getTime() > jwtExpireTime.getTime()) {

                    // Request - obnovení JWT
                    axios.get(`http://${IP_ADRESS}:8080/api/refresh`, {
    
                        headers: {
                            "Authorization": "Bearer " + jwt
                        }
    
                    }).then(({data: { token, expireTime }}) => {
    
                        const jwt = {
                            token,
                            expireTime
                        }
    
                        // Uložení tokenu
                        SecureStore.setItemAsync("jwt", JSON.stringify(jwt));

                        let jwtNewExpireTime: Date = new Date(expireTime);
        
                        // Odečtení 1 minuty, od vypršení JWT
                        jwtNewExpireTime.setTime(jwtNewExpireTime.getTime() - (1 * 60 * 1000));
    
                        setJwtExpireTime(jwtNewExpireTime);
    
                    }).catch((error) => console.log(error));
                }
            }

        }, 10 * 1000)        

        return () => clearInterval(interval);

    }, [ jwtExpireTime ])


    /**
     * Přesměrování na jinou obrazovku
     * 
     * @param activeScreen - aktivní obrazovka
     * @param targetSreen - cílová obrazovka
     */
    const handleRedirect = (activeScreen: boolean | undefined, targetSreen: keyof ScreenList): void => {

        // Zabránění přesměrování na stejnou obrazovku
        if (!activeScreen) {

            navigation.navigate(targetSreen);
        }
    }


    const { isOverviewActive, isHistoryActive, isNewpaymentActive } = props;

    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            {/* Přehled */}
            <TouchableWithoutFeedback onPress={() => handleRedirect(isOverviewActive, "OverviewPage")}>
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
            <TouchableWithoutFeedback onPress={() => handleRedirect(isHistoryActive, "HistoryPage")}>
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
            <TouchableWithoutFeedback onPress={() => handleRedirect(isNewpaymentActive, "NewPayment")}>
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
