/* eslint-disable default-case */
import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { changeCurrency } from "redux/currency/currencyActions";
import { Dispatch } from "redux";
import { State } from "redux/rootReducer";
import { Currency } from "redux/currency/currency";

import styles from "components/overview-page/account-info/account-info.module.css";
import safe from "images/safe.png";
import numberFormatter from "modules/numberFormatter";

interface AccountInfoProps {
    userID: number,
    currency: Currency,
    changeCurrency: (currency: Currency) => void
}

interface AccountInfoState {

    userInfo: {
        id: number,
        name: string,
        surname: string,
        balance: number,
        currency: string,
        accountNumber: string,
    },

    currencies: {
        CZK: number,
        EUR: number,
        JPY: number,
        USD: number,

        [key: string]: number
    },

    activeCurrency: string,
}

class AccountInfo extends Component <AccountInfoProps, AccountInfoState> {


    /**
     * Konstruktor
     * 
     * @param props
     */
    constructor(props: AccountInfoProps) {
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
    componentDidMount(): void {

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
    changeActiveCurrency = (event: React.MouseEvent<HTMLInputElement>): void => {

        this.setState({

            activeCurrency: (event.target as HTMLInputElement).value

        // Callback
        }, () => {

            const { activeCurrency } = this.state;
            const { currency } = this.props;

            const isCurrencyEqual: boolean = (activeCurrency === currency.name ? true : false);

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
    render(): JSX.Element {

        let isCZK: string = "";
        let isEUR: string = "";
        let isJPY: string = "";
        let isUSD: string = "";

        // Změna třídy tlačítka (zvýraznění aktivní měny)
        switch (this.state.activeCurrency) {

            case "CZK": isCZK = styles.active; break;
            case "EUR": isEUR = styles.active; break;
            case "JPY": isJPY = styles.active; break;
            case "USD": isUSD = styles.active; break;
        }

        // Zůstatek * hodnota kurzu
        let balance: number = this.state.userInfo.balance * this.props.currency.exchangeRate;

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