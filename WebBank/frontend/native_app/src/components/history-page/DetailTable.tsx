import React from 'react'
import { View, Text } from 'react-native'

import { styles } from "components/history-page/HistoryPageStyle";
import { Payment } from 'modules/interfaces/payment'
import { dateFormatter } from "modules/dateFormatter";

interface DetailTableProps {
    payment: Payment,
    detailToggle: boolean
}

const DetailTable: React.FC<DetailTableProps> = (props) => {


    const { payment, detailToggle } = props;

    /**
     * Vykreslení
     */
    return (
        <View style={[{marginVertical: 10}, {display: (detailToggle ? "flex" : "none")}]}>

            {/* Číslo účtu */}
            <View style={[styles.detailContainer, {display: (payment.accountNumber === "0" ? "none" : "flex")}]}>
                <Text style={styles.detailText}>Číslo účtu:</Text>
                <Text style={styles.detailText}>{payment.accountNumber}</Text>
            </View>

            {/* Variabilní symbol */}
            <View style={[styles.detailContainer, {display: (payment.variableSymbol === 0 ? "none" : "flex")}]}>
                <Text style={styles.detailText}>Variabilní symbol:</Text>
                <Text style={styles.detailText}>{payment.variableSymbol}</Text>
            </View>

            {/* Konstantní symbol */}
            <View style={[styles.detailContainer, {display: (payment.constantSymbol === 0 ? "none" : "flex")}]}>
                <Text style={styles.detailText}>Konstantní symbol:</Text>
                <Text style={styles.detailText}>{payment.constantSymbol}</Text>
            </View>

            {/* Specifický symbol */}
            <View style={[styles.detailContainer, {display: (payment.specificSymbol === 0 ? "none" : "flex")}]}>
                <Text style={styles.detailText}>Specifický symbol:</Text>
                <Text style={styles.detailText}>{payment.specificSymbol}</Text>
            </View>

            {/* ID transakce */}
            <View style={styles.detailContainer}>
                <Text style={styles.detailText}>ID transakce:</Text>
                <Text style={styles.detailText}>{payment.id}</Text>
            </View>

            {/* Datum platby */}
            <View style={styles.detailContainer}>
                <Text style={styles.detailText}>Datum platby:</Text>
                <Text style={styles.detailText}>{dateFormatter(payment.paymentDate.toString())}</Text>
            </View>
        </View>
    )
}

export default DetailTable
