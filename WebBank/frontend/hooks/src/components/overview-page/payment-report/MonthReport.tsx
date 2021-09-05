/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import graph from "images/graph.png";
import leftArrow from "images/left_arrow.png";
import rightArrow from "images/right_arrow.png";
import Months from "modules/Months";
import numberFormatter from "modules/numberFormatter";
import { SelectedMonth } from "modules/interfaces/selectedMonth";
import { State } from "redux/rootReducer";
import { Status } from "modules/enums/status";
import { Currency } from 'redux/currency/currency';

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

        // Request - vrací součet plateb za měsíc
        axios.get(`http://localhost:8080/api/payments/sum/month/userID=${props.userID}&month=${month}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setSelectedMonth({

            name: Months[month as keyof typeof Months],
            number: month,
            year: year,
            income: data.income,
            costs: data.costs,
            balance: data.balance

        })).catch((error) => console.log(error));
    }


    /**
     * Nastavení součtu plateb měsíce
     * 
     * @param status = Enum [next, previous]
     */
    const monthSum = (status: Status) => {

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

    const mark: string = (selectedMonth.balance < 0 ? "-" : "");

    const income: number = selectedMonth.income * props.currency.exchangeRate;
    const costs: number = selectedMonth.costs * props.currency.exchangeRate;
    const balance: number = selectedMonth.balance * props.currency.exchangeRate;

    /**
     * Vykreslení
     */
    return (
        <div>

            {/* Obrázek */}
            <img className={styles.previewImage} src={graph} alt="Graph" />

            {/* Název měsíce + navigační šipky */}
            <div className={styles.month}>
                <img className={styles.leftArrow} src={leftArrow} alt="Left Arrow" onClick={() => monthSum(Status.previous)} />

                {selectedMonth.name}

                <img className={`${styles.rightArrow} ${(selectedMonth.number === currentMonth ? styles.hide : "")}`} 
                    src={rightArrow} alt="Right Arrow" onClick={() => monthSum(Status.next)} />
            </div>

            {/* Měsíční příjem */}
            <div className={styles.income}>
                &#43;{numberFormatter(income.toFixed(2))}&nbsp;
                {props.currency.name}
            </div>

            {/* Měsíční výdaje */}
            <div className={styles.costs}>
                &#45;{numberFormatter(costs.toFixed(2))}&nbsp;
                {props.currency.name}
            </div>

            {/* Měsíční zůstatek */}
            <div className={`${styles.balance} ${(selectedMonth.balance > 0 ? styles.plus : styles.minus)}`}>
                {mark}{numberFormatter(balance.toFixed(2))}&nbsp;
                {props.currency.name}
            </div>
        </div>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}


export default connect(mapStateToProps)(MonthReport)
