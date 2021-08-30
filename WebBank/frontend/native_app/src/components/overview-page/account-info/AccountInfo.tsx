import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import axios from 'axios';
import { connect } from 'react-redux';
import * as SecureStore from "expo-secure-store";

import { styles } from "components/overview-page/account-info/accountInfoStyle";
import safe from "assets/safe.png";
import { Currency } from 'modules/redux/currency/currency';
import { UserInfo } from 'modules/interfaces/userInfo';
import { Currencies } from "modules/interfaces/currencies";
import { Dispatch } from "redux";
import { State } from "modules/redux/rootReducer";
import { changeCurrency } from "modules/redux/currency/currencyActions";
import { numberFormatter } from "modules/numberFormatter";
import CurrencyButton from './CurrencyButton';
import { IP_ADRESS } from "modules/IPAdress";

interface AccountInfoProps {
    userID: number,
    currency: Currency,
    changeCurrency: (currency: Currency) => void
}

const AccountInfo: React.FC<AccountInfoProps> = (props) => {


    // Informace o uživateli
    const [ userInfo, setUserInfo ] = useState<UserInfo>({
        id: 0,
        name: "",
        surname: "",
        balance: 0,
        currency: "",
        accountNumber: ""
    });


    // Seznam aktuálních kurzů
    const [ currencies, setCurrencies ] = useState<Currencies>({
        CZK: 0,
        EUR: 0,
        JPY: 0,
        USD: 0
    });


    // Aktivní měna
    const [ activeCurrency, setActiveCurrency ] = useState<string>("CZK");


    /**
     * Získání dat
     */
    useEffect(() => {

        // Request - vrací seznam aktuálních kurzů
        axios.get("https://api.exchangerate.host/latest?base=CZK&symbols=CZK,EUR,JPY,USD")
            .then(({data: { rates } }) => setCurrencies({

            CZK: rates.CZK,
            EUR: rates.EUR,
            JPY: rates.JPY,
            USD: rates.USD

        })).catch((error) => console.log(error));
        
        // Získání JWT z uložiště
        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {
                
                const { token } = JSON.parse(value);

                // Request - vrací informace o uživateli, podle ID
                axios.get(`http://${IP_ADRESS}:8080/api/userInfo/userID=${props.userID}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({ data }) => setUserInfo(data))
                    .catch((error) => console.log(error));
            } 
        });

    }, [ props.userID ])


    const { changeCurrency, currency } = props;
    
    const isCurrencyEqual: boolean = (currency.name === activeCurrency ? true : false);

    /**
     * Změna měny
     */
    useEffect(() => {

        if (!isCurrencyEqual) {

            // Změna měny (redux)
            changeCurrency({
                exchangeRate: currencies[activeCurrency],
                name: activeCurrency
            });
        }

    }, [ isCurrencyEqual, changeCurrency, currencies, activeCurrency ])


    let isCZK: boolean = false;
    let isEUR: boolean = false;
    let isJPY: boolean = false;
    let isUSD: boolean = false;

    // Změna třídy tlačítka (zvýraznění aktivní měny)
    switch (activeCurrency) {

        case "CZK": isCZK = true; break;
        case "EUR": isEUR = true; break;
        case "JPY": isJPY = true; break;
        case "USD": isUSD = true; break;
    }

    // Zůstatek * hodnota kurzu
    let balance: number = userInfo.balance * props.currency.exchangeRate;

    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            {/* Logo */}
            <Image style={styles.logo} source={safe} />

            {/* Jméno uživatele */}
            <Text style={styles.user}>{userInfo.name} {userInfo.surname}</Text>

            {/* Číslo účtu */}
            <Text style={styles.accountNumber}>{userInfo.accountNumber}</Text>

            {/* Aktuální zůstatek */}
            <Text style={styles.balanceLabel}>Aktuální zůstatek:</Text>
            <Text style={styles.balance}>{numberFormatter(balance.toFixed(2))} {props.currency.name}</Text>
        
            {/* Panel tlačítek */}
            <View style={styles.buttonContainer}>
                <CurrencyButton text="CZK" activeCurrency={isCZK} handleClick={setActiveCurrency} />
                <CurrencyButton text="EUR" activeCurrency={isEUR} handleClick={setActiveCurrency} />
                <CurrencyButton text="JPY" activeCurrency={isJPY} handleClick={setActiveCurrency} />
                <CurrencyButton text="USD" activeCurrency={isUSD} handleClick={setActiveCurrency} />
            </View>

        </View>
    )
}

const mapStateToProps = (state: State) => {

    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {

    return {
        changeCurrency: (currency: Currency) => dispatch(changeCurrency(currency))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AccountInfo)
