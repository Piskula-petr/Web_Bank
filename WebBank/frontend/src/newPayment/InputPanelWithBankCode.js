import React, {Component} from "react";

import caretDown from "../images/caret_down.png";
import bank from "../images/bank.png";

export default class InputPanelWithBankCode extends Component {

// Konstruktor //////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.state = {

            // Seznam bankovních kódů
            bankCodes: [],
        }
    }

// Získání seznamu bankovních kódů ///////////////////////////////////////////////

    componentDidMount() {

        // Request - vrací kódy bank
        fetch("http://localhost:8080/api/bank-codes", {

            method: "POST",

        }).then(response => response.json().then(data => this.setState({
            
            bankCodes: data,
        })));
    }

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        return(
            <tr>
                <td>
                    <label htmlFor={this.props.name}>Číslo účtu:</label>
                </td>

                <td>
                    <div id="error">{this.props.error}</div>

                    <input id={this.props.name} 
                           placeholder={this.props.placeholder} 
                           type="text" 
                           name={this.props.name} 
                           onChange={this.props.onChange} />

                    <div id="bankCodesSelect" onClick={this.props.onClick}>
                        <div>
                            <div>{this.props.bankCode}</div>

                            <img id="bank" src={bank} alt="Bank" 
                                className={(this.props.bankCode) ? "hide" : ""} />

                            <img id="caretDown" src={caretDown} alt="Caret Down"
                                className={(this.props.bankCode) ? "hide" : ""} />
                        </div>

                        <div id="bankCodesChoice" className={(this.props.selection) ? "show" : "hide"}>
                            {this.state.bankCodes.map((item, index) => 
                                
                                <div id="bankCode" key={index} onClick={this.props.onClick} name={item.code}>
                                    {item.code} - {item.name}
                                </div>
                            )} 
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}