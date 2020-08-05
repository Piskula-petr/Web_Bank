import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/overviewPage.css";

// Komponenty
import AccountInfo from "./AccountInfo";
import CreditCardInfo from "./CreditCardInfo";
import PaymentsReport from "./PaymentsReport";
import PaymentHistory from "./PaymentHistory";

export default class OverviewIndex extends Component {

// Změna titulku ///////////////////////////////////////////////////////////////////

    componentDidMount() {
        document.title = "Přehled | Web Bank";
    }

// Vykreslení //////////////////////////////////////////////////////////////////////

    render() {

        return (
            <div id="content">

                <div id="firstColumn">
                    <AccountInfo userID={this.props.userID} />
                    <CreditCardInfo userID={this.props.userID} />
                        
                    <Link id="newPayment" to="/nova-platba">Nová platba</Link>

                    <PaymentsReport userID={this.props.userID} />
                </div>

                <PaymentHistory userID={this.props.userID} />
            </div>
        )
    }

}