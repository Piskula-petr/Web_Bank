import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import DetailTable from "components/overview-page/payment-history/DetailTable";
import numberFormatter from "modules/numberFormatter";
import dateFormatter from "modules/dateFormatter";

export default class PaymentHistory extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
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
    componentDidMount() {

        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${this.props.userID}&month=${month}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            payments: data

        })).catch((error) => console.log(error));


        // Request - vrací celkový počat plateb
        axios.get(`http://localhost:8080/api/payments/count/userID=${this.props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            paymentsCount: data.paymentsCount   

        })).catch((error) => console.log(error));
    }


    /**
     * Zobrazení dalších plateb
     */
    showMorepayments = () => {

        let payments = this.state.payments;
        const length = this.state.payments.length;

        // Datum poslední zobrazené platby
        const lastPaymentDate = this.state.payments[length - 1].paymentDate;

        // Datum předchozího měsíce
        let date = new Date(lastPaymentDate);
        date.setMonth(date.getMonth());

        const previousMonth = date.getMonth();
        const year = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${this.props.userID}&month=${previousMonth}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => {

            payments.push(...data);

            this.setState({
                payments: payments,
            });

        }).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.history}>

                {this.state.payments.map(item =>

                    <details className={styles.paymentContainer} key={item.id}>

                        {/* Platba */}
                        <summary className={styles.payment}>

                            {/* Datum platby */}
                            <div className={styles.paymentDate}>
                                {dateFormatter(item.paymentDate).substring(0, 6)}
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
                        <DetailTable item={item} />

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