import React, {Component} from "react";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import MonthReport from "./MonthReport";
import BalanceGraphs from "./BalanceGraphs";

class PaymentReport extends Component {


    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.paymentReport}>

                {/* Přehled měsíce */}
                <MonthReport />

                {/* Grafy zůstatku za poslední 3 měsíce */}
                <BalanceGraphs />

            </div>
        )
    }
}

export default PaymentReport