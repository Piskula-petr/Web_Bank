import React, {useEffect} from 'react'
import {Link} from "react-router-dom";

import styles from "components/overview-page/overviewPage.module.css";
// import NavigationPanel from "components/navigation-panel/NavigationPanel";
import AccountInfo from "components/overview-page/account-info/AccountInfo";
import CreditCardInfo from "components/overview-page/credit-card-info/CreditCardInfo";
import PaymentReport from "components/overview-page/payment-report/PaymentReport";
// import PaymentHistory from "components/payment-history/PaymentHistory";

const OverviewPage = () => {


    useEffect(() => {

        // Změna titulku
        document.title = "Přehled | Web Bank";

    }, [])


    /**
     * Vykreslení
     */
    return (
        <div className={styles.content}>

            {/* Navigační panel (odhlášení) */}
            {/* <NavigationPanel 
                timeInterval={5 * 60}/> */}

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
                {/* <PaymentHistory /> */}
            </div>
        </div>
    )
}

export default OverviewPage