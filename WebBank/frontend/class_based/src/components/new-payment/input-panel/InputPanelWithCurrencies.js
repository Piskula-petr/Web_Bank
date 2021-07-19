import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/new-payment/new-payment.module.css";

class InputPanelWithCurrencies extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {

            // Seznam dospotupných měn
            currencies: [],
        }
    }


    /**
     * Získání seznamu měn
     */
    componentDidMount() {

        // Request - vrací seznam měn
        axios.get("http://localhost:8080/api/currencies", {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            // Setřízení podle ID
            currencies: data.sort((a, b) => {return a.id - b.id})

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render() {

        const { name, label, placeholder, error, onChange } = this.props;

        return(
            <div className={styles.inputContainer}>
                
                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.error}>{error}</div>      

                    <input 
                        id={name} 
                        className={`${styles.input} ${styles.amountInput}`}
                        placeholder={placeholder} 
                        type="text"
                        name={name}
                        onChange={onChange} />

                    {/* Výběr měny */}
                    <select className={styles.select} name="currency" onChange={onChange}>

                        {this.state.currencies.map(item =>

                            <option key={item.id} name="currency" value={item.code}>
                                {item.code}
                            </option>
                        )}
                    </select>
                </div>
            </div>
        )
    }
}

export default InputPanelWithCurrencies