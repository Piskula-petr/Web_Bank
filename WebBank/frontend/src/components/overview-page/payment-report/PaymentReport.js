import React, {Component} from "react";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import MonthReport from "./MonthReport";
import BalanceGraphs from "./BalanceGraphs";

export default class PaymentReport extends Component {


    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.paymentReport}>

                {/* Přehled měsíce */}
                <MonthReport 
                    userID={this.props.userID}
                    currency={this.props.currency} />

                {/* Grafy zůstatku za poslední 3 měsíce */}
                <BalanceGraphs 
                    userID={this.props.userID} />

            </div>
        )
    }
}