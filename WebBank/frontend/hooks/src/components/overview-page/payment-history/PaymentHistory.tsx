import React, {useState, useEffect} from 'react'
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from 'react-redux'

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import DetailTable from "components/overview-page/payment-history/DetailTable";
import numberFormatter from "modules/numberFormatter";
import dateFormatter from "modules/dateFormatter";
import { Payment } from 'modules/interfaces/payment';
import { State } from "redux/rootReducer";
import { Currency } from "redux/currency/currency";

interface PaymentHistoryProps {
    userID: number,
    currency: Currency
}

const PaymentHistory: React.FC<PaymentHistoryProps> = (props) => {


    // Celkový počet plateb
    const [ paymentsCount, setPaymentsCount ] = useState<number>(0);


    // Platby
    const [ payments, setPayments ] = useState<Array<Payment>>([]);


    /**
     * Získání dat
     */
    useEffect(() => {

        const date: Date = new Date();
        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${props.userID}&month=${month}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setPayments(data))
            .catch((error) => console.log(error));

        // Request - vrací celkový počat plateb
        axios.get(`http://localhost:8080/api/payments/count/userID=${props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({data : { paymentsCount }}) => setPaymentsCount(paymentsCount))
            .catch((error) => console.log(error));

    }, [props.userID])


    /**
     * Zobrazení dalších plateb
     */
    const showMorepayments = (): void => {

        // Datum poslední zobrazené platby
        const lastPaymentDate: Date = payments[payments.length - 1].paymentDate;

        // Datum předchozího měsíce
        let date: Date = new Date(lastPaymentDate);
        date.setMonth(date.getMonth());

        const previousMonth: number = date.getMonth();
        const year: number = date.getFullYear();

        // Request - vrací platby ze zadaného měsíce
        axios.get(`http://localhost:8080/api/payments/month/userID=${props.userID}&month=${previousMonth}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setPayments([...payments, ...data]))
            .catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    return (
        <div className={styles.history}>

            {payments.map(item =>

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

                            {numberFormatter((item.amount * props.currency.exchangeRate).toFixed(2))}&nbsp;
                            
                            {props.currency.name}
                        </div>
                    </summary>

                    {/* Detail platby */}
                    <DetailTable payment={item} />

                </details>
            )}

            {/* Načtení starších plateb */}
            <div className={`${styles.buttonContainer} ${(payments.length === paymentsCount ? styles.hide : "")}`}>
                <button onClick={showMorepayments}>Načíst starší platby</button>
            </div>

        </div>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps)(PaymentHistory)
