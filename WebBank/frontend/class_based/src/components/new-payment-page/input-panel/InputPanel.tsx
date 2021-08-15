import React, {Component} from "react";

import styles from "components/new-payment-page/new-payment.module.css";

interface InputPanelProps {
    name: string,
    label: string,
    placeholder?: string,
    pattern: string,
    value: string,
    error: string,
    onChange: (event: any) => void
}

class InputPanel extends Component <InputPanelProps> {

    
    /**
     * Vykreslení
     */
    render(): JSX.Element {

        const { name, label, placeholder, pattern, value,  error, onChange } = this.props;

        return(
            <div className={styles.inputContainer}>

                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.error}>{error}</div>

                    <input 
                        id={name} 
                        className={styles.input}
                        placeholder={placeholder} 
                        pattern={pattern}
                        value={value}
                        name={name}
                        onChange={onChange}/>
                </div>
            </div>    
        )
    }
}

export default InputPanel