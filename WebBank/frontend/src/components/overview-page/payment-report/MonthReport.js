import React, {Component} from "react";
import axios from "axios";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import graph from "images/graph.png";
import leftArrow from "images/left_arrow.png";
import rightArrow from "images/right_arrow.png";
import Months from "modules/Months";
import NumberFormatter from "modules/NumberFormatter";

export default class MonthReport extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {

            // Zobrazený měsíc
            selectedMonth: {
                name: "",
                number: 0,
                year: 0,
                income: 0,
                costs: 0,
                balance: 0,
            },
        }
    }


    /**
     * Získání dat
     */
    componentDidMount() {

        const date = new Date();

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Nastavení součtu plateb v měsíci
        this.setMonthSum(month, year);
    }


    /**
     * Nastavení součtu plateb v měsíci
     * 
     * @param month - měsíc [1 - 12]
     * @param year - rok [yyyy] 
     */
    setMonthSum = (month, year) => {

        // Request - vrací součet plateb za měsíc
        axios.get("http://localhost:8080/api/payments/sum/month/"
            + "userID=" + this.props.userID + "&month=" + month + "&year=" + year)
            .then(({ data }) => this.setState({

            selectedMonth: {
                name: Months[month],
                number: month,
                year: year,
                income: data.income,
                costs: data.costs,
                balance: data.balance,
            }    

        })).catch((error) => console.log(error));
    }


    /**
     * Nastavení součtu plateb z dalšího měsíce
     */
    nextMonthSum = () => {

        let nextMonth = this.state.selectedMonth.number + 1;
        let year = this.state.selectedMonth.year;

        // Přechod na další rok
        if (nextMonth > 12) {

            nextMonth = 1;
            year = year + 1;
        }

        // Nastavení součtu plateb v měsíci
        this.setMonthSum(nextMonth, year);
    }


    /**
     * Nastavení součtu plateb z předešlého měsíce
     */
    previousMonthSum = () => {

        let previousMonth = this.state.selectedMonth.number - 1;
        let year = this.state.selectedMonth.year;

        // Přechod na předchozí rok
        if (previousMonth < 1) {

            previousMonth = 12;
            year = year - 1;
        } 

        // Nastavení součtu plateb v měsíci
        this.setMonthSum(previousMonth, year);
    }


    /**
     * Vykreslení
     */
    render() {

        // Aktuální měsíc (číselně)
        const currentMonth = new Date().getMonth() + 1;

        const mark = (this.state.selectedMonth.balance > 0 ? "+" : "");

        const income = this.state.selectedMonth.income * this.props.currency.exchangeRate;
        const costs = this.state.selectedMonth.costs * this.props.currency.exchangeRate;
        const balance = this.state.selectedMonth.balance * this.props.currency.exchangeRate;

        return(
            <div>

                {/* Obrázek */}
                <img className={styles.previewImage} src={graph} alt="Graph" />

                {/* Název měsíce + navigační šipky */}
                <div className={styles.month}>
                    <img className={styles.leftArrow} src={leftArrow} alt="Left Arrow" onClick={this.previousMonthSum} />

                    {this.state.selectedMonth.name}

                    <img className={`${styles.rightArrow} ${(this.state.selectedMonth.number === currentMonth ? styles.hide : "")}`} 
                        src={rightArrow} alt="Right Arrow" onClick={this.nextMonthSum} />
                </div>

                {/* Měsíční příjem */}
                <div className={styles.income}>
                    &#43;{NumberFormatter(income.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                {/* Měsíční výdaje */}
                <div className={styles.costs}>
                    &#45;{NumberFormatter(costs.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                {/* Měsíční zůstatek */}
                <div className={`${styles.balance} ${(this.state.selectedMonth.balance > 0 ? styles.plus : styles.minus)}`}>
                    {mark}{NumberFormatter(balance.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>
            </div>
        )
    }
}