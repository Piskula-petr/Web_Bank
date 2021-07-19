import React, {Component} from "react";

import styles from "components/new-payment/new-payment.module.css";

class InputPanelWithConfirmation extends Component {


    /**
     * Vykreslení
     */
    render() {

        const { name, label, error, onChange, createRef, generatedValue } = this.props;

        return(
            <div className={styles.inputContainer}>

                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.confirmationError}>{error}</div>

                    <input 
                        id={name} 
                        className={`${styles.input} ${styles.confirmationInput}`}
                        ref={createRef}
                        type="text"
                        name={name}
                        onChange={onChange} 
                        autoComplete="off" />

                    <div className={styles.confirmationValue}>{generatedValue}</div>
                </div>
            </div>
        )
    }
}

export default InputPanelWithConfirmation