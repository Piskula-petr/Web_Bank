import React, {useEffect, useReducer, useState} from 'react'
import {Redirect} from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios';
import Cookies from 'js-cookie';

import styles from "components/new-payment/new-payment.module.css";
import paymentLogo from "images/payment.png";
import confirmationCode from "modules/confirmationCode";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import InputPanel from "components/new-payment/input-panel/InputPanel";
import InputPanelWithBankCode from "components/new-payment/input-panel/InputPanelWithBankCode";
import InputPanelWithCurrencies from "components/new-payment/input-panel/InputPanelWithCurrencies"
import InputPanelExchangeRate from "components/new-payment/input-panel/InputPanelExchangeRate"
import InputPanelWithConfirmation from "components/new-payment/input-panel/InputPanelWithConfirmation";

const NewPayment = (props) => {


    // Úspěšná platba
    const [ successfulPayment, setSuccessfulPayment ] = useState(false);

    
    // Přepínač výběru bankovních kódů
    const [ bankCodeSelectionToggle, setBankCodeSelectionToggle ] = useState(false);


    // Výchozí data nové platby
    const initialNewPayment = {

        // Parametry nové platby
        newPayment: {
            userID: props.userID,
            name: "",
            mark: "-",
            accountNumber: "",
            amount: "",
            currency: "CZK",
            variableSymbol: "",
            constantSymbol: "",
            specificSymbol: "",
            paymentDate: new Date(),
            paymentType: "Platba bankovním převodem"
        },

        // Chybové zprávy
        paymentError: {
            nameError: "",
            accountNumberError: "",
            amountError: "",
            variableSymbolError: "",
            constantSymbolError: "",
            specificSymbolError: "",
            confirmationError: ""
        },

        // Prefix čísla účtu
        accountNumberPrefixInput: "",

        // Kód banky
        bankCode: "",

        // Zadaná částka
        amountInput: "",

        // Směnný kurz na CZK
        exchangeRateToCZK: 1,

        // Zadaný ověřovací kód
        inputConfirmationCode: "",

        // Vygenerování 5 místného potvzovacího kódu
        generatedConfirmationCode: confirmationCode(),
    }


    // Reducer
    const [ state, dispatch ] = useReducer((state, action) => {

        switch (action.type) {

            case "SET_CHANGE":

                return { ...state, newPayment: action.payload.newPayment }

            case "SET_ACCOUNT_NUMBER_PREFIX": 

                return { ...state, accountNumberPrefixInput: action.payload }

            case "SET_AMOUNT":

                return { ...state, amountInput: action.payload }

            case "SET_BANK_CODE":

                return { ...state, bankCode: action.payload }
            
            case "SET_CONFIRMATION":

                return { ...state, inputConfirmationCode: action.payload }

            case "SET_EXCHANGE_RATE":

                return { ...state, exchangeRateToCZK: action.payload }

            case "FETCH_ERROR":

                return action.payload

            default: throw new Error("Error: Unexisting action type");
        }

    }, initialNewPayment);


    useEffect(() => {

        // Změna titulku stránky
        document.title = "Nová platba | Web Bank";

    }, [])


    /**
     * Změna vstupních údajů
     * 
     * @param event 
     */
    const handleChange = (event) => {

        const name = event.target.name;

        const validValue = (event.target.validity.valid 
            ? event.target.value 
                : state.newPayment[event.target.name]);

        dispatch({
            type: "SET_CHANGE",
            payload: {
                newPayment: {
                    ...state.newPayment,
                    [name]: validValue
                }
            }
        })
    }


    /**
     * Změna číšla účtu
     * 
     * @param} event 
     */
    const handleAccountNumberPrefix = (event) => {

        const validValue = (event.target.validity.valid 
            ? event.target.value 
                : state.accountNumberPrefixInput);

        dispatch({
            type: "SET_ACCOUNT_NUMBER_PREFIX",
            payload: validValue
        })
    }


    /**
     * Změna bankovního kódu
     * 
     * @param event 
     */
    const handleBankCodeSelection = (event) => {

        dispatch({
            type: "SET_BANK_CODE",
            payload: event.target.attributes.name.value
        })
    }


    /**
     * Změna částky platby
     * 
     * @param event 
     */
    const handleAmount = (event) => {

        const validValue = (event.target.validity.valid
            ? event.target.value
                : state.amountInput);

        dispatch({
            type: "SET_AMOUNT",
            payload: validValue
        })
    }


    /**
     * Změna směnného kurzu
     * 
     * @param event 
     */
    const handleExchangeRate = (event) => {

        const value = event.target.value;

        // Request - vrací aktuální směnný kurz
        axios.get(`https://api.exchangerate.host/latest?base=${value}`)
            .then(({data: { rates }}) => {

            dispatch({
                type: "SET_EXCHANGE_RATE",
                payload: rates.CZK
            })

        }).catch((error) => console.log(error));
    }


    /**
     * Změna potvrzovacího kódu
     * 
     * @param event 
     */
    const handleConfirmationCode = (event) => {

        const validValue = (event.target.validity.valid 
            ? event.target.value
                : state.inputConfirmationCode);

        dispatch({
            type: "SET_CONFIRMATION",
            payload: validValue
        })
    }


    /**
     * Odeslání formuláře
     * 
     * @param event 
     */
    const handleSubmit = (event) => {

        event.preventDefault();

        const { newPayment, inputConfirmationCode, generatedConfirmationCode } = state;

        // Složení celého čísla účtu
        const accountNumber = state.accountNumberPrefixInput + "/" + state.bankCode;
        newPayment.accountNumber = accountNumber;

        // Změna desetinné značky
        if (isNaN(state.amountInput)) {

            newPayment.amount = state.amountInput.replace(",", ".");
        }

        // Přepočet na CZK
        newPayment.amount = (newPayment.amount * state.exchangeRateToCZK).toFixed(2);

        // Shodný ověřovací kód
        if (generatedConfirmationCode === parseInt(inputConfirmationCode)) {

            // Odeslání nové platby
            axios.post("http://localhost:8080/api/newPayment", newPayment, {

                headers: {
                    "Authorization": "Bearer " + Cookies.getJSON("jwt").token
                }

            }).then(() => {
                
                // Úspěšná platba
                setSuccessfulPayment(true);

            }).catch(({response: { data }}) => {

                let accountNumberError = data.accountNumber;

                // Nastavení chybové zprávy, při nevybrání bankovního kódu
                if (state.newPayment.accountNumber.length >= 10 && state.bankCode === "") {
    
                    accountNumberError = "Kód banky musí být zadán";
                }
    
                dispatch({
                    type: "FETCH_ERROR",
                    payload: {
                        ...state,
                        paymentError: {
                            nameError: data.name,
                            accountNumberError: accountNumberError,
                            amountError: data.amount,
                            variableSymbolError: data.variableSymbol,
                            constantSymbolError: data.constantSymbol,
                            specificSymbolError: data.specificSymbol,
                            confirmationError: ""
                        },
    
                        // Vynulování ověřovacího kódu
                        inputConfirmationCode: "",

                        // Vygenerování nového ověřovacího kódu
                        generatedConfirmationCode: confirmationCode()
                    }
                })
            });

        // Nesprávný ověřovací kód
        } else if (generatedConfirmationCode !== parseInt(inputConfirmationCode)) {

            dispatch({
                type: "FETCH_ERROR",
                payload: {
                    ...state,
                    paymentError: {
                        nameError: "",
                        accountNumberError: "",
                        amountError: "",
                        variableSymbolError: "",
                        constantSymbolError: "",
                        specificSymbolError: "",
                        confirmationError: "Ověřovací kód není správný"
                    },

                    // Vygenerování nového ověřovacího kódu
                    generatedConfirmationCode: confirmationCode()
                }
            })
        }
    }


    // Přesměrování na přihlášení
    if (props.userID === 0) {
        return <Redirect to="/prihlaseni" />
    }

    // Přesměrování na stránku přehledu, při úspěšně odeslané platbě
    if (successfulPayment) {
        return <Redirect to="/prehled" />;
    }

    /**
     * Vykreslení
     */
    return (
        <div className={styles.content}>

            {/* Navigační panel (odhlášení) */}
            <NavigationPanel
                timeInterval={5 * 60} 
                backLabel="Přehled"/>

            <div className={styles.container}>

                {/* Logo */}
                <img className={styles.logo} src={paymentLogo} alt="Payment" />

                <h1>Nová platba</h1>
                <hr/> <br/>

                {/* Formulář nové platby */}
                <form className={styles.newPayment} onSubmit={handleSubmit}>

                    {/* Oddělující sekce */}
                    <div className={styles.separator}>
                        <div>Povinné údaje</div> <hr/>
                    </div>

                    {/* Název platby */}
                    <InputPanel 
                        name="name"
                        label="Název platby:" 
                        placeholder="Název platby" 
                        pattern="[\p{L} 0-9]*"
                        value={state.newPayment.name}
                        error={state.paymentError.nameError} 
                        onChange={handleChange} />

                    {/* Číslo účtu */}
                    <InputPanelWithBankCode 
                        name="accountNumber"
                        label="Číslo účtu:"
                        placeholder="7253962689" 
                        pattern="[0-9]{0,10}"
                        value={state.accountNumberPrefixInput}
                        error={state.paymentError.accountNumberError} 
                        onChange={handleAccountNumberPrefix} 
                        toggleBankCodes={() => setBankCodeSelectionToggle(!bankCodeSelectionToggle)}
                        onClick={handleBankCodeSelection} 
                        bankCode={state.bankCode} 
                        selection={bankCodeSelectionToggle} />

                    {/* Částka */}
                    <InputPanelWithCurrencies 
                        name="amount" 
                        label="Částka:" 
                        placeholder="0,00" 
                        pattern="^[1-9]\d*((\.|,)\d{0,2})?$"
                        value={state.amountInput}
                        error={state.paymentError.amountError} 
                        onChange={handleAmount}
                        onClick={handleExchangeRate} />

                    {/* Přepočet měny */}
                    <InputPanelExchangeRate 
                        label="Aktuální přepočet:" 
                        amount={state.amountInput} 
                        exchangeRate={state.exchangeRateToCZK} />

                    {/* Oddělující sekce */}
                    <div className={styles.separator}>
                        <div>Nepovinné údaje</div> <hr/>
                    </div>

                    {/* Variabilní symbol */}
                    <InputPanel 
                        name="variableSymbol" 
                        label="Variabilní symbol:" 
                        pattern="[0-9]{0,10}"
                        value={state.newPayment.variableSymbol}
                        error={state.paymentError.variableSymbolError} 
                        onChange={handleChange} />

                    {/* Konstantní symbol */}
                    <InputPanel 
                        name="constantSymbol" 
                        label="Konstantní symbol:" 
                        pattern="[0-9]{0,10}"
                        value={state.newPayment.constantSymbol}
                        error={state.paymentError.constantSymbolError} 
                        onChange={handleChange} />

                    {/* Specifický symbol */}
                    <InputPanel 
                        name="specificSymbol" 
                        label="Specifický symbol:" 
                        pattern="[0-9]{0,10}"
                        value={state.newPayment.specificSymbol}
                        error={state.paymentError.specificSymbolError} 
                        onChange={handleChange} />

                    {/* Oddělující sekce */}
                    <div className={styles.separator}>
                        <div>Ověření</div> <hr/>
                    </div>

                    {/* conformationCode */}
                    <InputPanelWithConfirmation 
                        name="confirmationCode" 
                        label="Ověřovací kód:" 
                        pattern="[0-9]{0,5}"
                        value={state.inputConfirmationCode}
                        error={state.paymentError.confirmationError} 
                        onChange={handleConfirmationCode} 
                        generatedConfirmationCode={state.generatedConfirmationCode} />

                    <button type="submit">Odeslat platbu</button>

                </form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
 
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(NewPayment)
