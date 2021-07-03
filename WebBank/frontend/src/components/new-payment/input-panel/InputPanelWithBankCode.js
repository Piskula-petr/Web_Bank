import React, {Component} from "react";
import axios from "axios";

import styles from "components/new-payment/new-payment.module.css";
import bank from "images/bank.png";
import caretDown from "images/caret_down.png";

export default class InputPanelWithBankCode extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {

            // Seznam bankovních kódů
            bankCodes: [],
        }
    }


    /**
     * Získání seznamu bankovních kódů
     */
    componentDidMount() {

        // Request - vrací kódy bank
        axios.get("http://localhost:8080/api/bankCodes")
            .then(({ data }) => this.setState({

            bankCodes: data

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render() {

        const { name, label, error, placeholder, onChange, onClick, bankCode, selection } = this.props; 

        return(
            <div className={styles.inputContainer}>

                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.error}>{error}</div>

                    <input 
                        id={name} 
                        className={`${styles.input} ${styles.accountNumberPrefix}`}
                        placeholder={placeholder} 
                        type="text" 
                        name={name} 
                        onChange={onChange} />

                    {/* Výběr banky */}
                    <div className={styles.bankCodesSelect} onClick={onClick}>

                        <div>
                            <div>{bankCode}</div>

                            <img src={bank} alt="Bank" 
                                className={`${styles.bank} ${(bankCode) ? styles.hide : ""}`} />

                            <img src={caretDown} alt="Caret Down"
                                className={`${styles.caretDown} ${(bankCode) ? styles.hide : ""}`} />
                        </div>

                        <div className={`${styles.bankCodesChoice} ${(selection) ? styles.show : styles.hide}`}>
                        
                            {this.state.bankCodes.map(item => 
                                
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
}