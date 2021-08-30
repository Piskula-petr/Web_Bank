import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableHighlight } from 'react-native'
import { connect } from "react-redux";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import { styles } from 'components/overview-page/payment-report/paymentReportStyle';
import graph from "assets/graph.png";
import leftArrow from "assets/left_arrow.png";
import rightArrow from "assets/right_arrow.png";
import { Currency } from 'modules/redux/currency/currency';
import { State } from "modules/redux/rootReducer";
import { SelectedMonth } from "modules/interfaces/selectedMonth";
import { Months } from 'modules/Months';
import { Status } from 'modules/enums/status';
import { numberFormatter } from "modules/numberFormatter";
import { IP_ADRESS } from "modules/IPAdress";

interface MonthReportProps {
    userID: number,
    currency: Currency
}

const MonthReport: React.FC<MonthReportProps> = (props) => {


    // Zobrazený měsíc
    const [ selectedMonth, setSelectedMonth ] = useState<SelectedMonth>({
        name: "",
        number: 0,
        year: 0,
        income: 0,
        costs: 0,
        balance: 0
    }) 


    /**
     * Získání dat
     */
    useEffect(() => {

        const date: Date = new Date();

        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();

        // Nastavení součtu plateb v měsíci
        setMonthSum(month, year)

    }, [])


    /**
     * Nastavení součtu plateb v měsíci
     * 
     * @param month - měsíc [1 - 12]
     * @param year - rok [yyyy] 
     */
    const setMonthSum = (month: number, year: number): void => {

        // Získání JWT z uložiště
        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací součet plateb za měsíc
                axios.get(`http://${IP_ADRESS}:8080/api/payments/sum/month/userID=${props.userID}&month=${month}&year=${year}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({ data }) => setSelectedMonth({

                    name: Months[month as keyof typeof Months],
                    number: month,
                    year: year,
                    income: data.income,
                    costs: data.costs,
                    balance: data.balance

                }));
            }
        })
    }


    /**
     * Nastavení součtu plateb měsíce
     * 
     * @param status = Enum [next, previous]
     */
    const monthSum = (status: Status): void => {

        let month: number = 0;
        let year: number = selectedMonth.year;

        // Další měsíc
        if (status === Status.next) {

            month = selectedMonth.number + 1;

            if (month < 1) {

                month = 12;
                year = year - 1;
            } 

        // Předchozí měsíc
        } else if (status === Status.previous) {

            month = selectedMonth.number - 1;

            if (month > 12) {

                month = 1;
                year = year + 1;
            }
        }

        // Nastavení součtu plateb v měsíci
        setMonthSum(month, year)
    }


    // Aktuální měsíc (číselně)
    const currentMonth: number = new Date().getMonth() + 1;

    const mark: string = (selectedMonth.balance > 0 ? "+" : "-");

    const income: number = selectedMonth.income * props.currency.exchangeRate;
    const costs: number = selectedMonth.costs * props.currency.exchangeRate;
    const balance: number = selectedMonth.balance * props.currency.exchangeRate;

    /**
     * Vykreslení
     */
    return (
        <View>
            
            {/* Logo */}
            <Image source={graph} style={styles.logo} />

            {/* Název měsíce + navigační šipky */}
            <View style={styles.buttonContainer}>

                {/* Předchozí měsíc */}
                <TouchableHighlight onPress={() => monthSum(Status.previous)} underlayColor="transparent">
                    <Image style={styles.arrowImage} source={leftArrow} />
                </TouchableHighlight>

                <Text style={styles.month}>{selectedMonth.name}</Text>

                {/* Další měsíc */}
                <TouchableHighlight onPress={() => monthSum(Status.next)} underlayColor="transparent" 
                    style={{display: (selectedMonth.number === currentMonth ? "none" : "flex")}}>

                    <Image style={styles.arrowImage} source={rightArrow} />
                </TouchableHighlight>
            </View>

            {/* Měsíční příjem */}
            <Text style={styles.income}>
                &#43;{numberFormatter(income.toFixed(2))} {props.currency.name}
            </Text>

            {/* Měsíční výdaje */}
            <Text style={styles.costs}>
                &#45;{numberFormatter(costs.toFixed(2))} {props.currency.name}
            </Text>

            {/* Měsíční zůstatek */}
            <Text style={[styles.balance, {color: (balance > 0 ? "#0f862f" : "#B22222")}]}>
                {mark}{numberFormatter(balance.toFixed(2))} {props.currency.name}
            </Text>
        </View>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps) (MonthReport)
