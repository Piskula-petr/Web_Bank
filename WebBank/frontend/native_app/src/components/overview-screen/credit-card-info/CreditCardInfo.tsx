import React, { useEffect, useState } from 'react'
import { View, Image, Text } from 'react-native'
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";

import { styles } from "components/overview-screen/credit-card-info/creditCardInfoStyle";
import { State } from "modules/redux/rootReducer";
import { CreditCard } from 'modules/interfaces/creditCard';
import { User } from "modules/interfaces/user";
import creditCardLogo from "assets/credit_card.png";
import { IP_ADRESS } from "modules/IPAdress";

interface CreditCardInfoProps {
    userID: number
}

const CreditCardInfo: React.FC<CreditCardInfoProps> = (props) => {


    // Kreditní karta
    const [ creditCard, setCreditCard ] = useState<CreditCard>({
        id: 0,
        cardNumber: 0,
        validFrom: "",
        validTo: "",
        type: ""
    }) 


    // Jméno uživatele
    const [ user, setUser ] = useState<User>({
        name: "",
        surname: ""
    })


    /**
     * Získání dat
     */
    useEffect(() => {

        SecureStore.getItemAsync("jwt").then((value) => {

            if (value) {

                const { token } = JSON.parse(value);

                // Request - vrací kreditní kartu, podle ID uživatele
                axios.get(`http://${IP_ADRESS}:8080/api/creditCard/userID=${props.userID}` , {

                    headers: { Authorization: "Bearer " + token }

                }).then(({ data }) => setCreditCard(data))
                    .catch((error) => console.log(error));

                // Request - vrací uživatele, podle ID
                axios.get(`http://${IP_ADRESS}:8080/api/userInfo/userID=${props.userID}` , {

                    headers: { Authorization: "Bearer " + token }

                }).then(({data: { name, surname }}) => setUser({

                    name,
                    surname

                })).catch((error) => console.log(error));
            }
        });

    }, [])


    /**
     * Vykreslení
     */
    return (
        <View style={styles.container}>
            
            {/* Logo */}
            <Image style={styles.logo} source={creditCardLogo} />

            {/* Typ platební karty */}
            <Text style={styles.type}>{creditCard.type}</Text>

            {/* Jméno uživatele */}
            <Text style={styles.user}>{user.name} {user.surname}</Text>

            {/* Platí od */}
            <Text style={styles.validFrom}>
                Platí od: <Text style={styles.bold}>{creditCard.validFrom}</Text>
            </Text>

            {/* Platí do */}
            <Text style={styles.validTo}>
                Platí do: <Text style={styles.bold}>{creditCard.validTo}</Text>
            </Text>

            {/* Číslo kreditní karty */}
            <Text style={styles.cardNumberLabel}>Číslo karty:</Text>
            <Text style={styles.cardNumber}>{creditCard.cardNumber}</Text>

        </View>
    )    
}

const mapStateToProps = (state: State) => {
  
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps) (CreditCardInfo)
