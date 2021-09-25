import React from 'react'
import { ScrollView, View  } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { styles } from "components/overview-screen/overviewScreenStyle";
import AccountInfo from "components/overview-screen/account-info/AccountInfo";
import CreditCardInfo from "components/overview-screen/credit-card-info/CreditCardInfo";
import PaymentReport from "components/overview-screen/payment-report/PaymentReport";
import NavigationPanel from 'components/navigation-panel/NavigationPanel';

const OverviewPage: React.FC = () => {


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>

            <StatusBar translucent={true} backgroundColor="transparent" style="light" />        

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