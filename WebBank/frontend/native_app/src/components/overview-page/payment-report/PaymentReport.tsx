import React from 'react'
import { View } from 'react-native'

import { styles } from "components/overview-page/payment-report/paymentReportStyle";
import MonthReport from "components/overview-page/payment-report/MonthReport";
import BalanceGraphs from "components/overview-page/payment-report/BalanceGraphs";

const PaymentReport = () => {


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>
            
            {/* Přehled měsíce */}
            <MonthReport />

            {/* Grafy zůstatku za poslední 3 měsíce */}
            <BalanceGraphs />

        </View>
    )
}

export default PaymentReport
