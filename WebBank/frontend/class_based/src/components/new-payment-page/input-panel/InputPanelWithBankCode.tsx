import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BankCode } from "modules/interfaces/bankCode";

import styles from "components/new-payment-page/new-payment.module.css";
import bank from "images/bank.png";
import caretDown from "images/caret_down.png";

interface InputPanelWithBankCodeProps {
    name: string,
    label: string,
    pattern: string,
    value: string,
    error: string,
    onChange: (event: any) => void,
    toggleBankCodes: () => void,
    onClick: (event: any) => void,
    bankCode: string | null,
    selection: boolean
}

interface InputPanelWithBankCodeState {
    bankCodes: Array<BankCode>
}

class InputPanelWithBankCode extends Component <InputPanelWithBankCodeProps, InputPanelWithBankCodeState> {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: InputPanelWithBankCodeProps) {
        super(props);

        this.state = {

            // Seznam bankovních kódů
            bankCodes: [],
        }
    }


    /**
     * Získání dat
     */
    componentDidMount(): void {

        // Request - vrací seznamu bankovních kódů
        axios.get("http://localhost:8080/api/bankCodes", {

            headers: {
                Authorization: "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            bankCodes: data

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render(): JSX.Element {

        const { name, label, error, pattern, value, onChange, onClick, toggleBankCodes, bankCode, selection } = this.props; 

        return(
            <div className={styles.inputContainer}>

                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.error}>{error}</div>

                    <input 
                        id={name} 
                        className={`${styles.input} ${styles.accountNumberPrefix}`}
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
                        
                            {this.state.bankCodes.map(item => 
                                
                                //@ts-ignore
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

export default InputPanelWithBankCode