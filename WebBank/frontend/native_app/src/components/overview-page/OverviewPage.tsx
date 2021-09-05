import React from 'react'
import { ImageBackground, ScrollView, View  } from 'react-native'

import { styles } from "components/overview-page/overviewPageStyle";
import AccountInfo from "components/overview-page/account-info/AccountInfo";
import CreditCardInfo from "components/overview-page/credit-card-info/CreditCardInfo";
import PaymentReport from "components/overview-page/payment-report/PaymentReport";
import NavigationPanel from 'components/navigation-panel/NavigationPanel';

const OverviewPage: React.FC = () => {


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            <ScrollView>
                <View style={styles.previewContainer}>
                        
                    {/* Informace o účtu */}
                    <AccountInfo />
                    
                    {/* Informace o kreditní kartě */}
                    <CreditCardInfo />

                    {/* Přehled plateb */}
                    <PaymentReport />

                </View>
            </ScrollView>

            {/* Navigační panel */}
            <NavigationPanel isOverviewActive={true} />

        </View>
    )
}

export default OverviewPage