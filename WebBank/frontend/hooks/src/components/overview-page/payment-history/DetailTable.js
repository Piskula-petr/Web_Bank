import React from "react"

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import dateFormatter from "modules/dateFormatter";

function DetailTable(props) {


    /**
     * Vykreslení
     */
    return (
        <div className={styles.detail}>

            <div className={styles.detailBorder}></div>

            {/* Číslo účtu */}
            <div className={`${styles.accountNumber} ${(props.item.accountNumber === "0" ? styles.hide : "")}`}>
                
                <div>Číslo účtu:</div>
                <div>{props.item.accountNumber}</div>

            </div>

            {/* Variabilní symbol */}
            <div className={`${styles.variableSymbol} ${(props.item.variableSymbol === "0" ? styles.hide : "")}`}>
                
                <div>Variabilní symbol:</div>
                <div>{props.item.variableSymbol}</div>

            </div>

            {/* Konstantní symbol */}
            <div className={`${styles.constantSymbol} ${(props.item.constantSymbol === "0" ? styles.hide : "")}`}>
                
                <div>Konstantní symbol:</div>
                <div>{props.item.constantSymbol}</div>

            </div>

            {/* Specifický symbol */}
            <div className={`${styles.specificSymbol} ${(props.item.specificSymbol === "0" ? styles.hide : "")}`}>
                
                <div>Specifický symbol:</div>
                <div>{props.item.specificSymbol}</div>

            </div>

            {/* ID transakce */}
            <div className={styles.paymentID}>
                
                <div>ID transakce:</div>
                <div>{props.item.id}</div>

            </div>

            {/* Datum platby */}
            <div className={styles.date}>
                
                <div>Datum platby:</div>
                <div>{dateFormatter(props.item.paymentDate)}</div>

            </div>
        </div>
    )
}

export default DetailTable
