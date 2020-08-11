import React, {Component} from "react";

export default class InputPanelWithConfirmation extends Component {

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        return(
            <tr>
                <td>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                </td>

                <td>
                    <div id="confirmationError">{this.props.error}</div>

                    <input id={this.props.name} 
                           ref={this.props.createRef}
                           type="text"
                           name={this.props.name}
                           onChange={this.props.onChange} 
                    />

                    <div id="confirmationValue">{this.props.generatedValue}</div>
                </td>
            </tr>
        )
    }
}