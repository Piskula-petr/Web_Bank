import React, {useState, useEffect} from 'react'
import axios from "axios";
import Cookies from "js-cookie";

import styles from "components/new-payment/new-payment.module.css";
import bank from "images/bank.png";
import caretDown from "images/caret_down.png";

function InputPanelWithBankCode(props) {


    // Seznam bankovních kódů
    const [ bankCodes, setBankCodes ] = useState([])


    /**
     * Získání dat
     */
    useEffect(() => {

        // Request - vrací seznamu bankovních kódů
        axios.get("http://localhost:8080/api/bankCodes", {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => setBankCodes(data))
            .catch((error) => console.log(error));

    }, [])


    const { name, label, error, pattern, value, placeholder, onChange, onClick, toggleBankCodes, bankCode, selection } = props; 

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
                    className={`${styles.input} ${styles.accountNumberPrefix}`}
                    placeholder={placeholder} 
                    pattern={pattern}
                    value={value}
                    name={name} 
                    onChange={onChange} />

                {/* Výběr banky */}
                <div className={styles.bankCodesSelect} onClick={toggleBankCodes}>

                    <div>
                        <div>{bankCode}</div>

                        <img src={bank} alt="Bank" 
                            className={`${styles.bank} ${(bankCode) ? styles.hide : ""}`} />

                        <img src={caretDown} alt="Caret Down"
                            className={`${styles.caretDown} ${(bankCode) ? styles.hide : ""}`} />
                    </div>

                    <div className={`${styles.bankCodesChoice} ${(selection) ? styles.show : styles.hide}`}>
                    
                        {bankCodes.map(item => 
                            
                            <div id="bankCode" key={item.id} onClick={onClick} name={item.code}>
                                {item.code} - {item.name}
                            </div>
                        )} 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputPanelWithBankCode