import React, {Component, createRef} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";

import styles from "components/new-payment/new-payment.module.css";
import payment from "images/payment.png";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import InputPanel from "components/new-payment/input-panel/InputPanel";
import InputPanelWithBankCode from "components/new-payment/input-panel/InputPanelWithBankCode";
import InputPanelWithCurrencies from "components/new-payment/input-panel/InputPanelWithCurrencies";
import InputPanelExchangeRate from "components/new-payment/input-panel/InputPanelExchangeRate";
import InputPanelWithConfirmation from "components/new-payment/input-panel/InputPanelWithConfirmation";
import conformationCode from "modules/conformationCode";

export default class NewPayment extends Component {


    /**
     * Konstruktor
     */
    constructor(props) {
        super(props);

        this.state = {

            // Parametry nové platby
            payment: {
                userID: this.props.userID,
                name: "",
                mark: "-",
                accountNumber: "",
                amount: 0,
                currency: "CZK",
                variableSymbol: 0,
                constantSymbol: 0,
                specificSymbol: 0,
                paymentDate: new Date(),
                paymentType: "Platba bankovním převodem",
            },

            // Zadaná částka
            amountInput: 0,

            // Úspěšná platba
            successfulPayment : false,

            // Chybové zprávy
            nameError: "",
            accountNumberError: "",
            amountError: "",
            variableSymbolError: "",
            constantSymbolError: "",
            specificSymbolError: "",
            confirmationError: "",

            // Prefix čísla účtu
            accountNumberPrefix: "",

            // Bankovní kód
            bankCode: "",

            // Zobrazení výběru bankovních kódů
            bankCodeSelection: false,

            // Směnný kurz na CZK
            exchangeRateToCZK: 1,

            // Vygenerování 5 místného potvzovacího kódu
            confirmationGenerated: conformationCode(),

            // Zadaný ověřovací kód
            confirmationInput: "",
        }

        this.confirmationInputRef = createRef();
    }


    /**
     * Změna titulku stránky
     */
    componentDidMount() {

        document.title = "Nová platba | Web Bank";
    }


    /**
     * Nastavení stavu bankovního kódu
     * 
     * @param event 
     */
    setBankCode = (event) => {

        // Skrytí / zobrazení bankovních kódů + nastavení kódu při výběru
        if (event.target.id === "bankCode") {

            this.setState({
                bankCode: event.target.attributes.name.value,
                bankCodeSelection: !this.state.bankCodeSelection,
            });

        // Skrytí / zobrazení bankovních kódů
        } else {

            this.setState({
                bankCodeSelection: !this.state.bankCodeSelection,
            });
        }
    }


    /**
     * Odeslání formuláře
     * 
     * @param event 
     */
    handleSubmit = (event) => {

        event.preventDefault();

        // Vynulování zadaného ověřovacího kódu
        this.confirmationInputRef.current.value = "";

        const { confirmationGenerated, confirmationInput } = this.state;

        // Složení bankovního účtu
        const accountNumber = this.state.accountNumberPrefix + "/" + this.state.bankCode;

        // Přepočet na CZK
        const amountInCZK = (this.state.amountInput * this.state.exchangeRateToCZK).toFixed(2);

        this.setState({

            payment: {
                ...this.state.payment,
                accountNumber: accountNumber,
                amount: amountInCZK,
            }
        
        // Callback    
        }, () => {

            // Odeslání nové platby
            axios.post("http://localhost:8080/api/newPayment", this.state.payment)
                .then(() => {

                // Úspěšná platba + shodný ověřovací kód
                if (confirmationGenerated === parseInt(confirmationInput)) {

                    this.setState({
                        successfulPayment: true,
                    });

                } else if (confirmationGenerated !== parseInt(confirmationInput)) {

                    this.setState({
                        confirmationError: "Ověřovací kód není správný",

                        // Vygenerování nového ověřovacího kódu
                        confirmationGenerated: conformationCode()
                    });
                }

            }).catch(({ response: { data } }) => {

                let accountNumberError = data.accountNumber;

                // Nastavení chybové zprávy, při nevybrání bankovního kódu
                if (this.state.payment.accountNumber.length >= 10 && this.state.bankCode === "") {

                    accountNumberError = "Kód banky musí být zadán";
                }

                // Nastavení chybových zpráv
                this.setState({
                    nameError: data.name,
                    accountNumberError: accountNumberError,
                    amountError: data.amount,
                    variableSymbolError: data.variableSymbol,
                    constantSymbolError: data.constantSymbol,
                    specificSymbolError: data.specificSymbol,
                });
            });       
        });
    }


