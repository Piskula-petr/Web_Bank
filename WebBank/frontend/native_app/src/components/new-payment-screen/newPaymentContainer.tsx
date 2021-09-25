import React from 'react'
import { View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import { styles } from "components/new-payment-screen/newPaymentStyle";
import NavigationPanel from "components/navigation-panel/NavigationPanel";

interface newPaymentContainerProps {
    headerText: string,
    label?: Label,
}

type Label = "Povinný údaj" | "Nepovinný údaj";

const newPaymentContainer: React.FC<newPaymentContainerProps> = (props) => {


    const { label, headerText, children } = props;


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>
            
            <StatusBar translucent={true} backgroundColor="transparent" style="light" />

            <View style={styles.newPaymentContainer}>

                {/* Záhlaví */} 
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Nová platba</Text>
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>

                {label && <Text style={styles.label}>{label}</Text>}

                {children}
                
            </View>

            {/* Navigační panel */}
            <NavigationPanel isNewpaymentActive={true} />

        </View>
    )
}

export default newPaymentContainer
