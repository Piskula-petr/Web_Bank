import React, {Component} from "react";

import MonthReport from "./MonthReport";
import BalanceGraphs from "./BalanceGraphs";

export default class PaymentReport extends Component {

// Vykreslení //////////////////////////////////////////////////////

    render() {

        // userID={this.props.userID} currency={this.state.currency}

        return(
            <div id="report">

                <MonthReport {...this.props} />

                <BalanceGraphs userID={this.props.userID} />
            </div>
        )
    }
}