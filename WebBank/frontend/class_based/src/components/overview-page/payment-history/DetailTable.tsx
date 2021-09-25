import React, { Component } from "react";
import { Payment } from "modules/interfaces/payment";

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import { dateFormatter } from "modules/dateFormatter";

interface DetailTableProps {
    payment: Payment
}

class DetailTable extends Component <DetailTableProps> {

    
    /**
     * Vykreslení
     */
    render(): JSX.Element {

        return(
            <div className={styles.detail}>

                <div className={styles.detailBorder}></div>

                {/* Číslo účtu */}
                <div className={`${styles.accountNumber} ${(this.props.payment.accountNumber === "0" ? styles.hide : "")}`}>
                    
                    <div>Číslo účtu:</div>
                    <div>{this.props.payment.accountNumber}</div>

                </div>

                {/* Variabilní symbol */}
                <div className={`${styles.variableSymbol} ${(this.props.payment.variableSymbol === 0 ? styles.hide : "")}`}>
                    
                    <div>Variabilní symbol:</div>
                    <div>{this.props.payment.variableSymbol}</div>

                </div>

                {/* Konstantní symbol */}
                <div className={`${styles.constantSymbol} ${(this.props.payment.constantSymbol === 0 ? styles.hide : "")}`}>
                    
                    <div>Konstantní symbol:</div>
                    <div>{this.props.payment.constantSymbol}</div>

                </div>

                {/* Specifický symbol */}
                <div className={`${styles.specificSymbol} ${(this.props.payment.specificSymbol === 0 ? styles.hide : "")}`}>
                    
                    <div>Specifický symbol:</div>
                    <div>{this.props.payment.specificSymbol}</div>

                </div>

                {/* ID transakce */}
                <div className={styles.paymentID}>
                    
                    <div>ID transakce:</div>
                    <div>{this.props.payment.id}</div>

                </div>

                {/* Datum platby */}
                <div className={styles.date}>
                    
                    <div>Datum platby:</div>
                    <div>{dateFormatter(this.props.payment.paymentDate.toString())}</div>

                </div>
            </div>
        )
    }
}

export default DetailTable