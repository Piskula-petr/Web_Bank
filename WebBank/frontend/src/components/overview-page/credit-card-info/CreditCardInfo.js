import React, {Component} from "react";
import axios from "axios";

import creditCard from "images/credit_card.png";
import styles from "components/overview-page/credit-card-info/credit-card-info.module.css";

export default class CreditCardInfo extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {

            // Kreditní karta
            creditCard: {
                id: 0,
                cardNumber: 0,
                validFrom: "",
                validTo: "",
                type: "",
            },

            // Jméno Uživatele
            name: "",
            surname: "",
        }
    }


    /**
     * Získání dat
     */
    componentDidMount() {

        // Request - vrací kreditní kartu, podle ID uživatele
        axios.get("http://localhost:8080/api/creditCard/userID=" + this.props.userID)
            .then(({ data }) => this.setState({

            creditCard: data,

        })).catch((error) => console.log(error));

        // Request - vrací uživatele, podle ID
        axios.get("http://localhost:8080/api/user/userID=" + this.props.userID)
            .then(({ data }) => this.setState({

            name: data.name,
            surname: data.surname,

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.creditCard}>
                
                {/* Obrázek */}
                <img className={styles.previewImage} src={creditCard} alt="Credit Card" />

                {/* Typ platební karty */}
                <div className={styles.type}>
                    {this.state.creditCard.type}
                </div>

                {/* Jméno uživatele */}
                <div className={styles.user}>
                    {this.state.name} {this.state.surname}
                </div>
                
                {/* Platí od */}
                <div className={styles.validFrom}>
                    Platí od: <b>{this.state.creditCard.validFrom}</b>
                </div>

                {/* Platí do */}
                <div className={styles.validTo}>
                    Platí do: <b>{this.state.creditCard.validTo}</b>
                </div>

                {/* Číslo kreditní karty */}
                <div>Číslo karty:
                    <div className={styles.cardNumber}>{this.state.creditCard.cardNumber}</div>
                </div>
            </div>
        )
    }

}