import React from 'react'

import styles from "components/new-payment/new-payment.module.css";
import numberFormatter from "modules/numberFormatter";

function InputPanelExchangeRate(props) {

    const { label } = props;

    // Změna desetinné značky
    const amount = (isNaN(props.amount) ? props.amount.replace(",", ".") : props.amount);

    // Přepočet na CZK
    const exchangeRate = (amount * props.exchangeRate).toFixed(2);

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