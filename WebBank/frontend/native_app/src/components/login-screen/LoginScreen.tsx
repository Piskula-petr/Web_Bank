import React, { useReducer } from 'react'
import { View, TextInput, TouchableHighlight, Text, Image } from 'react-native'
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from 'expo-status-bar';

import { styles } from "components/login-screen/loginScreenStyle";
import logo from "assets/logo.png";
import { ScreenList } from 'modules/screenList';
import { LoginReducerState, LoginReducerAction } from "components/login-screen/loginReducer";
import { setUserID } from "modules/redux/user/userActions";
import { IP_ADRESS } from "modules/IPAdress";

interface LoginPageProps {
    setUserID: (userID: number) => void
}

type InputName = "clientNumber" | "password";

const LoginPage: React.FC<LoginPageProps> = (props) => {


    const navigation = useNavigation<StackNavigationProp<ScreenList>>();


    // Výchozí přihlašovací data
    const initialLoginData = {

        // Přihlašovací údaje
        clientNumber: "",
        password: "",

        // Chybové zprávy
        clientNumberError: "",
        passwordError: ""
    }   


    /**
     * Reducer
     */
    const [state, dispatch] = useReducer((state: LoginReducerState, action: LoginReducerAction): LoginReducerState => {

        switch (action.type) {

            case "SET_CHANGE": 

                return action.payload;

            case "FETCH_ERROR": {
                
                return {
                    ...state,
                    clientNumberError: action.payload.clientNumberError,
                    passwordError: action.payload.passwordError
                }
            }     
        }

    }, initialLoginData); 


    /**
     * Změna přihlašovacích údajů
     * 
     * @param name - název vstupu [ clientNumber, password ]
     * @param value - zadaná hodnota
     */
    const handleChange = (name: InputName, value: string): void => {

        let validValue: string = value;

        if (name === "clientNumber") {
            
            const regex: RegExp = new RegExp("^[0-9]{0,10}$");
            validValue = (regex.test(value) ? value : state[name]);
        }

        dispatch({
            type: "SET_CHANGE",
            payload: {
                ...state,
                [name]: validValue
            }
        })
    }


    /**
     * Odeslání formuláře 
     */
    const handleSubmit = (): void => {

        const { clientNumber, password } = state;

        // Request - přihlášení uživatele
        axios.post(`http://${IP_ADRESS}:8080/api/login`, {

            clientNumber,
            password

        }).then(({data: {token, expireTime, userID} }) => {

            const jwt = {
                token,
                expireTime
            }

            // Uložení tokenu
            SecureStore.setItemAsync("jwt", JSON.stringify(jwt));

            // Nastavení ID uživatele (redux)
            props.setUserID(userID);

            // Přesměrování na přehled
            navigation.navigate("OverviewScreen");

        }).catch(({ response: {data} }) => {

            let errorMessage: string = data.clientNumber;

            // Chybová hláška při nesprávných přihlašovacích údajích
            if (data.clientNumber === undefined && data.password === undefined) {

                errorMessage = "Přihlašovací údaje jsou nesprávné";
            }

            dispatch({
                type: "FETCH_ERROR",
                payload: {
                    clientNumberError: errorMessage,
                    passwordError: data.password as string
                }
            })
        });
    }


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            <StatusBar translucent={true} backgroundColor="transparent" style="light" />

            {/* Logo */}
            <Image style={styles.logo} source={logo} />

            <View style={styles.loginContainer}>

                <Text style={styles.errorMessage}>{state.clientNumberError}</Text>

                {/* Klientské číslo */}
                <TextInput 
                    style={styles.input} 
                    onChangeText={(value) => handleChange("clientNumber" , value)} 
                    value={state.clientNumber}
                    placeholder="Uživatelské číslo" />

                <Text style={styles.errorMessage}>{state.passwordError}</Text>

                {/* Heslo */}
                <TextInput 
                    style={styles.input} 
                    secureTextEntry={true} 
                    onChangeText={(value) => handleChange("password", value)} 
                    value={state.password}
                    placeholder="Heslo" />

                {/* Přihlašovací tlačítko */}
                <TouchableHighlight 
                    style={styles.button} 
                    underlayColor="#B22222"
                    activeOpacity={1}
                    onPress={handleSubmit} >

                    <Text style={styles.buttonText} >
                        Pokračovat
                    </Text>
                </TouchableHighlight>

            </View>
        </View>
    )
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    
    return {
        setUserID: (userID: number) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps) (LoginPage)