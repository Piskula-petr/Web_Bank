import React, { useEffect } from 'react'
import {Link, Redirect} from "react-router-dom";
import { connect } from 'react-redux';

import styles from "components/overview-page/overviewPage.module.css";
import NavigationPanel from "components/navigation-panel/NavigationPanel";
import AccountInfo from "components/overview-page/account-info/AccountInfo";
import CreditCardInfo from "components/overview-page/credit-card-info/CreditCardInfo";
import PaymentReport from "components/overview-page/payment-report/PaymentReport";
import PaymentHistory from "components/overview-page/payment-history/PaymentHistory";
import { State } from "redux/rootReducer";

interface OverviewPageProps {
    userID: number
}

const OverviewPage: React.FC<OverviewPageProps> = (props) => {


    /**
     * Inicializace komponenty
     */
    useEffect(() => {

        // Změna titulku
        document.title = "Přehled | Web Bank";

    }, [])

    
    // Přesměrování na přihlášení
    if (props.userID === 0) {

        return <Redirect to="/prihlaseni" />
    }

    
    /**
     * Vykreslení
     */
    return (
        <div className={styles.content}>

            {/* Navigační panel (odhlášení) */}
            <NavigationPanel 
                timeInterval={5 * 60}/>

            <div className={styles.container}>

                <div className={styles.firstColumn}>

                    {/* Informace o účtu */}
                    <AccountInfo />

                    {/* Informace o kreditní kartě */}
                    <CreditCardInfo />
                        
                    {/* Přesměrování na novou platbu */}
                    <Link id="newPayment" className={styles.newPaymentLink} to="/nova-platba">
                        Nová platba
                    </Link>

                    {/* Přehled plateb */}
                    <PaymentReport />
                </div>

                {/* Historie plateb */}
                <PaymentHistory />
            </div>
        </div>
    )
}

const mapStateToProps = (state: State) => {

    return {
        userID: state.user.userID,
        currency: state.currency
    }
}

export default connect(mapStateToProps) (OverviewPage)