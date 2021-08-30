import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import Canvas, { CanvasRenderingContext2D } from "react-native-canvas";
import { connect } from "react-redux";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import { styles } from "components/overview-page/payment-report/paymentReportStyle";
import { Months } from 'modules/Months';
import { State } from "modules/redux/rootReducer";
import { MonthSum } from "modules/interfaces/monthSum";
import { IP_ADRESS } from "modules/IPAdress";

interface BalanceGraphsProps {
    userID: number
}

const BalanceGraphs: React.FC<BalanceGraphsProps> = (props) => {


    // Příjmy / výdaje za poslední 3 měsíce
    const [ monthsSum, setMonthsSum ] = useState<Array<MonthSum>>([])


    // Plátno
    const canvas = useRef<Canvas>(null);


    /**
     * Získání dat
     */
    useEffect(() => {

        // Získání JWT z uložiště
        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací součet plateb za 3 mesíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/sum/graphs/userID=${props.userID}`, {

                    headers: {
                        "Authorization": "Bearer " + token
                    }

                }).then(({ data }) => setMonthsSum(data))
                    .catch((error) => console.log(error));
            }
        });

    }, [ props.userID ])


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

        if (canvas.current) {

            // Šířka plátna - odsazení zprava
            let WIDTH: number = canvas.current.width - 20;

            // Výška plátna
            const HEIGHT: number = canvas.current.height;

            // Šířka sloupce grafu
            const GRAPH_WIDTH: number = 25;

            for (let i = 0; i < 3; i++) {

                // Výpočet výšky sloupce grafu
                let costs: number = Math.round((monthsSum[i].costs / maxValue) * HEIGHT);
                let income: number = Math.round((monthsSum[i].income / maxValue) * HEIGHT);

                // Graf nákladů
                drawgraph(WIDTH - GRAPH_WIDTH, HEIGHT - costs, "#B22222", GRAPH_WIDTH, costs);

                // Graf příjmů
                drawgraph(WIDTH - (2 * GRAPH_WIDTH) - 3, HEIGHT - income, "#0f862f", GRAPH_WIDTH, income);

                // Snížení šířky
                WIDTH = WIDTH - 99; // -99 => Šířka sloupce grafu (příjmy / náklady)
            }
        }
    }


    /**
     * Animace grafu
     * 
     * @param positionX - pozice X
     * @param positionY - pozice Y
     * @param color - barva
     * @param grapWidth - šířka grafu
     * @param graphHeight - výška grafu
     */
    const drawgraph = (positionX: number, positionY: number, color: string, grapWidth: number, graphHeight: number): void => {

        if (canvas.current) {

            const context: CanvasRenderingContext2D = canvas.current.getContext("2d")

            context.fillStyle = color;
            context.fillRect(positionX, positionY, grapWidth, graphHeight);
        }
    }


    /**
     * Vykreslení
     */
    return (
        <View>

            {/* Plátno s grafy */}
            <Canvas ref={canvas} style={styles.canvas} />

            {/* Měsíce */}
            <View style={styles.months}>
                {monthsSum.slice(0).reverse().map((item, index) => 

                    <View key={index}>
                        <Text style={styles.monthGraph}>
                            {Months[item.month as keyof typeof Months]}
                        </Text>
                    </View>

                )}
            </View>
        </View>
    )
}

const mapStateToProps = (state: State) => {
    
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps) (BalanceGraphs)
