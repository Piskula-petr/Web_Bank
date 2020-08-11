import React, {Component} from "react";

import NumberFormatter from "../NumberFormatter";

export default class InputPanelExchangeRate extends Component {

// Vykreslení //////////////////////////////////////////////////////////////

    render() {

        // Zobrazení směnného kurzu
        const showExchangeRate = (this.props.currency === "CZK" ? false : true);

        // Přepočet na CZK
        const exchangeRate = (this.props.amount * this.props.exchangeRate).toFixed(2);

        return(
            <tr className={(showExchangeRate ? "" : "hide")}>
                <td></td>
                
                <td id="exchangeRate">
                    <div>{this.props.label}&nbsp;
                        <b>{NumberFormatter(exchangeRate)} CZK</b>
                    </div>
                </td>
            </tr>
        )
    }
}