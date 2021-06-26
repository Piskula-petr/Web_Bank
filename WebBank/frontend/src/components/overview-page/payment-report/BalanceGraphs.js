import React, {Component, createRef} from "react";
import axios from "axios";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import Months from "modules/Months"

export default class BalanceGraphs extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
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

        this.canvas = createRef();
    }


    /**
     * Získání dat
     */
    componentDidMount() {

        // Request - vrací součet plateb za 3 mesíce
        axios.get("http://localhost:8080/api/payments/sum/graphs/userID=" + this.props.userID)
            .then(({ data }) => this.setState({

            monthsSum: data,
            currentMonth: new Date().getMonth() + 1,

        // Callback    
        }, () => this.drawGraphs()))
            .catch((error) => console.log(error));
    }


    /**
     * Vykreslení grafů
     */
    drawGraphs = () => {

        // Maximální hodnota
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
        const HEIGHT = this.state.height;

        // Šířka sloupce grafu
        const GRAPH_WIDTH = 25;

        for (let i = 0; i < 3; i++) {

            // Výpočet výšky sloupce grafu
            let costs = ((this.state.monthsSum[i].costs / maxValue) * HEIGHT).toFixed(1);
            let income = ((this.state.monthsSum[i].income / maxValue) * HEIGHT).toFixed(1);

            this.graphAnimation(WIDTH - GRAPH_WIDTH, HEIGHT, HEIGHT - costs, "#B22222", GRAPH_WIDTH);

            this.graphAnimation(WIDTH - (2 * GRAPH_WIDTH) - 3, HEIGHT, HEIGHT - income, "#0f862f", GRAPH_WIDTH);

            // Snížení šířky 
            WIDTH = WIDTH - 123; // -123 => Šířka sloupce grafu (příjmy / náklady)
        }
    }

    
    /**
     * Animace grafu
     * 
     * @param positionX - pozice X
     * @param positionY - pozice Y
     * @param endPosition - konečná pozice grafu
     * @param color - barva
     * @param grapWidth - šířka grafu
     */
    graphAnimation = (positionX, positionY, endPosition, color, grapWidth) => {

        const context = this.canvas.current.getContext("2d");

        // Odsazení grafů od okraje
        const BOTTOM_MARGIN = 1;
        const TOP_MARGIN = 2

        requestAnimationFrame(function loop() {

            positionY = positionY - 1;

            context.fillStyle = color;
            context.fillRect(positionX, (positionY - BOTTOM_MARGIN), grapWidth, 1);

            if ((positionY - TOP_MARGIN) > endPosition) requestAnimationFrame(loop);
        });
    }


    /**
     * Vykreslení
     */
    render() {

        return(
            <div className={styles.graphs}>

                {/* Plátno s grafy */}
                <canvas className={styles.canvas} 
                        ref={this.canvas}
                        width={this.state.width} 
                        height={this.state.height} />

                {/* Měsíce */}
                <div className={styles.months}>

                    <div>
                        {Months[this.state.currentMonth - 2]}
                    </div>

                    <div>
                        {Months[this.state.currentMonth - 1]}
                    </div>

                    <div>
                        {Months[this.state.currentMonth]}
                    </div>

                </div>
            </div>
        )
    }
}

