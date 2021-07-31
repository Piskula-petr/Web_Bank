import React from 'react'

import styles from "components/new-payment/new-payment.module.css";

function InputPanelWithConfirmation(props) {

    const { name, label, value, pattern, error, onChange, generatedConfirmationCode } = props;

    /**
     * Vykreslení
     */
    return (
        <div className={styles.inputContainer}>

            <label htmlFor={name}>{label}</label>

            <div>
                <div className={styles.confirmationError}>{error}</div>

                <input 
                    id={name} 
                    className={`${styles.input} ${styles.confirmationInput}`}
                    pattern={pattern}
                    value={value}
                    name={name}
                    onChange={onChange} 
                    autoComplete="off" />

                <div className={styles.confirmationValue}>{generatedConfirmationCode}</div>
            </div>
        </div>
    )
}

export default InputPanelWithConfirmation