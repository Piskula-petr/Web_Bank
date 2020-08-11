import React, {Component} from "react";

export default class InputPanel extends Component {

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
                </td>
            </tr>
        )
    }
}