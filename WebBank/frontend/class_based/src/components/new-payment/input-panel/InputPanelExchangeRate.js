import React, {Component} from "react";

import styles from "components/new-payment/new-payment.module.css";
import numberFormatter from "modules/numberFormatter";

class InputPanelExchangeRate extends Component {


    /**
     * Vykreslení
     */
    render() {

        const { label } = this.props;

        // Změna desetinné značky
        const amount = (isNaN(this.props.amount) ? this.props.amount.replace(",", ".") : this.props.amount)

        // Přepočet na CZK
        const exchangeRate = (amount * this.props.exchangeRate).toFixed(2);

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