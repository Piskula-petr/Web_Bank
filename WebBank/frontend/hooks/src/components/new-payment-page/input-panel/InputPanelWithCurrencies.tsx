import React, { useState, useEffect } from 'react'
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/new-payment-page/new-payment-page.module.css";
import { Currency } from 'modules/interfaces/currency';

interface InputPanelWithCurrenciesProps {
    name: string,
    label: string,
    placeholder: string,
    pattern: string,
    value: string,
    error: string,
    onChange: (event: any) => void,
    onClick: (event: any) => void
}

const InputPanelWithCurrencies: React.FC<InputPanelWithCurrenciesProps> = (props) => {

    // Seznam dostupných měn
    const [ currencies, setCurrencies ] = useState<Array<Currency>>([])


    useEffect(() => {

        // Request - vrací seznam měn
        axios.get("http://localhost:8080/api/currencies", {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            } 

        }).then(({ data }) => setCurrencies(

            // Setřízení podle ID
            data.sort((a: Currency, b: Currency) => {return a.id - b.id}

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

                        //@ts-ignore
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
