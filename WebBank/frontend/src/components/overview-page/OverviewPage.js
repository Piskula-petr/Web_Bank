import React, {Component} from "react";
import {Link} from "react-router-dom";

import styles from "components/overview-page/overviewPage.module.css";
import NavigationPanel from "../navigation-panel/NavigationPanel";
import AccountInfo from "components/overview-page/account-info/AccountInfo";
import CreditCardInfo from "components/overview-page/credit-card-info/CreditCardInfo";
import PaymentReport from "./payment-report/PaymentReport";
import PaymentHistory from "./payment-history/PaymentHistory";

export default class OverviewPage extends Component {


    /**
     * Konstruktor
     * 
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {

            // Vybraná měna
            currency: {
                exchangeRate: 1,
                name: "CZK",
            }
        }
    }


    /**
     * Změna vybrané měny
     * 
     * @param data 
     */
    setCurrency = (data) => {

        this.setState({
            currency: data,
        });
    }


    /**
     * Změna titulku
     */
    componentDidMount() {

        document.title = "Přehled | Web Bank";
    }


    /**
     * Vykreslení
     */
    render() {

        return (
            <div className={styles.content}>

                {/* Navigační panel (odhlášení) */}
                <NavigationPanel 
                    setUserID={this.props.setUserID} 
                    timeInterval={5 * 60}/>

                <div className={styles.container}>

                    <div className={styles.firstColumn}>

                        {/* Informace o účtu */}
                        <AccountInfo 
                            userID={this.props.userID} 
                            setCurrency={this.setCurrency} 
                            currency={this.state.currency} />

                        {/* Informace o kreditní kartě */}
                        <CreditCardInfo userID={this.props.userID} />
                            
                        {/* Přesměrování na novou platbu */}
                        <Link id="newPayment" className={styles.newPaymentLink} to="/nova-platba">
                            Nová platba
                        </Link>

                        {/* Přehled plateb */}
                        <PaymentReport 
                            userID={this.props.userID}
                            currency={this.state.currency} />
                    </div>

                    {/* Historie plateb */}
                    <PaymentHistory 
                        userID={this.props.userID}
                        currency={this.state.currency} />
                </div>
            </div>
        )
    }

}