    /**
     * Změna vstupních údajů
     * 
     * @param event 
     */
    handleChange = (event) => {

        const name = event.target.name;
        let value = event.target.value;

        // Nastavení pomocných proměnných
        if (name === "accountNumberPrefix" || name === "confirmationInput" || name === "amountInput") {
            
            // Změna desetinné značky (častka platby)
            if (value.includes(",")) {

                value = value.replace(",", ".");
            }

            this.setState({
                [name]: value,
            });

        // Nastavení platebních údajů  
        } else {

            // Získání směnného kurzu vybrané měny
            if (name === "currency") {

                // Request - vrací seznam aktuálních kurzů
                axios.get(`https://api.exchangerate.host/latest?base=${value}`)
                    .then(({ data: { rates } }) => this.setState({

                    exchangeRateToCZK: rates.CZK

                })).catch((error) => console.log(error));
            }

            this.setState({

                payment: {
                    ...this.state.payment,
                    [name]: value,
                }
            });
        }
    }


    /**
     * Vykreslení
     */
    render() {

        // Přesměrování na přihlašovací stránku
        if (this.props.userID === 0) {
            return <Redirect to="/prihlaseni" />;
        }

        // Přesměrování na stránku přehledu, při úspěšně odeslané platbě
        if ( this.state.successfulPayment) {
            return <Redirect to="/prehled" />;
        }

        return(
            <div className={styles.content}>

                {/* Navigační panel (odhlášení) */}
               <NavigationPanel
                    setUserID={this.props.setUserID} 
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
                            placeholder="Nájem bytu" 
                            error={this.state.nameError} 
                            onChange={this.handleChange} />

                        {/* Číslo účtu */}
                        <InputPanelWithBankCode 
                            name="accountNumberPrefix"
                            label="Číslo účtu:"
                            placeholder="7253962689" 
                            error={this.state.accountNumberError} 
                            onChange={this.handleChange} 
                            onClick={this.setBankCode} 
                            bankCode={this.state.bankCode} 
                            selection={this.state.bankCodeSelection} />

                        {/* Částka */}
                        <InputPanelWithCurrencies 
                            name="amountInput" 
                            label="Částka:" 
                            placeholder="0,00" 
                            error={this.state.amountError} 
                            onChange={this.handleChange} />

                        {/* Přepočet měny */}
                        <InputPanelExchangeRate 
                            label="Aktuální přepočet:" 
                            currency={this.state.payment.currency}
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
                            placeholder="5795504032" 
                            error={this.state.variableSymbolError} 
                            onChange={this.handleChange} />

                        {/* Konstantní symbol */}
                        <InputPanel 
                            name="constantSymbol" 
                            label="Konstantní symbol:" 
                            placeholder="5296841057" 
                            error={this.state.constantSymbolError} 
                            onChange={this.handleChange} />

                        {/* Specifický symbol */}
                        <InputPanel 
                            name="specificSymbol" 
                            label="Specifický symbol:" 
                            placeholder="4398956257" 
                            error={this.state.specificSymbolError} 
                            onChange={this.handleChange} />

                        {/* Oddělující sekce */}
                        <div className={styles.separator}>
                            <div>Ověření</div> <hr/>
                        </div>

                        {/* Ověřovací kód */}
                        <InputPanelWithConfirmation 
                            name="confirmationInput" 
                            label="Ověřovací kód:" 
                            error={this.state.confirmationError} 
                            onChange={this.handleChange} 
                            generatedValue={this.state.confirmationGenerated} 
                            createRef={this.confirmationInputRef} />

                        <button type="submit">Odeslat platbu</button>

                    </form>
                </div>
            </div>
        )
    }
}