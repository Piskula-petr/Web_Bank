import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from 'react-redux';
import { useFonts } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

import store from "modules/redux/store";
import { ScreenList } from "modules/screenList";
import LoginScreen from 'components/login-screen/LoginScreen';
import OverviewScreen from "components/overview-screen/OverviewScreen";
import HistoryScreen from "components/history-screen/HistoryScreen";
import NewPaymentName from "components/new-payment-screen/NewPaymentName";
import NewPaymentAccountNumber from "components/new-payment-screen/NewPaymentAccountNumber";
import NewPaymentAmount from "components/new-payment-screen/NewPaymentAmount";
import NewPaymentPreview from "components/new-payment-screen/NewPaymentPreview";
import NewPaymentConfirmation from "components/new-payment-screen/NewPaymentConfirmation";

const App: React.FC = () => {


    /**
     * Font
     */
    const [ fontsLoaded ] = useFonts({
        "Verdana": require("./src/assets/fonts/Verdana.ttf"),
        "Verdana-Bold": require("./src/assets/fonts/Verdana-Bold.ttf")
    });


    const { Navigator, Screen } = createNativeStackNavigator<ScreenList>();

    
    /**
     * Vykreslení
     */
    if (!fontsLoaded) {

        return <AppLoading />

    } else {

        return (
            <Provider store={store}>
                <NavigationContainer>
                    <Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
                        
                        {/* Přihlašovací formulář */}
                        <Screen 
                            name="LoginScreen" 
                            component={LoginScreen} />
    
                        {/* Přehled plateb */}
                        <Screen 
                            name="OverviewScreen" 
                            component={OverviewScreen} />
    
                        {/* Historie plateb */}
                        <Screen 
                            name="HistoryScreen"
                            component={HistoryScreen} />

                        {/* Název nové platby */}
                        <Screen 
                            name="NewPaymentName"
                            component={NewPaymentName} />

                        {/* Číslo účtu nové platby */}
                        <Screen 
                            name="NewPaymentAccountNumber"
                            component={NewPaymentAccountNumber} />

                        {/* Částka nové platby */}
                        <Screen
                            name="NewPaymentAmount"
                            component={NewPaymentAmount} />

                        {/* Náhled nové platby */}
                        <Screen
                            name="NewPaymentPreview"
                            component={NewPaymentPreview} />

                        {/* Ověření nové platby */}
                        <Screen 
                            name="NewPaymentConfirmation"
                            component={NewPaymentConfirmation} />

                    </Navigator>
                </NavigationContainer>
            </Provider>    
        );
    }
}

export default App