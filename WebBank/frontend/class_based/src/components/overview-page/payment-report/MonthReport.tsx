import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { Status } from "modules/enums/status";
import { State } from "redux/rootReducer";
import { Currency } from "redux/currency/currency";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import graphLogo from "images/graph.png";
import leftArrow from "images/left_arrow.png";
import rightArrow from "images/right_arrow.png";
import { Months } from "modules/Months";
import { numberFormatter } from "modules/numberFormatter";

interface MonthReportProps {
    userID: number,
    currency: Currency
}

interface MonthReportState {
    selectedMonth: {
        name: string,
        number: number,
        year: number,
        income: number,
        costs: number,
        balance: number,
    },
}

class MonthReport extends Component <MonthReportProps, MonthReportState> {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: MonthReportProps) {
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
    componentDidMount(): void {

        const date: Date = new Date();

        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();

        // Nastavení součtu plateb v měsíci
        this.setMonthSum(month, year);
    }


    /**
     * Nastavení součtu plateb v měsíci
     * 
     * @param month - měsíc [1 - 12]
     * @param year - rok [yyyy] 
     */
    setMonthSum = (month: number, year: number): void => {

        // Request - vrací součet plateb za měsíc
        axios.get(`http://localhost:8080/api/payments/sum/month/userID=${this.props.userID}&month=${month}&year=${year}`, {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            selectedMonth: {
                name: Months[month as keyof typeof Months],
                number: month,
                year: year,
                income: data.income,
                costs: data.costs,
                balance: data.balance,
            }    

        })).catch((error) => console.log(error));
    }


    /**
     * Nastavení součtu plateb měsíce
     * 
     * @param status = Enum [next, previous]
     */
    monthSum = (status: Status): void => {

        let month: number = 0;
        let year: number = this.state.selectedMonth.year;

        // Další měsíc
        if (status === Status.next) {

            month = this.state.selectedMonth.number + 1;
        
            if (month < 1) {

                month = 12;
                year = year - 1;
            } 

        // Předchozí měsíc
        } else if (status === Status.previous) {

            month = this.state.selectedMonth.number - 1;

            if (month > 12) {

                month = 1;
                year = year + 1;
            }
        }

        // Nastavení součtu plateb v měsíci
        this.setMonthSum(month, year);
    }


    /**
     * Vykreslení
     */
    render(): JSX.Element {

        // Aktuální měsíc (číselně)
        const currentMonth: number = new Date().getMonth() + 1;

        const mark: string = (this.state.selectedMonth.balance < 0 ? "-" : "");

        const income: number = this.state.selectedMonth.income * this.props.currency.exchangeRate;
        const costs: number = this.state.selectedMonth.costs * this.props.currency.exchangeRate;
        const balance: number = this.state.selectedMonth.balance * this.props.currency.exchangeRate;

        return(
            <div>

                {/* Obrázek */}
                <img className={styles.previewImage} src={graphLogo} alt="Graph" />

                {/* Název měsíce + navigační šipky */}
                <div className={styles.month}>
                    <img className={styles.leftArrow} src={leftArrow} alt="Left Arrow" onClick={() => this.monthSum(Status.previous)} />

                    {this.state.selectedMonth.name}

                    <img className={`${styles.rightArrow} ${(this.state.selectedMonth.number === currentMonth ? styles.hide : "")}`} 
                        src={rightArrow} alt="Right Arrow" onClick={() => this.monthSum(Status.next)} />
                </div>

                {/* Měsíční příjem */}
                <div className={styles.income}>
                    &#43;{numberFormatter(income.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                {/* Měsíční výdaje */}
                <div className={styles.costs}>
                    &#45;{numberFormatter(costs.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                {/* Měsíční zůstatek */}
                <div className={`${styles.balance} ${(this.state.selectedMonth.balance > 0 ? styles.plus : styles.minus)}`}>
                    {mark}{numberFormatter(balance.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {

    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps) (MonthReport)