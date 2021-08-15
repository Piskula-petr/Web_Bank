import React, {PureComponent, createRef} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { MonthSum } from "modules/interfaces/monthSum";
import { State } from "redux/rootReducer";

import styles from "components/overview-page/payment-report/payment-report.module.css";
import Months from "modules/Months"

interface BalanceGraphsProps {
    userID: number
}

interface BalanceGraphsState {
    width: number,
    height: number,
    monthsSum: Array<MonthSum>,
}

class BalanceGraphs extends PureComponent <BalanceGraphsProps, BalanceGraphsState> {


    // Plátno
    private canvas = createRef<HTMLCanvasElement>();


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: BalanceGraphsProps) {
        super(props);

        this.state = {

            // Rozměry plátna
            width: 340,
            height: 100,

            // Příjmy / výdaje za poslední 3 měsíce
            monthsSum: [],
        }
    }


    /**
     * Získání dat
     */
    componentDidMount(): void {

        // Request - vrací součet plateb za 3 mesíce
        axios.get(`http://localhost:8080/api/payments/sum/graphs/userID=${this.props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            monthsSum: data

        // Callback    
        }, () => this.drawGraphs()))
            .catch((error) => console.log(error));
    }


    /**
     * Vykreslení grafů
     */
    drawGraphs = (): void => {

        // Maximální hodnota
        let maxValue: number = 0;

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
        let WIDTH: number = this.state.width - 20;

        // Výška plátna
        const HEIGHT: number = this.state.height;

        // Šířka sloupce grafu
        const GRAPH_WIDTH: number = 25;

        for (let i = 0; i < 3; i++) {

            // Výpočet výšky sloupce grafu
            let costs: number = Math.round(((this.state.monthsSum[i].costs / maxValue) * HEIGHT));
            let income: number = Math.round(((this.state.monthsSum[i].income / maxValue) * HEIGHT));

            // Animace grafu nákladů
            if (costs > 0) this.graphAnimation(WIDTH - GRAPH_WIDTH, HEIGHT, HEIGHT - costs, "#B22222", GRAPH_WIDTH);

            // Animace grafu příjmů
            if (income > 0) this.graphAnimation(WIDTH - (2 * GRAPH_WIDTH) - 3, HEIGHT, HEIGHT - income, "#0f862f", GRAPH_WIDTH);

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
    graphAnimation = (positionX: number, positionY: number, endPosition: number, color: string, grapWidth: number) => {

        if (this.canvas.current) {

            const context: CanvasRenderingContext2D | null = this.canvas.current.getContext("2d");
            
            // Odsazení grafů od okraje
            const BOTTOM_MARGIN: number = 4;
            const TOP_MARGIN: number = 8;
            
            requestAnimationFrame(function loop() {
                
                positionY = positionY - 1;
                
                if (context) {
                    
                    context.fillStyle = color;
                    context.fillRect(positionX, (positionY - BOTTOM_MARGIN), grapWidth, 1);
                }

                if ((positionY - TOP_MARGIN) > endPosition) requestAnimationFrame(loop);
            });
        }
    }


    /**
     * Vykreslení
     */
    render():JSX.Element {

        return(
            <div className={styles.graphs}>

                {/* Plátno s grafy */}
                <canvas className={styles.canvas} 
                        ref={this.canvas}
                        width={this.state.width} 
                        height={this.state.height} />

                {/* Měsíce */}
                <div className={styles.months}>

                    {this.state.monthsSum.slice(0).reverse().map(item =>
                    
                        <div key={item.month}>
                            {Months[item.month as keyof typeof Months]}
                        </div>
                    )}

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {

    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps) (BalanceGraphs)