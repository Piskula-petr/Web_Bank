import React from 'react'

import styles from "components/new-payment-page/new-payment-page.module.css";
import numberFormatter from "modules/numberFormatter";

interface InputPanelExchangeRateProps {
    label: string,
    amount: string,
    exchangeRate: number
}

const InputPanelExchangeRate: React.FC<InputPanelExchangeRateProps> = (props) => {

    const { label } = props;

    // Změna desetinné značky
    const amount: string = props.amount.replace(",", ".");

    // Přepočet na CZK
    const exchangeRate: string = (parseFloat(amount) * props.exchangeRate).toFixed(2);

    /**
     * Vykreslení
     */
    return (
        <div className={(props.exchangeRate === 1 || props.amount === "" ? styles.hide : "")}>
                
            <div className={styles.exchangeRate}>

                <div>{label}&nbsp;
                    <b>{numberFormatter(exchangeRate)} CZK</b>
                </div>

            </div>
        </div>
    )
}

export default InputPanelExchangeRate