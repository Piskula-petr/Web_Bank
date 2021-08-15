import React from 'react'

import styles from "components/overview-page/payment-report/payment-report.module.css";
import MonthReport from "components/overview-page/payment-report/MonthReport";
import BalanceGraphs from "components/overview-page/payment-report/BalanceGraphs";

const PaymentReport = () => {

    
    /**
     * Vykreslení
     */
    return (
        <div className={styles.paymentReport}>
            
            {/* Přehled měsíce */}
            <MonthReport />

            {/* Grafy zůstatku za poslední 3 měsíce */}
            <BalanceGraphs />

        </div>
    )
}

export default PaymentReport
