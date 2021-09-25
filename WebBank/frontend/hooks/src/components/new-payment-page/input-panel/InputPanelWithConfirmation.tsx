import React from 'react'

import styles from "components/new-payment-page/new-payment-page.module.css";

interface InputPanelWithConfirmationProps {
    name: string,
    label: string,
    pattern: string,
    value: string,
    error: string,
    onChange: (event: any) => void,
    generatedConfirmationCode: number
}

const InputPanelWithConfirmation: React.FC<InputPanelWithConfirmationProps> = (props) => {

    
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