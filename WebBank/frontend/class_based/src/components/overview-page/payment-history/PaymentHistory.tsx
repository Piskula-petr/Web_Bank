import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { Payment } from "modules/interfaces/payment";
import { Currency } from "redux/currency/currency";
import { State } from "redux/rootReducer";

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import DetailTable from "components/overview-page/payment-history/DetailTable";
import { numberFormatter } from "modules/numberFormatter";
import { dateFormatter } from "modules/dateFormatter";

interface PaymentHistoryProps {
    userID: number,
    currency: Currency
}

interface PaymentHistoryState {
    payments: Array<Payment>,
    paymentsCount: number,
}

class PaymentHistory extends Component <PaymentHistoryProps, PaymentHistoryState> {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: PaymentHistoryProps) {
        super(props);

        this.state = {

            // Platby
            payments: [],

            // Celkový počet plateb
            paymentsCount: 0,
        }
    }

    /**
     * Získání dat
     */
    componentDidMount(): void {

        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${this.props.userID}&month=${month}&year=${year}`, {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            payments: data

        })).catch((error) => console.log(error));


        // Request - vrací celkový počat plateb
        axios.get(`http://localhost:8080/api/payments/count/userID=${this.props.userID}`, {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({data: { paymentsCount }}) => this.setState({

            paymentsCount  

        })).catch((error) => console.log(error));
    }


    /**
     * Zobrazení dalších plateb
     */
    showMorepayments = (): void => {

        let payments: Array<Payment> = this.state.payments;

        // Datum poslední zobrazené platby
        const lastPaymentDate: Date = payments[payments.length - 1].paymentDate;

        // Datum předchozího měsíce
        let date: Date = new Date(lastPaymentDate);
        date.setMonth(date.getMonth());

        const previousMonth: number = date.getMonth();
        const year: number = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${this.props.userID}&month=${previousMonth}&year=${year}`, {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => {

            payments.push(...data);

            this.setState({
                payments
            });

        }).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render():JSX.Element {

        return(
            <div className={styles.history}>

                {this.state.payments.map(item =>

                    <details className={styles.paymentContainer} key={item.id}>

                        {/* Platba */}
                        <summary className={styles.payment}>

                            {/* Datum platby */}
                            <div className={styles.paymentDate}>
                                {dateFormatter(item.paymentDate.toString()).substring(0, 6)}
                            </div>

                            {/* Název + typ platby */}
                            <div className={styles.nameAndTypeContainer}>

                                <div className={styles.name}>
                                    {item.name}
                                </div>

                                <div className={styles.paymentType}>
                                    {item.paymentType}
                                </div>
                            </div>

                            {/* Částka */}
                            <div className={`${styles.amount} ${(item.mark.includes("+") ? styles.plus : styles.minus)}`}>
                                {item.mark}

                                {numberFormatter((item.amount * this.props.currency.exchangeRate).toFixed(2))}&nbsp;
                                
                                {this.props.currency.name}
                            </div>
                        </summary>

                        {/* Detail platby */}
                        <DetailTable payment={item} />

                    </details>
                )}

                {/* Načtení starších plateb */}
                <div className={`${styles.buttonContainer} ${(this.state.payments.length === this.state.paymentsCount ? styles.hide : "")}`}>
                    <button onClick={this.showMorepayments}>Načíst starší platby</button>
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

export default connect(mapStateToProps) (PaymentHistory)