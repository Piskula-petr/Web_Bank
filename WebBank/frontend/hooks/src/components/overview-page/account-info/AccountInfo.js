/* eslint-disable default-case */
import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Cookies from 'js-cookie';
import { changeCurrency } from "redux/currency/currencyActions";

import styles from "components/overview-page/account-info/account-info.module.css";
import safe from "images/safe.png";
import numberFormatter from "modules/numberFormatter";

const AccountInfo = (props) => {


    // Informace o uživateli
    const [ userInfo, setUserInfo ] = useState({
        id: 0,
        name: "",
        surname: "",
        balance: 0,
        currency: "",
        accountNumber: ""
    });


    // Seznam aktuálních kurzů
    const [ currencies, setCurrencies ] = useState({
        CZK: 0,
        EUR: 0,
        JPY: 0,
        USD: 0
    });


    // Aktivní měna
    const [ activeCurrency, setActiveCurrency ] = useState("CZK");


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
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setUserInfo(data))
            .catch((error) => console.log(error));

    }, [ props.userID ])


    /**
    * Změna aktivní měny
    * 
    * @param event 
    */
    const changeActiveCurrency = (event) => {

        setActiveCurrency(event.target.value)
    }


    const { changeCurrency, currency } = props;
    
    const isCurrencyEqual = (currency.name === activeCurrency ? true : false);

    useEffect(() => {

        if (!isCurrencyEqual) {

            // Změna měny (redux)
            changeCurrency({
                exchangeRate: currencies[activeCurrency],
                name: activeCurrency
            });
        }

    }, [ isCurrencyEqual, changeCurrency, currencies, activeCurrency ])


    let isCZK = "";
    let isEUR = "";
    let isJPY = "";
    let isUSD = "";

    // Změna třídy tlačítka (zvýraznění aktivní měny)
    switch (activeCurrency) {

        case "CZK": isCZK = styles.active; break;
        case "EUR": isEUR = styles.active; break;
        case "JPY": isJPY = styles.active; break;
        case "USD": isUSD = styles.active; break;
    }

    // Zůstatek * hodnota kurzu
    let balance = parseFloat(userInfo.balance) * props.currency.exchangeRate;

    /**
     * Vykreslení
     */
    return (
        <div className={styles.account}>

            {/* Obrázek */}
            <img className={styles.previewImage} src={safe} alt="Safe" />

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

const mapStateToProps = (state) => {

    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        changeCurrency: (currency) => dispatch(changeCurrency(currency))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
