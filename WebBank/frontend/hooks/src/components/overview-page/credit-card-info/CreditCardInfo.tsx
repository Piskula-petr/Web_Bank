import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Cookies from 'js-cookie';

import styles from "components/overview-page/credit-card-info/credit-card-info.module.css";
import creditCardLogo from "images/credit_card.png";
import { CreditCard } from "modules/interfaces/creditCard";
import { User } from "modules/interfaces/user";
import { State } from 'redux/rootReducer';

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

        // Request - vrací kreditní kartu, podle ID uživatele
        axios.get(`http://localhost:8080/api/creditCard/userID=${props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setCreditCard(data))
            .catch((error) => console.log(error));

        // Request - vrací uživatele, podle ID
        axios.get(`http://localhost:8080/api/userInfo/userID=${props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({data: { name, surname }}) => setUser({

            name,
            surname

        })).catch((error) => console.log(error));

    }, [props.userID])


    /**
     * Vykreslení
     */
    return (
        <div className={styles.creditCard}>
                
            {/* Obrázek */}
            <img className={styles.previewImage} src={creditCardLogo} alt="Credit Card" />

            {/* Typ platební karty */}
            <div className={styles.type}>
                {creditCard.type}
            </div>

            {/* Jméno uživatele */}
            <div className={styles.user}>
                {user.name} {user.surname}
            </div>
            
            {/* Platí od */}
            <div className={styles.validFrom}>
                Platí od: <b>{creditCard.validFrom}</b>
            </div>

            {/* Platí do */}
            <div className={styles.validTo}>
                Platí do: <b>{creditCard.validTo}</b>
            </div>

            {/* Číslo kreditní karty */}
            <div>Číslo karty:

                <div className={styles.cardNumber}>
                    {creditCard.cardNumber}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: State) => {
  
    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps)(CreditCardInfo)
