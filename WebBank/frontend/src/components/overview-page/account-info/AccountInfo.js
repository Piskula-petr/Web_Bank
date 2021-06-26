/* eslint-disable default-case */
import React, {Component} from "react";
import axios from "axios";

import styles from "components/overview-page/account-info/account-info.module.css";
import safe from "images/safe.png";
import NumberFormatter from "modules/NumberFormatter";

export default class AccountInfo extends Component {


    /**
     * Konstruktor
     * 
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {

            // Uživatel
            user: {
                id: this.props.userID,
                name: "",
                surname: "",
                email: "",
                clientNumber: 0,
                password: "",
                balance: 0,
                currency: "",
                accountNumber: "",
            },

            // Seznam aktuálních kurzů
            currencies: {
                CZK: 0,
                EUR: 0,
                JPY: 0,
                USD: 0,
            },

            // Aktivní měna
            activeCurrency: {
                CZK: true,
            },
        }
    }


    /**
     * Získání dat
     */
    componentDidMount() {

        // Request - vrací seznam aktuálních kurzů
        axios.get("https://api.exchangerate.host/latest?base=CZK&symbols=CZK,EUR,JPY,USD")
            .then(({ data: { rates } }) => this.setState({

            currencies: {
                CZK: rates.CZK,
                EUR: rates.EUR,
                JPY: rates.JPY,
                USD: rates.USD,
            }

        })).catch((error) => console.log(error));

        // Request - vrací uživatele, podle ID
        axios.get("http://localhost:8080/api/user/userID=" + this.props.userID)
            .then(({ data }) => this.setState({

            user: data,

        })).catch((error) => console.log(error));
    }


    /**
     * Změna měny
     * 
     * @param event 
     */
    changeActiveCurrency = (event) => {

        this.setState({

            activeCurrency: {
                [event.target.value]: true,
            },

        // Callback
        }, () => {

            // Klíč měny [CZK]
            const currencyKey = Object.keys(this.state.activeCurrency)[0];

            const currency = {
                exchangeRate: this.state.currencies[currencyKey],
                name: currencyKey,
            }

            // Nastavení měny (předek)
            this.props.setCurrency(currency);
        });
    }


    /**
     * Vykreslení
     */
    render() {

        let isCZK = "";
        let isEUR = "";
        let isJPY = "";
        let isUSD = "";

        // Změna třídy tlačítka (zvýraznění aktivní měny)
        switch (Object.keys(this.state.activeCurrency)[0]) {

            case "CZK": isCZK = styles.active; break;
            case "EUR": isEUR = styles.active; break;
            case "JPY": isJPY = styles.active; break;
            case "USD": isUSD = styles.active; break;
        }

        // Zůstatek * hodnota kurzu
        let balance = parseFloat(this.state.user.balance) * this.props.currency.exchangeRate;

        return(
            <div className={styles.account}>

                {/* Obrázek */}
                <img className={styles.previewImage} src={safe} alt="Safe" />

                {/* Jméno uživatele */}
                <div className={styles.user}>
                    {this.state.user.name} {this.state.user.surname}
                </div>

                {/* Číslo účtu */}
                <div className={styles.accountNumber}>
                    {this.state.user.accountNumber}
                </div>

                {/* Aktuální zůstatek */}
                <div>Aktuální zůstatek:
                    <div className={styles.balance}>
                        {NumberFormatter(balance.toFixed(2))} {this.props.currency.name}
                    </div>
                </div>

                {/* Panel tlačítek */}
                <div className={styles.buttonPanel}>
                    <input type="button" className={isCZK} onClick={this.changeActiveCurrency} value="CZK" />
                    <input type="button" className={isEUR} onClick={this.changeActiveCurrency} value="EUR" />
                    <input type="button" className={isJPY} onClick={this.changeActiveCurrency} value="JPY" />
                    <input type="button" className={isUSD} onClick={this.changeActiveCurrency} value="USD" />
                </div>
            </div>
        )
    }

}