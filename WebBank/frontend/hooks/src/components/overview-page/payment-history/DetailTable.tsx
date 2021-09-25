import React from "react"

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import { dateFormatter } from "modules/dateFormatter";
import { Payment } from "modules/interfaces/payment";

interface DetailTableProps {
    payment: Payment
}

const DetailTable: React.FC<DetailTableProps> = (props) => {


    /**
     * Vykreslení
     */
    return (
        <div className={styles.detail}>

            <div className={styles.detailBorder}></div>

            {/* Číslo účtu */}
            <div className={`${styles.accountNumber} ${(props.payment.accountNumber ? styles.hide : "")}`}>
                
                <div>Číslo účtu:</div>
                <div>{props.payment.accountNumber}</div>

            </div>

            {/* Variabilní symbol */}
            <div className={`${styles.variableSymbol} ${(props.payment.variableSymbol ? styles.hide : "")}`}>
                
                <div>Variabilní symbol:</div>
                <div>{props.payment.variableSymbol}</div>

            </div>

            {/* Konstantní symbol */}
            <div className={`${styles.constantSymbol} ${(props.payment.constantSymbol ? styles.hide : "")}`}>
                
                <div>Konstantní symbol:</div>
                <div>{props.payment.constantSymbol}</div>

            </div>

            {/* Specifický symbol */}
            <div className={`${styles.specificSymbol} ${(props.payment.specificSymbol ? styles.hide : "")}`}>
                
                <div>Specifický symbol:</div>
                <div>{props.payment.specificSymbol}</div>

            </div>

            {/* ID transakce */}
            <div className={styles.paymentID}>
                
                <div>ID transakce:</div>
                <div>{props.payment.id}</div>

            </div>

            {/* Datum platby */}
            <div className={styles.date}>
                
                <div>Datum platby:</div>
                <div>{dateFormatter(props.payment.paymentDate.toString())}</div>

            </div>
        </div>
    )
}

export default DetailTable
