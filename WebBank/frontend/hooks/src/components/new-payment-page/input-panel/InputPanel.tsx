import React from 'react'

import styles from "components/new-payment-page/new-payment-page.module.css";

interface InputPanelProps {
    name: string,
    label: string,
    pattern: string,
    value: string,
    error?: string,
    onChange: (event: any) => void
}

const InputPanel: React.FC<InputPanelProps> = (props) => {

    
    const { name, label, pattern, value, error, onChange } = props;


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
                    className={styles.input}
                    pattern={pattern}
                    value={value}
                    name={name}
                    onChange={onChange} />
            </div>
        </div> 
    )
}

export default InputPanel