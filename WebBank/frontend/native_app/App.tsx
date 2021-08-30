import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from 'react-redux';
import { useFonts } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

import store from "modules/redux/store";
import { ScreenList } from "modules/screenList";
import LoginPage from 'components/login-page/LoginPage';
import OverviewPage from "components/overview-page/OverviewPage";
import HistoryPage from "components/history-page/HistoryPage";

const App = () => {


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
                    <Navigator initialRouteName="LoginPage" screenOptions={{headerShown: false}}>
                        
                        {/* Přihlašovací formulář */}
                        <Screen 
                            name="LoginPage" 
                            component={LoginPage} />
    
                        {/* Přehled plateb */}
                        <Screen 
                            name="OverviewPage" 
                            component={OverviewPage} />
    
                        {/* Historie plateb */}
                        <Screen 
                            name="HistoryPage"
                            component={HistoryPage} />

                        {/* Nová platba */}

                    </Navigator>
                </NavigationContainer>
            </Provider>    
        );
    }
}

export default App