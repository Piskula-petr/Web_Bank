import React, { Component } from "react";

import styles from "components/new-payment-page/new-payment.module.css";
import { numberFormatter } from "modules/numberFormatter";

interface InputPanelExchangeRateProps {
    label: string
    amount: string,
    exchangeRate: number
}

class InputPanelExchangeRate extends Component <InputPanelExchangeRateProps> {


    /**
     * Vykreslení
     */
    render(): JSX.Element {

        const { label } = this.props;

        // Změna desetinné značky
        const amount: string = this.props.amount.replace(",", ".");

        // Přepočet na CZK
        const exchangeRate: string = (parseFloat(amount) * this.props.exchangeRate).toFixed(2);
        
        return(
            <div className={(this.props.exchangeRate === 1 || this.props.amount === "" ? styles.hide : "")}>
                
                <div className={styles.exchangeRate}>

                    <div>{label}&nbsp;
                        <b>{numberFormatter(exchangeRate)} CZK</b>
                    </div>

                </div>
            </div>
        )
    }
}

export default InputPanelExchangeRate