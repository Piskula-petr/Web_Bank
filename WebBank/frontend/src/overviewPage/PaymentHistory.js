import React, {Component} from "react";

import DetailTable from "./DetailTable.js";
import NumberFormatter from "../NumberFormatter";
import DateFormatter from "../DateFormatter";

export default class PaymentHistory extends Component {

// Konstruktor ////////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.state = {

            // Platby
            payments: [],

            // Celkový počet plateb
            paymentsCount: 0,
        }

        this.showMorepayments = this.showMorepayments.bind(this);
    }

// Získání dat ////////////////////////////////////////////////////////////////////

    componentDidMount() {

        let currentDate = new Date();

        // Request - vrací platby ze zadaného měsíce
        fetch("http://localhost:8080/api/payments/month", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({
                "userID": this.props.userID,
                "month": currentDate.getMonth() + 1,
                "year": currentDate.getFullYear(),
            }),

        }).then(response => response.json().then(data => this.setState({
            payments: data,
        })));

        // Request - vrací celkový počat plateb
        fetch("http://localhost:8080/api/payments/count", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: this.props.userID,

        }).then(response => response.json().then(data => this.setState({
            paymentsCount: data.paymentsCount,
        })));
    }

// Zobrazení dalších plateb //////////////////////////////////////////////////////

    showMorepayments() {

        const length = this.state.payments.length;

        // Datum poslední zobrazené platby
        const lastPaymentDate = this.state.payments[length - 1].paymentDate;

        // Rozložení datumu [01], [01], [2020];
        const lastPaymentDateArray = DateFormatter(lastPaymentDate).split(".");

        const month = parseInt(lastPaymentDateArray[1]) - 1;
        const year = lastPaymentDateArray[2];

        let payments = this.state.payments;

        // Request - vrací platby ze zadaného měsíce
        fetch("http://localhost:8080/api/payments/month", {

            method: "POST",
            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({
                "userID": this.props.userID,
                "month": month,
                "year": year,
            }),

        }).then(response => response.json().then(data => {

            payments.push(...data);

            this.setState({
                payments: payments,
            });
        }));
    }

// Vykreslení //////////////////////////////////////////////////////////////////////

    render() {

        let year = new Date().getFullYear();

        return(
            <div id="history">

                {this.state.payments.map((item, index) =>

                    <details id="payment" key={index}>
                        <summary>
                            <table>
                                <tbody>
                                    <tr>
                                        <td id="column1" rowSpan="2">
                                            <div id="paymentDate">
                                                {DateFormatter(item.paymentDate).replace(year, "")}
                                            </div>
                                        </td>

                                        <td id="column2">
                                            <div id="name">{item.name}</div>
                                        </td>

                                        <td id="column3" rowSpan="2">
                                            <div id="amount" className={(item.mark.includes("+") ? "plus" : "minus")}>
                                                {item.mark}

                                                {NumberFormatter((item.amount * this.props.currency.exchangeRate).toFixed(2))}&nbsp;
                                                
                                                {this.props.currency.name}
                                            </div>
                                        </td>  
                                    </tr>

                                    <tr>
                                        <td>
                                            <div id="paymentType">{item.paymentType}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </summary>

                        <DetailTable item={item} />

                    </details>
                )}

                <div id="buttonContainer" className={(this.state.payments.length === this.state.paymentsCount ? "hide" : "")}>
                    <button onClick={this.showMorepayments}>Načíst starší platby</button>
                </div>

            </div>
        )
    }

}