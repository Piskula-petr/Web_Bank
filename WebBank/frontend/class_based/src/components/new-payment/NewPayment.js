import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";

import styles from "components/new-payment/new-payment.module.css";
import payment from "images/payment.png";
import confirmationCode from "modules/confirmationCode";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import InputPanel from "components/new-payment/input-panel/InputPanel";
import InputPanelWithBankCode from "components/new-payment/input-panel/InputPanelWithBankCode";
import InputPanelWithCurrencies from "components/new-payment/input-panel/InputPanelWithCurrencies";
import InputPanelExchangeRate from "components/new-payment/input-panel/InputPanelExchangeRate";
import InputPanelWithConfirmation from "components/new-payment/input-panel/InputPanelWithConfirmation";

class NewPayment extends Component {


    /**
     * Konstruktor
     */
    constructor(props) {
        super(props);

        this.state = {

            // Úspěšná platba
            successfulPayment : false,

            // Parametry nové platby
            newPayment: {
                userID: this.props.userID,
                name: "",
                mark: "-",
                accountNumber: "",
                amount: "",
                currency: "CZK",
                variableSymbol: "",
                constantSymbol: "",
                specificSymbol: "",
                paymentDate: new Date(),
                paymentType: "Platba bankovním převodem",
            },

            // Chybové zprávy
            paymentError: {
                nameError: "",
                accountNumberError: "",
                amountError: "",
                variableSymbolError: "",
                constantSymbolError: "",
                specificSymbolError: "",
                confirmationError: "",
            },

            // Prefix čísla účtu
            accountNumberPrefixInput: "",

            // Kód banky
            bankCode: "",

            // Přepínač výběru bankovních kódů
            bankCodeSelectionToggle: false,

            // Zadaná částka
            amountInput: "",

            // Směnný kurz na CZK
            exchangeRateToCZK: 1,

            // Zadaný ověřovací kód
            inputConfirmationCode: "",

            // Vygenerování 5 místného potvzovacího kódu
            generatedConfirmationCode: confirmationCode()
        }
    }


    /**
     * Změna titulku stránky
     */
    componentDidMount() {

        document.title = "Nová platba | Web Bank";
    }


    /**
     * Změna vstupních údajů
     * 
     * @param event 
     */
     handleChange = (event) => {

        const name = event.target.name;
        
        const validValue = (event.target.validity.valid
            ? event.target.value
                : this.state.newPayment[event.target.name])

        this.setState({
            newPayment: {
                ...this.state.newPayment,
                [name]: validValue
            }
        });
    }


    /**
     * Změna čísla účtu
     * 
     * @param event 
     */
    handleAccountNumberPrefix = (event) => {

        const validValue = (event.target.validity.valid
            ? event.target.value
                : this.state.accountNumberPrefixInput);

        this.setState({
            accountNumberPrefixInput: validValue
        })
    }


    /**
     * Změna bankovního kódu
     * 
     * @param event 
     */
     handleBankCodeSelection = (event) => {

        this.setState({
            bankCode: event.target.attributes.name.value,
        });
    }


    /**
     * Změna částky platby
     * 
     * @param event 
     */
    handleAmount = (event) => {

        const validValue = (event.target.validity.valid
            ? event.target.value
                : this.state.amountInput);

        this.setState({
            amountInput: validValue
        })
    }


    /**
     * Změna směnného kurzu
     * 
     * @param event 
     */
    handleExchangeRate = (event) => {

        const value = event.target.value;

        // Request - vrací aktuální směnný kurz
        axios.get(`https://api.exchangerate.host/latest?base=${value}`)
            .then(({data: { rates }}) => {

            this.setState({
                exchangeRateToCZK: rates.CZK
            })  

        }).catch((error) => console.log(error));
    }


    /**
     * Změna potvrzovacího kódu
     * 
     * @param event 
     */
    handleConfirmationCode = (event) => {

        const validValue = (event.target.validity.valid 
            ? event.target.value
                : this.state.inputConfirmationCode);
        
        this.setState({
            inputConfirmationCode: validValue
        })
    }


    /**
     * Odeslání formuláře
     * 
     * @param event 
     */
    handleSubmit = (event) => {

        event.preventDefault();

        const { newPayment, amountInput, generatedConfirmationCode, inputConfirmationCode } = this.state;

        // Složení celého čísla účtu
        const accountNumber = this.state.accountNumberPrefixInput + "/" + this.state.bankCode;
        newPayment.accountNumber = accountNumber;

        // Změna desetinné značky
        if (isNaN(amountInput)) {

            newPayment.amount = amountInput.replace(",", ".");
        }

        // Přepočet na CZK
        newPayment.amount = (newPayment.amount * this.state.exchangeRateToCZK).toFixed(2);

        this.setState({

            newPayment
        
        // Callback    
        }, () => {

            // Shodný ověřovací kód
            if (generatedConfirmationCode === parseInt(inputConfirmationCode)) {

                // Odeslání nové platby
                axios.post("http://localhost:8080/api/newPayment", this.state.newPayment, {

                    headers: {
                        "Authorization": "Bearer " + Cookies.getJSON("jwt").token
                    }

                }).then(() => {

                    // Úspěšná platba
                    this.setState({
                        successfulPayment: true,
                    });

                }).catch(({response: { data }}) => {

                    let accountNumberError = data.accountNumber;

                    // Nastavení chybové zprávy, při nevybrání bankovního kódu
                    if (this.state.newPayment.accountNumber.length >= 10 && this.state.bankCode === "") {

                        accountNumberError = "Kód banky musí být zadán";
                    }

                    // Nastavení chybových zpráv
                    this.setState({
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
                    });
                });

            // Nesprávný ověřovací kód
            } else if (generatedConfirmationCode !== parseInt(inputConfirmationCode)) {

                this.setState({
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
                });
            }
        });
    }


