/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react'
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from 'react-redux'

import styles from "components/overview-page/payment-report/payment-report.module.css";
import Months from "modules/Months"
import { MonthSum } from "modules/interfaces/monthSum";
import { State } from "redux/rootReducer";

interface BalanceGraphsProps {
    userID: number
}

const BalanceGraphs: React.FC<BalanceGraphsProps> = (props) => {


    // Rozměry plátna
    const CANVAS_DIMENSION = {
        width: 340,
        height: 100
    }


    // Příjmy / výdaje za poslední 3 měsíce
    const [ monthsSum, setMonthsSum ] = useState<Array<MonthSum>>([])


    // Plátno
    const canvas = useRef<HTMLCanvasElement>(null);


    /**
     * Získání dat
     */
    useEffect(() => {

        // Request - vrací součet plateb za 3 mesíce
        axios.get(`http://localhost:8080/api/payments/sum/graphs/userID=${props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setMonthsSum(data))
            .catch((error) => console.log(error))

    }, [props.userID])

    
    useEffect(() => {

        // Vykreslení grafů
        if (monthsSum.length) drawGraphs();

    }, [ monthsSum ])


    /**
     * Vykreslení grafů
     */
    const drawGraphs = (): void => {

        // Maximální hodnota
        let maxValue: number = 0;

        // Nastavení nejvýšší hodnoty
        for (let value of monthsSum) {
            
            if (value.income > maxValue) {
                maxValue = value.income;
            }

            if (value.costs > maxValue) {
                maxValue = value.costs;
            } 
        }

        // Šířka plátna - odsazení zprava
        let WIDTH: number = CANVAS_DIMENSION.width - 20;

        // Výška plátna
        const HEIGHT: number = CANVAS_DIMENSION.height;

        // Šířka sloupce grafu
        const GRAPH_WIDTH: number = 25;

        for (let i = 0; i < 3; i++) {

            // Výpočet výšky sloupce grafu
            let costs: number = Math.round(((monthsSum[i].costs / maxValue) * HEIGHT));
            let income: number = Math.round(((monthsSum[i].income / maxValue) * HEIGHT));

            // Animace grafu nákladů
            if (costs > 0) graphAnimation(WIDTH - GRAPH_WIDTH, HEIGHT, HEIGHT - costs, "#B22222", GRAPH_WIDTH);

            // Animace grafu příjmů
            if (income > 0) graphAnimation(WIDTH - (2 * GRAPH_WIDTH) - 3, HEIGHT, HEIGHT - income, "#0f862f", GRAPH_WIDTH);

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
    const graphAnimation = (positionX: number, positionY: number, endPosition: number, color: string, grapWidth: number): void => {

        if (canvas.current) {

            const context: CanvasRenderingContext2D | null = canvas.current.getContext("2d");

            // Odsazení grafů od okraje
            const BOTTOM_MARGIN: number = 4;
            const TOP_MARGIN: number = 8;

            requestAnimationFrame(function loop() {

                if (context) {

                    positionY = positionY - 1;

                    context.fillStyle = color;
                    context.fillRect(positionX, (positionY - BOTTOM_MARGIN), grapWidth, 1);

                    if ((positionY - TOP_MARGIN) > endPosition) requestAnimationFrame(loop);
                }
            });
        }
    }


    /**
     * Vykreslení
     */
    return (
        <div className={styles.graphs}>

            {/* Plátno s grafy */}
            <canvas className={styles.canvas} 
                    ref={canvas}
                    width={CANVAS_DIMENSION.width} 
                    height={CANVAS_DIMENSION.height} />

            {/* Měsíce */}
            <div className={styles.months}>

                {monthsSum.slice(0).reverse().map(item => 
                    
                    <div key={item.month}>
                        {Months[item.month as keyof typeof Months]}
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(BalanceGraphs)
