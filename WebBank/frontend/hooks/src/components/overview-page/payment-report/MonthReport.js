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

const MonthReport = (props) => {


    // Zobrazený měsíc
    const [ selectedMonth, setSelectedMonth ] = useState({
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

        const date = new Date();

        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        // Nastavení součtu plateb v měsíci
        setMonthSum(month, year)

    }, [])


    /**
     * Nastavení součtu plateb v měsíci
     * 
     * @param month - měsíc [1 - 12]
     * @param year - rok [yyyy] 
     */
    const setMonthSum = (month, year) => {

        // Request - vrací součet plateb za měsíc
        axios.get(`http://localhost:8080/api/payments/sum/month/userID=${props.userID}&month=${month}&year=${year}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setSelectedMonth({

            name: Months[month],
            number: month,
            year: year,
            income: data.income,
            costs: data.costs,
            balance: data.balance

        })).catch((error) => console.log(error));
    }


    /**
     * Nastavení součtu plateb z dalšího měsíce
     */
    const nextMonthSum = () => {

        let nextMonth = selectedMonth.number + 1;
        let year = selectedMonth.year;

        // Přechod na další rok
        if (nextMonth > 12) {

            nextMonth = 1;
            year = year + 1;
        }

        // Nastavení součtu plateb v měsíci
        setMonthSum(nextMonth, year)
    }


    /**
     * Nastavení součtu plateb z předešlého měsíce
     */
    const previousMonthSum = () => {

        let previousMonth = selectedMonth.number - 1;
        let year = selectedMonth.year;

        // Přechod na předchozí rok
        if (previousMonth < 1) {

            previousMonth = 12;
            year = year - 1;
        } 

        // Nastavení součtu plateb v měsíci
        setMonthSum(previousMonth, year);
    }


    // Aktuální měsíc (číselně)
    const currentMonth = new Date().getMonth() + 1;

    const mark = (selectedMonth.balance > 0 ? "+" : "");

    const income = selectedMonth.income * props.currency.exchangeRate;
    const costs = selectedMonth.costs * props.currency.exchangeRate;
    const balance = selectedMonth.balance * props.currency.exchangeRate;

    /**
     * Vykreslení
     */
    return (
        <div>

            {/* Obrázek */}
            <img className={styles.previewImage} src={graph} alt="Graph" />

            {/* Název měsíce + navigační šipky */}
            <div className={styles.month}>
                <img className={styles.leftArrow} src={leftArrow} alt="Left Arrow" onClick={previousMonthSum} />

                {selectedMonth.name}

                <img className={`${styles.rightArrow} ${(selectedMonth.number === currentMonth ? styles.hide : "")}`} 
                    src={rightArrow} alt="Right Arrow" onClick={nextMonthSum} />
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

const mapStateToProps = (state) => {
    
    return {
        userID: state.user.userID,
        currency: state.currency
    }
}


export default connect(mapStateToProps)(MonthReport)
