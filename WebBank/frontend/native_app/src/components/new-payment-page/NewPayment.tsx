import React from 'react'
import { View, Text } from 'react-native'

import { styles } from "components/new-payment-page/newPaymentStyle";
import NavigationPanel from "components/navigation-panel/NavigationPanel";

interface NewPaymentProps {

}

const NewPayment: React.FC<NewPaymentProps> = (props) => {


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>
            <Text>NEW PAYMENT</Text>

            {/* Navigační panel */}
            <NavigationPanel isNewpaymentActive={true} />
        </View>
    )
}

export default NewPayment

