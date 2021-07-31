import React, {Component} from "react";

import styles from "components/new-payment/new-payment.module.css";

class InputPanelWithConfirmation extends Component {


    /**
     * Vykreslení
     */
    render() {

        const { name, label, value, pattern, error, onChange, generatedConfirmationCode } = this.props;

        return(
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
}

export default InputPanelWithConfirmation