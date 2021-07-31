import React, {Component} from "react";

import styles from "components/overview-page/payment-history/paymentHistory.module.css";
import dateFormatter from "modules/dateFormatter";

class DetailTable extends Component {

    
    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.detail}>

                <div className={styles.detailBorder}></div>

                {/* Číslo účtu */}
                <div className={`${styles.accountNumber} ${(this.props.item.accountNumber === "0" ? styles.hide : "")}`}>
                    
                    <div>Číslo účtu:</div>
                    <div>{this.props.item.accountNumber}</div>

                </div>

                {/* Variabilní symbol */}
                <div className={`${styles.variableSymbol} ${(this.props.item.variableSymbol === "0" ? styles.hide : "")}`}>
                    
                    <div>Variabilní symbol:</div>
                    <div>{this.props.item.variableSymbol}</div>

                </div>

                {/* Konstantní symbol */}
                <div className={`${styles.constantSymbol} ${(this.props.item.constantSymbol === "0" ? styles.hide : "")}`}>
                    
                    <div>Konstantní symbol:</div>
                    <div>{this.props.item.constantSymbol}</div>

                </div>

                {/* Specifický symbol */}
                <div className={`${styles.specificSymbol} ${(this.props.item.specificSymbol === "0" ? styles.hide : "")}`}>
                    
                    <div>Specifický symbol:</div>
                    <div>{this.props.item.specificSymbol}</div>

                </div>

                {/* ID transakce */}
                <div className={styles.paymentID}>
                    
                    <div>ID transakce:</div>
                    <div>{this.props.item.id}</div>

                </div>

                {/* Datum platby */}
                <div className={styles.date}>
                    
                    <div>Datum platby:</div>
                    <div>{dateFormatter(this.props.item.paymentDate)}</div>

                </div>
            </div>
        )
    }
}

export default DetailTable