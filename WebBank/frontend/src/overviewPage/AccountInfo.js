import React, {Component} from "react";
import safe from "../images/safe.png";

import NumberFormatter from "../NumberFormatter";

export default class AccountInfo extends Component {

// Konstruktor ///////////////////////////////////////////////////////////////

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
                EUR: false,
                JPY: false,
                USD: false,
            },
        }

        this.changeActiveCurrency = this.changeActiveCurrency.bind(this);
    }

// Získání dat ///////////////////////////////////////////////////////////////

    componentDidMount() {

        // Request - vrací seznam aktuálních kurzů
        fetch("https://api.exchangerate.host/latest?base=CZK&symbols=EUR,JPY,USD")
            .then(response => response.json().then(data => this.setState({
                
            currencies: {
                CZK: data.rates.CZK,
                EUR: data.rates.EUR,
                JPY: data.rates.JPY,
                USD: data.rates.USD,
            } 
        })));

        // Request - vrací uživatele, podle ID
        fetch("http://localhost:8080/api/user", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: this.props.userID,

        }).then(response => response.json().then(data => this.setState({
            user: data,
        })));
    }

// Změna stavu měny ////////////////////////////////////////////////////////////////

    changeActiveCurrency(event) {

        this.setState({
            activeCurrency: {
                [event.target.value]: true,
            },
        }, () => {

            // Nastavení kurzu a názvu měny
            const activeCurrency = this.state.activeCurrency;
            for (let key in activeCurrency) {
                
                if (activeCurrency[key]) {

                    // Vybraná měna
                    const currency = {
                        exchangeRate: this.state.currencies[key],
                        name: key,
                    }
                    
                    // Nastavení měny (předek)
                    this.props.setCurrency(currency);
                }
            }
        });
    }

// Vykreslení ////////////////////////////////////////////////////////////////////////

    render() {

        // Změna třídy tlačítka
        let isCZK = (this.state.activeCurrency.CZK ? "active" : "");
        let isEUR = (this.state.activeCurrency.EUR ? "active" : "");
        let isJPY = (this.state.activeCurrency.JPY ? "active" : "");
        let isUSD = (this.state.activeCurrency.USD ? "active" : "");

        // Zůstatek * hodnota kurzu
        let balance = parseFloat(this.state.user.balance) * this.props.currency.exchangeRate;

        return(
            <div id="account">

                <img src={safe} alt="Safe" />

                <div id="user">{this.state.user.name} {this.state.user.surname}</div>
                <div id="accountNumber">{this.state.user.accountNumber}</div>

                <div>Aktuální zůstatek:
                    <div id="balance">{NumberFormatter(balance.toFixed(2))} {this.props.currency.name}</div>
                </div>

                <div id="buttonPanel">
                    <input type="button" className={isCZK} onClick={this.changeActiveCurrency} value="CZK" />
                    <input type="button" className={isEUR} onClick={this.changeActiveCurrency} value="EUR" />
                    <input type="button" className={isJPY} onClick={this.changeActiveCurrency} value="JPY" />
                    <input type="button" className={isUSD} onClick={this.changeActiveCurrency} value="USD" />
                </div>
            </div>
        )
    }

}