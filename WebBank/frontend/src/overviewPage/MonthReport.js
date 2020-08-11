import React, {Component} from "react";
import graph from "../images/graph.png";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";

import Months from "../Months";
import NumberFormatter from "../NumberFormatter";

export default class MonthReport extends Component {

// Konstruktor /////////////////////////////////////////////////////////////////////

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

        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
    }

// Získání dat /////////////////////////////////////////////////////////////////////

    componentDidMount() {

        const date = new Date();

        this.setState({

            selectedMonth: {
                ...this.state.selectedMonth,
                name: Months[date.getMonth() + 1],
                number: date.getMonth() + 1,
                year: date.getFullYear(),
            },
        });

        // Request - vrací součet plateb za zadaného měsíce
        fetch("http://localhost:8080/api/payments/sum/" + this.props.userID + 
            "/year=" + date.getFullYear() + "&month=" + (date.getMonth() + 1))
            .then(response => response.json().then(data => this.setState({

                selectedMonth: {
                        ...this.state.selectedMonth,
                        income: data.income,
                        costs: data.costs,
                        balance: data.balance,
                },
        })));
    }

// Načíst data z dalšího měsíce ///////////////////////////////////////////////////

    nextMonth() {

        const nextMonth = this.state.selectedMonth.number + 1;

        // Request - vrací součet plateb za zadaného měsíce
        fetch("http://localhost:8080/api/payments/sum/" + this.props.userID + 
            "/year=" + this.state.selectedMonth.year + "&month=" + nextMonth)
            .then(response => response.json().then(data => {

                if (response.ok) {

                    this.setState({
                        selectedMonth: {
                            ...this.state.selectedMonth,
                            name: Months[nextMonth],
                            number: nextMonth,
                            income: data.income,
                            costs: data.costs,
                            balance: data.balance,
                        }
                    });
                }
        }));
    }

// Načíst data z minulého měsíce /////////////////////////////////////////////////

    previousMonth () {

        const previousMonth = this.state.selectedMonth.number - 1;

        // Request - vrací součet plateb za zadaného měsíce
        fetch("http://localhost:8080/api/payments/sum/" + this.props.userID + 
            "/year=" + this.state.selectedMonth.year + "&month=" + previousMonth)
            .then(response => response.json().then(data => {

                if (response.ok) {

                    this.setState({
                        selectedMonth: {
                            ...this.state.selectedMonth,
                            name: Months[previousMonth],
                            number: previousMonth,
                            income: data.income,
                            costs: data.costs,
                            balance: data.balance,
                        }
                    });
                }
        }));
    }

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        // Aktuální měsíc (číselně)
        const currentMonth = new Date().getMonth() + 1;

        const mark = (this.state.selectedMonth.balance > 0 ? "+" : "");

        const income = this.state.selectedMonth.income * this.props.currency.exchangeRate;
        const costs = this.state.selectedMonth.costs * this.props.currency.exchangeRate;
        const balance = this.state.selectedMonth.balance * this.props.currency.exchangeRate;

        return(
            <div>

                <img src={graph} alt="Graph" />

                <div id="month">
                    <img id="leftArrow" src={leftArrow} alt="Left Arrow" onClick={this.previousMonth} />

                    {this.state.selectedMonth.name}

                    <img id="rightArrow" 
                        className={(this.state.selectedMonth.number === currentMonth ? "hide" : "")} 
                        src={rightArrow} alt="Right Arrow" onClick={this.nextMonth} />
                </div>

                <div id="income">
                    &#43;{NumberFormatter(income.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                <div id="costs">
                    &#45;{NumberFormatter(costs.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>

                <div id ="balance" className={(this.state.selectedMonth.balance > 0 ? "plus" : "minus")}>
                    {mark}{NumberFormatter(balance.toFixed(2))}&nbsp;
                    {this.props.currency.name}
                </div>
            </div>
        )
    }
}