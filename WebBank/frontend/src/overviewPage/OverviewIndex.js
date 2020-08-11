import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/overviewPage.css";

// Komponenty
import AccountInfo from "./AccountInfo";
import CreditCardInfo from "./CreditCardInfo";
import PaymentReport from "./PaymentReport";
import PaymentHistory from "./PaymentHistory";

export default class OverviewIndex extends Component {

// Konstruktor ////////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.state = {

            // Vybraná měna
            currency: {
                exchangeRate: 1,
                name: "CZK",
            }
        }

        this.setCurrency = this.setCurrency.bind(this);
    }

// Změna stavu vybranéhé měny ///////////////////////////////////////////////////////

    setCurrency(data) {

        this.setState({
            currency: data,
        });
    }

// Změna titulku ///////////////////////////////////////////////////////////////////

    componentDidMount() {
        document.title = "Přehled | Web Bank";
    }

// Vykreslení //////////////////////////////////////////////////////////////////////

    render() {

        return (
            <div id="content">

                <div id="firstColumn">

                    <AccountInfo userID={this.props.userID} 
                                 setCurrency={this.setCurrency} 
                                 currency={this.state.currency}
                    />
                    <CreditCardInfo userID={this.props.userID} />
                        
                    <Link id="newPaymentLink" to="/nova-platba">Nová platba</Link>

                    <PaymentReport userID={this.props.userID}
                                   currency={this.state.currency}
                    />
                </div>

                <PaymentHistory userID={this.props.userID}
                                currency={this.state.currency}
                />
            </div>
        )
    }

}