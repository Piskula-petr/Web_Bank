import React, { useState, useEffect } from 'react'
import { View, ImageBackground, ScrollView, Text } from 'react-native'
import axios from 'axios'
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";

import { styles } from "components/history-page/HistoryPageStyle";
import background from "assets/background.jpg";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import { IP_ADRESS } from "modules/IPAdress";
import { State } from "modules/redux/rootReducer";
import { Currency } from "modules/redux/currency/currency";
import { dateFormatter } from "modules/dateFormatter";
import { numberFormatter } from "modules/numberFormatter";
import { Payment } from "modules/interfaces/payment";

interface HistoryPageProps {
    userID: number,
    currency: Currency
}

const HistoryPage: React.FC<HistoryPageProps> = (props) => {


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

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací platby ze zadaného měsíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/month/userID=${props.userID}&month=${month}&year=${year}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({ data }) => setPayments(data))
                    .catch((error) => console.log(error));

                // Request - vrací celkový počat plateb
                axios.get(`http://${IP_ADRESS}:8080/api/payments/count/userID=${props.userID}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({data: { paymentsCount }}) => setPaymentsCount(paymentsCount))
                    .catch((error) => console.log(error));
            }
        });

    }, [ props.userID ])


    /**
     * Zobrazení dalších plateb
     */
    const showMorepayments = (): void => {

        // Datum poslední zobrazené platby
        const lastPaymentDate: Date = payments[payments.length - 1].paymentDate;

        // Datum předchozího měsíce¨
        let date: Date = new Date(lastPaymentDate);
        date.setMonth(date.getMonth());

        const previousMonth: number = date.getMonth();
        const year: number = date.getFullYear();

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací platby ze zadaného měsíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/month/userID=${props.userID}&month=${previousMonth}&year=${year}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({ data }) => setPayments([...payments, ...data]))
                    .catch((error) => console.log(error));
            }
        });
    }


    /**
     * Vykreslení
     */
    return (
        <ImageBackground source={background} style={styles.container}>
            
            <ScrollView>
                <View style={styles.container}>

                    {payments.map(item => 

                        <View key={item.id}>

                            {/* Datum platby */}
                            <Text>{dateFormatter(item.paymentDate.toString()).substring(0, 6)}</Text>
                            
                            <View>
                                <Text>{item.name}</Text>
                                <Text>{item.paymentType}</Text>
                            </View>
                            
                        </View>    
                    )}

                </View>
            </ScrollView>

            {/* Navigační panel */}
            <NavigationPanel isHistoryActive={true} />

        </ImageBackground>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps) (HistoryPage)
