import React, {Component} from "react";

import styles from "components/new-payment/new-payment.module.css";
import numberFormatter from "modules/numberFormatter";

export default class InputPanelExchangeRate extends Component {


    /**
     * Vykreslení
     */
    render() {

        const { currency, amount, label } = this.props;

        // Přepočet na CZK
        const exchangeRate = (amount * this.props.exchangeRate).toFixed(2);

        return(
            <div className={(currency === "CZK" ? styles.hide : "")}>
                
                <div className={styles.exchangeRate}>

                    <div>{label}&nbsp;
                        <b>{numberFormatter(exchangeRate)} CZK</b>
                    </div>

                </div>
            </div>
        )
    }
}