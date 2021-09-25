import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import Canvas, { CanvasRenderingContext2D } from "react-native-canvas";
import { connect } from "react-redux";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from '@react-navigation/native';

import { styles } from "components/overview-screen/payment-report/paymentReportStyle";
import { Months } from 'modules/Months';
import { State } from "modules/redux/rootReducer";
import { MonthSum } from "modules/interfaces/monthSum";
import { IP_ADRESS } from "modules/IPAdress";

interface BalanceGraphsProps {
    userID: number
}

const BalanceGraphs: React.FC<BalanceGraphsProps> = (props) => {


    const isFocused = useIsFocused();


    // Příjmy / výdaje za poslední 3 měsíce
    const [ monthsSum, setMonthsSum ] = useState<Array<MonthSum>>([])


    // Plátno
    const canvas = useRef<Canvas>(null);


    /**
     * Rozměry plátna
     */
    useEffect(() => {

        if (canvas.current) {

            canvas.current.height = 90;
            canvas.current.width = 329;
        }

    }, [canvas ])


    /**
     * Získání dat
     */
    useEffect(() => {

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací součet plateb za 3 měsíce
                axios.get(`http://${IP_ADRESS}:8080/api/payments/sum/graphs/userID=${props.userID}`, {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => setMonthsSum(data))
                    .catch((error) => console.log(error));
            }
        });

    }, [ isFocused ])

    
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

            // Výška plátna - odsazení
            const HEIGHT: number = canvas.current.height - 10;

            // Šířka sloupce grafu
            const GRAPH_WIDTH: number = 25;

            for (let i = 0; i < 3; i++) {

                // Výpočet výšky sloupce grafu
                let costs: number = Math.round((monthsSum[i].costs / maxValue) * HEIGHT);
                let income: number = Math.round((monthsSum[i].income / maxValue) * HEIGHT);

                const context: CanvasRenderingContext2D = canvas.current.getContext("2d")

                // Sloupec nákladů
                context.fillStyle = "#B22222";
                context.fillRect(
                    WIDTH - GRAPH_WIDTH, 
                    HEIGHT - costs, 
                    GRAPH_WIDTH, 
                    costs);

                // Graf příjmů
                context.fillStyle = "#0F862F";
                context.fillRect(
                    WIDTH - (2 * GRAPH_WIDTH) - 3, // -3 => mezera mezi sloupci
                    HEIGHT - income, 
                    GRAPH_WIDTH, 
                    income);

                // Snížení šířky zprava
                WIDTH = WIDTH - 121; // -121 => šířka sloupce grafu (příjmy + náklady)
            }
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
