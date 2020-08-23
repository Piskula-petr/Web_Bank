import React, {Component} from "react";
import creditCard from "../images/credit_card.png";

export default class CreditCardInfo extends Component {

// Konstruktor ///////////////////////////////////////////////////////////////

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

// Získání dat ///////////////////////////////////////////////////////////////

    componentDidMount() {

        // Request - vrací kreditní kartu, podle ID uživatele
        fetch("http://localhost:8080/api/credit-card", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: this.props.userID,

        }).then(response => response.json().then(data => this.setState({
            creditCard: data,
        })));

        // Request - vrací uživatele, podle ID
        fetch("http://localhost:8080/api/user", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: this.props.userID,

        }).then(response => response.json().then(data => this.setState({
            name: data.name,
            surname: data.surname,
        })));
    }

// Vykreslení ////////////////////////////////////////////////////////////////

    render() {

        return(
            <div id="creditCard">
                
                <img src={creditCard} alt="Credit Card" />

                <div id="type">{this.state.creditCard.type}</div>
                <div id="user">{this.state.name} {this.state.surname}</div>
                
                <div id="validFrom">Platí od: <b>{this.state.creditCard.validFrom}</b></div>
                <div id="validTo">Platí do: <b>{this.state.creditCard.validTo}</b></div>

                <div>Číslo karty:
                    <div id="cardNumber">{this.state.creditCard.cardNumber}</div>
                </div>
            </div>
        )
    }

}