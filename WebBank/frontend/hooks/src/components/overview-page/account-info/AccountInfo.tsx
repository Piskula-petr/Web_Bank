/* eslint-disable default-case */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Dispatch } from "redux";

import styles from "components/overview-page/account-info/account-info.module.css";
import safeLogo from "images/safe.png";
import { Currencies } from "modules/interfaces/currencies";
import { UserInfo } from "modules/interfaces/userInfo";
import { numberFormatter } from "modules/numberFormatter";
import { Currency } from "redux/currency/currency";
import { changeCurrency } from "redux/currency/currencyActions";
import { State } from "redux/rootReducer";

interface AccountInfoProps {
    userID: number,
    currency: Currency,
    changeCurrency: (currency: Currency) => void,
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

        // Request - vrací informace o uživateli, podle ID
        axios.get(`http://localhost:8080/api/userInfo/userID=${props.userID}`, {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setUserInfo(data))
            .catch((error) => console.log(error));

    }, [ props.userID ])


    /**
    * Změna aktivní měny
    * 
    * @param event 
    */
    const changeActiveCurrency = (event: React.MouseEvent<HTMLInputElement>) => {

        setActiveCurrency((event.target as HTMLInputElement).value)
    }


    const { changeCurrency, currency } = props;
    
    const isCurrencyEqual: boolean = (currency.name === activeCurrency ? true : false);

    useEffect(() => {

        if (!isCurrencyEqual) {

            // Změna měny (redux)
            changeCurrency({
                exchangeRate: currencies[activeCurrency],
                name: activeCurrency
            });
        }

    }, [ isCurrencyEqual, changeCurrency, currencies, activeCurrency ])


    let isCZK: string = "";
    let isEUR: string = "";
    let isJPY: string = "";
    let isUSD: string = "";

    // Změna třídy tlačítka (zvýraznění aktivní měny)
    switch (activeCurrency) {

        case "CZK": isCZK = styles.active; break;
        case "EUR": isEUR = styles.active; break;
        case "JPY": isJPY = styles.active; break;
        case "USD": isUSD = styles.active; break;
    }

    // Zůstatek * hodnota kurzu
    let balance: number = userInfo.balance * props.currency.exchangeRate;


    /**
     * Vykreslení
     */
    return (
        <div className={styles.account}>

            {/* Obrázek */}
            <img className={styles.previewImage} src={safeLogo} alt="Safe" />

            {/* Jméno uživatele */}
            <div className={styles.user}>
                {userInfo.name} {userInfo.surname}
            </div>

            {/* Číslo účtu */}
            <div className={styles.accountNumber}>
                {userInfo.accountNumber}
            </div>

            {/* Aktuální zůstatek */}
            <div>Aktuální zůstatek:
                <div className={styles.balance}>
                    {numberFormatter(balance.toFixed(2))} {props.currency.name}
                </div>
            </div>

            {/* Panel tlačítek */}
            <div className={styles.buttonPanel}>
                <input type="button" className={isCZK} onClick={changeActiveCurrency} value="CZK" />
                <input type="button" className={isEUR} onClick={changeActiveCurrency} value="EUR" />
                <input type="button" className={isJPY} onClick={changeActiveCurrency} value="JPY" />
                <input type="button" className={isUSD} onClick={changeActiveCurrency} value="USD" />
            </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
