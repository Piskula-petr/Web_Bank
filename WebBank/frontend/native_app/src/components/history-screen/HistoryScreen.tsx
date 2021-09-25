import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import axios from 'axios'
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

import { styles } from "components/history-screen/HistoryScreenStyle";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import { IP_ADRESS } from "modules/IPAdress";
import { State } from "modules/redux/rootReducer";
import { Currency } from "modules/redux/currency/currency";
import { dateFormatter } from "modules/dateFormatter";
import { numberFormatter } from "modules/numberFormatter";
import { Payment } from "modules/interfaces/payment";
import DetailTable from 'components/history-screen/DetailTable';
import { StatusBar } from 'expo-status-bar';

interface HistoryPageProps {
    userID: number,
    currency: Currency
}

const HistoryPage: React.FC<HistoryPageProps> = (props) => {


    const isFocused = useIsFocused();


    // Celkový počet plateb
    const [ paymentsCount, setPaymentsCount ] = useState<number>(0);


    // Platby
    const [ payments, setPayments ] = useState<Array<Payment>>([]);


    // Zobrazení detailu plateb
    const [ paymentsToggle, setPaymentsToggle ] = useState<Array<boolean>>([]);


    /**
     * Inicializace komponenty
     */
    useEffect(() => {

        // Získání seznamu plateb
        getPayments();

    }, [ isFocused ])


    /**
     * Získání seznamu plateb
     */
    const getPayments = (): void => {

        const date: Date = new Date();
        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací platby ze zadaného měsíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/month/userID=${props.userID}&month=${month}&year=${year}`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => {

                    const payments: Array<Payment> = data;

                    setPayments(payments);
                    setPaymentsToggle(new Array(payments.length).fill(false));

                }).catch((error) => console.log(error));

                // Request - vrací celkový počat plateb
                axios.get(`http://${IP_ADRESS}:8080/api/payments/count/userID=${props.userID}`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({data: { paymentsCount }}) => setPaymentsCount(paymentsCount))
                    .catch((error) => console.log(error));
            }
        });
    }


    /**
     * Zobrazení dalších plateb
     */
    const showMorepayments = (): void => {

        // Datum poslední zobrazené platby
        const lastPaymentDate: Date = payments[payments.length - 1].paymentDate;

        // Datum předchozího měsíce
        let date: Date = new Date(lastPaymentDate);
        date.setMonth(date.getMonth());

        const previousMonth: number = date.getMonth();
        const year: number = date.getFullYear();

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací platby ze zadaného měsíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/month/userID=${props.userID}&month=${previousMonth}&year=${year}`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => {

                    const newPayments: Array<Payment> = data;

                    setPayments([...payments, ...newPayments]);
                    setPaymentsToggle([...paymentsToggle, ...new Array(newPayments.length).fill(false)]);

                }).catch((error) => console.log(error));
            }
        });
    }


    /**
     * Zobrazení / skrytí detailu platby
     * 
     * @param index - index platby
     */
    const handleToggle = (index: number): void => {
        
        // Změna boolean hodnoty podle indexu
        setPaymentsToggle(
            paymentsToggle.map((value, i) => i === index ? !value : value)
        );
    }


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>
            
            <StatusBar translucent={true} backgroundColor="transparent" style="light" />

            <ScrollView 
                refreshControl={

                    // Obnovení listu
                    <RefreshControl 
                        onRefresh={() => getPayments()} 
                        refreshing={false}/>}>
                
                {(payments.length === 0)
                
                // Načítání
                ? <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#EEE" />
                </View>
                
                // Platby
                : <View style={styles.historycontainer}>

                    {payments.map((item, index) => 

                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.paymentsContainer} 
                            onPress={() => handleToggle(index)} 
                            activeOpacity={0.8}>

                            {/* Datum platby */}
                            <Text style={styles.date}>
                                {dateFormatter(item.paymentDate.toString()).substring(0, 6)}
                            </Text>

                            <View style={styles.paymentContainer}>
                                
                                {/* Název platby */}
                                <Text style={styles.name} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>

                                {/* Typ platby */}
                                <Text style={styles.type}>{item.paymentType}</Text>

                                {/* Částka */}
                                <Text style={[styles.amount, {color: (item.mark.includes("+") ? "#0f862f" : "#B22222")}]}>
                                    {item.mark} 
                                    {numberFormatter((item.amount * props.currency.exchangeRate).toFixed(2))}&nbsp;
                                    {props.currency.name}
                                </Text>

                                {/* Detail platby */}
                                <DetailTable payment={item} detailToggle={paymentsToggle[index]} />
                                
                            </View>
                        </TouchableOpacity>    
                    )}

                    {/* Tlačítko pro načtení dalších plateb */}
                    <TouchableOpacity 
                        style={[styles.buttonContainer, {display: (payments.length === paymentsCount ? "none" : "flex")}]}
                        onPress={showMorepayments} >

                        <Text style={styles.buttonText}>Načíst starší platby</Text>
                    </TouchableOpacity>
                </View>}

            </ScrollView>

            {/* Navigační panel */}
            <NavigationPanel isHistoryActive={true} />

        </View>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps) (HistoryPage)
