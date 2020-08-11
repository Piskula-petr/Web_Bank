import React, {Component} from "react";

export default class InputPanelWithCurrencies extends Component {

// Konstruktor //////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.state = {

            // Seznam dospotupných měn
            currencies: [],
        }
    }

// Získání seznamu měn ////////////////////////////////////////////////////////////

    componentDidMount() {

        // Request - vrací seznam měn
        fetch("http://localhost:8080/api/currencies").then(response => response.json()
            .then(data => this.setState({
                currencies: data.sort((a, b) => {return a.id - b.id}),
        })));
    }

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        return(
            <tr>
                <td>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                </td>

                <td>
                    <div id="error">{this.props.error}</div>      

                    <input id={this.props.name} 
                           placeholder={this.props.placeholder} 
                           type="text"
                           name={this.props.name}
                           onChange={this.props.onChange}
                    />

                    <select name="currency" onChange={this.props.onChange}>

                        {this.state.currencies.map((item, index) =>

                            <option key={index} name="currency" value={item.code}>
                                {item.code}
                            </option>
                        )}
                    </select>
                </td>
            </tr>
        )
    }
}