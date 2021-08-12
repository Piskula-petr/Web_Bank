import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Currency } from "modules/interfaces/currency";

import styles from "components/new-payment-page/new-payment.module.css";

interface InputPanelWithCurrenciesProps {
    name: string,
    label: string,
    placeholder: string,
    pattern: string,
    value: string,
    error: string,
    onChange: (event: any) => void,
    onClick: (event: any) => void
}

interface InputPanelWithCurrenciesState {
    currencies: Array<Currency>
}

class InputPanelWithCurrencies extends Component <InputPanelWithCurrenciesProps, InputPanelWithCurrenciesState> {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: InputPanelWithCurrenciesProps) {
        super(props);

        this.state = {

            // Seznam dospotupných měn
            currencies: [],
        }
    }


    /**
     * Získání dat
     */
    componentDidMount(): void {

        // Request - vrací seznam měn
        axios.get("http://localhost:8080/api/currencies", {

            headers: {
                "Authorization": "Bearer " + Cookies.getJSON("jwt").token
            }

        }).then(({ data }) => this.setState({

            // Setřízení podle ID
            currencies: data.sort((a: Currency, b: Currency) => {return a.id - b.id})

        })).catch((error) => console.log(error));
    }


    /**
     * Vykreslení
     */
    render(): JSX.Element {

        const { name, label, pattern, value, placeholder, error, onChange, onClick } = this.props;

        return(
            <div className={styles.inputContainer}>
                
                <label htmlFor={name}>{label}</label>

                <div>
                    <div className={styles.error}>{error}</div>      

                    <input 
                        id={name} 
                        className={`${styles.input} ${styles.amountInput}`}
                        placeholder={placeholder} 
                        pattern={pattern}
                        value={value}
                        name={name}
                        onChange={onChange} />

                    {/* Výběr měny */}
                    <select className={styles.select} name="currency" onClick={onClick}>

                        {this.state.currencies.map(item =>

                            //@ts-ignore
                            <option key={item.id} name="currency" value={item.code}>
                                {item.code}
                            </option>
                        )}
                    </select>
                </div>
            </div>
        )
    }
}

export default InputPanelWithCurrencies