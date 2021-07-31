import React, {PureComponent} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";

import styles from "components/overview-page/credit-card-info/credit-card-info.module.css";
import creditCardLogo from "images/credit_card.png";

class CreditCardInfo extends PureComponent {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {

            // Kreditní karta
            creditCard: {
                id: 0,
                cardNumber: 0,
                validFrom: "",
                validTo: "",
                type: "",
            },

            // Jméno uživatele
            name: "",
            surname: "",
        }
    }


    /**
     * Získání dat
     */
    componentDidMount() {

        // Request - vrací kreditní kartu, podle ID uživatele
        axios.get(`http://localhost:8080/api/creditCard/userID=${this.props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            creditCard: data,

        })).catch((error) => console.log(error));

        // Request - vrací uživatele, podle ID
        axios.get(`http://localhost:8080/api/userInfo/userID=${this.props.userID}`, {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({data: { name, surname }}) => this.setState({

            name,
            surname

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render() {

        const { creditCard, name, surname } = this.state;

        return(
            <div className={styles.creditCard}>
                
                {/* Obrázek */}
                <img className={styles.previewImage} src={creditCardLogo} alt="Credit Card" />

                {/* Typ platební karty */}
                <div className={styles.type}>
                    {creditCard.type}
                </div>

                {/* Jméno uživatele */}
                <div className={styles.user}>
                    {name} {surname}
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
}

const mapStateToProps = (state) => {

    return {
        userID: state.user.userID
    }
}

export default connect(mapStateToProps) (CreditCardInfo)