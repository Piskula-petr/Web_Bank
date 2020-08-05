import React, {Component} from "react";

import Months from "./Months"

export default class BalanceGraphs extends Component {

// Konstruktor //////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.state = {

            // Rozměry plátna
            width: 340,
            height: 100,

            // Aktuální měsíc
            currentMonth: 0,

            // Příjmy / Výdaje
            monthsSum: [],
        }

        this.drawGraphs = this.drawGraphs.bind(this);
    }

// Získání dat ////////////////////////////////////////////////////////////////////

    componentDidMount() {

        fetch("http://localhost:8080/api/payments/sum/" + this.props.userID)
            .then(response => response.json().then(data => this.setState({

                monthsSum: data,
                currentMonth: new Date().getMonth() + 1,

            }, () => this.drawGraphs()
        )));
    }

// Vykreslení grafů ////////////////////////////////////////////////////////////////

    drawGraphs() {

        let maxValue = 0;

        // Nastavení nejvýšší hodnoty
        for (let value of this.state.monthsSum) {
            
            if (value.income > maxValue) {
                maxValue = value.income;
            }

            if (value.costs > maxValue) {
                maxValue = value.costs;
            } 
        }

        // Šířka plátna - odsazení zprava
        let WIDTH = this.state.width - 20;

        // Výška plátna
        let HEIGHT = this.state.height;

        // Šířka sloupce grafu
        let GRAPH_WIDTH = 25;

        const context = this.refs.canvas.getContext("2d");

        for (let i = 0; i < 3; i++) {

            // Výpočet výšky sloupce grafu
            let costs = ((this.state.monthsSum[i].costs / maxValue) * HEIGHT).toFixed(1);
            let income = ((this.state.monthsSum[i].income / maxValue) * HEIGHT).toFixed(1);

            // Graf výdajů
            context.fillStyle = "#B22222";
            context.fillRect(WIDTH - GRAPH_WIDTH, HEIGHT - costs, GRAPH_WIDTH, costs);
    
            // Graf příjmů
            context.fillStyle = "#0f862f";
            context.fillRect(WIDTH - (2 * GRAPH_WIDTH) - 3, HEIGHT - income, GRAPH_WIDTH, income);
           
            // Snížení šířky
            WIDTH = WIDTH - 123;
        }
    }

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        return(
            <div id="graphs">
                <canvas id="canvas" 
                        ref="canvas"
                        width={this.state.width} 
                        height={this.state.height} 
                />

                <table>
                    <tbody>
                        <tr>
                            <td>
                                {Months[this.state.currentMonth - 2]}
                            </td>

                            <td>
                                {Months[this.state.currentMonth - 1]}
                            </td>

                            <td>
                                {Months[this.state.currentMonth]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}