    /**
     * Vykreslení
     */
    render() {

        // Přesměrování na přihlášení
        if (this.props.userID === 0) {
            return <Redirect to="/prihlaseni" />
        }

        // Přesměrování na stránku přehledu, při úspěšně odeslané platbě
        if ( this.state.successfulPayment) {
            return <Redirect to="/prehled" />;
        }

        return(
            <div className={styles.content}>

                {/* Navigační panel (odhlášení) */}
               <NavigationPanel
                    timeInterval={5 * 60} 
                    backLabel="Přehled"/>

                <div className={styles.container}>

                    {/* Logo */}
                    <img className={styles.logo} src={payment} alt="Payment" />

                    <h1>Nová platba</h1>
                    <hr/> <br/>

                    {/* Formulář nové platby */}
                    <form className={styles.newPayment} onSubmit={this.handleSubmit}>

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
                            value={this.state.newPayment.name}
                            error={this.state.paymentError.nameError} 
                            onChange={this.handleChange} />

                        {/* Číslo účtu */}
                        <InputPanelWithBankCode 
                            name="accountNumberPrefixInput"
                            label="Číslo účtu:"
                            placeholder="7253962689" 
                            pattern="[0-9]{0,10}"
                            value={this.state.accountNumberPrefixInput}
                            error={this.state.paymentError.accountNumberError} 
                            onChange={this.handleAccountNumberPrefix} 
                            toggleBankCodes={() => this.setState({ bankCodeSelectionToggle: !this.state.bankCodeSelectionToggle })}
                            onClick={this.handleBankCodeSelection} 
                            bankCode={this.state.bankCode} 
                            selection={this.state.bankCodeSelectionToggle} />

                        {/* Částka */}
                        <InputPanelWithCurrencies 
                            name="amountInput" 
                            label="Částka:" 
                            placeholder="0,00" 
                            pattern="^[1-9]\d*((\.|,)\d{0,2})?$"
                            value={this.state.amountInput}
                            error={this.state.paymentError.amountError} 
                            onChange={this.handleAmount} 
                            onClick={this.handleExchangeRate} />

                        {/* Přepočet měny */}
                        <InputPanelExchangeRate 
                            label="Aktuální přepočet:" 
                            amount={this.state.amountInput} 
                            exchangeRate={this.state.exchangeRateToCZK} />

                        {/* Oddělující sekce */}
                        <div className={styles.separator}>
                            <div>Nepovinné údaje</div> <hr/>
                        </div>

                        {/* Variabilní symbol */}
                        <InputPanel 
                            name="variableSymbol" 
                            label="Variabilní symbol:" 
                            pattern="[0-9]{0,10}"
                            value={this.state.newPayment.variableSymbol}
                            error={this.state.paymentError.variableSymbolError} 
                            onChange={this.handleChange} />

                        {/* Konstantní symbol */}
                        <InputPanel 
                            name="constantSymbol" 
                            label="Konstantní symbol:" 
                            pattern="[0-9]{0,10}"
                            value={this.state.newPayment.constantSymbol}
                            error={this.state.paymentError.constantSymbolError} 
                            onChange={this.handleChange} />

                        {/* Specifický symbol */}
                        <InputPanel 
                            name="specificSymbol" 
                            label="Specifický symbol:" 
                            pattern="[0-9]{0,10}"
                            value={this.state.newPayment.specificSymbol}
                            error={this.state.paymentError.specificSymbolError} 
                            onChange={this.handleChange} />

                        {/* Oddělující sekce */}
                        <div className={styles.separator}>
                            <div>Ověření</div> <hr/>
                        </div>

                        {/* Ověřovací kód */}
                        <InputPanelWithConfirmation 
                            name="confirmationInput" 
                            label="Ověřovací kód:" 
                            pattern="[0-9]{0,5}"
                            value={this.state.inputConfirmationCode}
                            error={this.state.paymentError.confirmationError} 
                            onChange={this.handleConfirmationCode} 
                            generatedConfirmationCode={this.state.generatedConfirmationCode} />

                        <button type="submit">Odeslat platbu</button>

                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps) (NewPayment)