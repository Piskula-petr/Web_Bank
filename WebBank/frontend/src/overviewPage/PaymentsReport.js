import React, {Component} from "react";
import graph from "../images/graph.png";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";

import Months from "./Months";
import BalanceGraphs from "./BalanceGraphs";

export default class PaymentsReport extends Component {

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
        this.numberFormatter = this.numberFormatter.bind(this);
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

// Naformátování čísla ///////////////////////////////////////////////////////////

    numberFormatter(number) {

        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
            .replace(".", ",");
    }

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        // Aktuální měsíc (číselně)
        const currentMonth = new Date().getMonth() + 1;

        const mark = (this.state.selectedMonth.balance > 0 ? "+" : "");

        return(
            <div id="report">

                <img src={graph} alt="Graph" />

                <div id="month">
                    <img id="leftArrow" src={leftArrow} alt="Left Arrow" onClick={this.previousMonth} />

                    {this.state.selectedMonth.name}

                    <img id="rightArrow" 
                        className={(this.state.selectedMonth.number === currentMonth ? "hide" : "")} 
                        src={rightArrow} alt="Right Arrow" onClick={this.nextMonth} />
                </div>

                <div id="income">
                    &#43;{this.numberFormatter(this.state.selectedMonth.income.toFixed(2))} CZK
                </div>

                <div id="costs">
                    &#45;{this.numberFormatter(this.state.selectedMonth.costs.toFixed(2))} CZK
                </div>

                <div id ="balance" className={(this.state.selectedMonth.balance > 0 ? "plus" : "minus")}>
                    {mark}{this.numberFormatter(this.state.selectedMonth.balance.toFixed(2))} CZK
                </div>

                <BalanceGraphs userID={this.props.userID} />
            </div>
        )
    }
}