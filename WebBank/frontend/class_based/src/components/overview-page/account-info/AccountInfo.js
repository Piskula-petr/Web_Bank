/* eslint-disable default-case */
import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { changeCurrency } from "redux/currency/currencyActions";

import styles from "components/overview-page/account-info/account-info.module.css";
import safe from "images/safe.png";
import numberFormatter from "modules/numberFormatter";

class AccountInfo extends Component {


    /**
     * Konstruktor
     * 
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {

            // Informace o uživateli
            userInfo: {
                id: 0,
                name: "",
                surname: "",
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
            activeCurrency: "CZK",
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
        axios.get(`http://localhost:8080/api/userInfo/userID=${this.props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            userInfo: data,

        })).catch((error) => console.log(error));
    }


    /**
     * Změna měny
     * 
     * @param event 
     */
    changeActiveCurrency = (event) => {

        this.setState({

            activeCurrency: event.target.value

        // Callback
        }, () => {

            const { activeCurrency } = this.state;
            const { currency } = this.props;

            const isCurrencyEqual = (activeCurrency === currency.name ? true : false);

            if (!isCurrencyEqual) {

                // Změna měny (redux)
                this.props.changeCurrency({
                    exchangeRate: this.state.currencies[activeCurrency],
                    name: activeCurrency
                });
            }
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
        switch (this.state.activeCurrency) {

            case "CZK": isCZK = styles.active; break;
            case "EUR": isEUR = styles.active; break;
            case "JPY": isJPY = styles.active; break;
            case "USD": isUSD = styles.active; break;
        }

        // Zůstatek * hodnota kurzu
        let balance = parseFloat(this.state.userInfo.balance) * this.props.currency.exchangeRate;

        const { name, surname, accountNumber } = this.state.userInfo;

        return(
            <div className={styles.account}>

                {/* Obrázek */}
                <img className={styles.previewImage} src={safe} alt="Safe" />

                {/* Jméno uživatele */}
                <div className={styles.user}>
                    {name} {surname}
                </div>

                {/* Číslo účtu */}
                <div className={styles.accountNumber}>
                    {accountNumber}
                </div>

                {/* Aktuální zůstatek */}
                <div>Aktuální zůstatek:
                    <div className={styles.balance}>
                        {numberFormatter(balance.toFixed(2))} {this.props.currency.name}
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

export default connect(mapStateToProps, mapDispatchToProps) (AccountInfo)