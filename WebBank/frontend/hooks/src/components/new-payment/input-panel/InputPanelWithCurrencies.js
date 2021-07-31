import React, {useState, useEffect} from 'react'
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/new-payment/new-payment.module.css";

function InputPanelWithCurrencies(props) {

    // Seznam dostupných měn
    const [ currencies, setCurrencies ] = useState([])


    useEffect(() => {

        // Request - vrací seznam měn
        axios.get("http://localhost:8080/api/currencies", {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            } 

        }).then(({ data }) => setCurrencies(

            // Setřízení podle ID
            data.sort((a, b) => {return a.id - b.id}

        ))).catch((error) => console.log(error));

    }, [])

    
    const { name, label, pattern, value, placeholder, error, onChange, onClick } = props;

    /**
     * Vykreslení
     */
    return (
        <div className={styles.inputContainer}>
                
            <label htmlFor={name}>{label}</label>

            <div>
                <div className={styles.error}>{error}</div>      

                <input 
                    id={name} 
                    className={`${styles.input} ${styles.amountInput}`}
                    placeholder={placeholder} 
                    pattern={pattern}
                    value={value}
                    name={name}
                    onChange={onChange} />

                {/* Výběr měny */}
                <select className={styles.select} name="currency" onClick={onClick}>

                    {currencies.map(item =>

                        <option key={item.id} name="currency" value={item.code}>
                            {item.code}
                        </option>
                    )}
                </select>
            </div>
        </div>
    )
}

export default InputPanelWithCurrencies
