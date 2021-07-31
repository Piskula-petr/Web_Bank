import React, {Component} from "react";

import styles from "components/new-payment/new-payment.module.css";

class InputPanel extends Component {

    
    /**
     * Vykreslení
     */
    render() {

        const { name, label, pattern, value,  error, placeholder, onChange } = this.props;

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